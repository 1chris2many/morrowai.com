import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {briefs} from '../scripts/theme-current.mjs';
import {narration,audioHash,audioEntry,durationLabel} from '../scripts/brief-audio.mjs';
import {renderThemes,validateBriefs} from '../scripts/theme-pages.mjs';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('audio/briefs/manifest.json',root)));
const home=await readFile(new URL('index.html',root),'utf8');
const feed=JSON.parse(await readFile(new URL('news.json',root)));
test('every briefing has current, nonempty audio with a matching transcript and checksum',async()=>{
 for(const b of briefs){
  const a=audioEntry(b,manifest);assert.ok(a,b.id);assert.ok(a.duration>60&&a.duration<360);
  const bytes=await readFile(new URL(a.src,root));assert.equal(bytes.length,a.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),a.sha256);
  assert.equal(await readFile(new URL(a.src+'.txt',root),'utf8'),narration(b)+'\n');
 }
});
test('any narrated-content edit invalidates audio; feed-only changes do not',()=>{
 for(const b of briefs){
  for(const prop of ['title','summary','meaning','watch','timelineIntro','reviewedAt']){const copy=structuredClone(b);copy[prop]+=' changed';if(prop==='reviewedAt')copy[prop]='2026-10-11';assert.notEqual(audioHash(copy),audioHash(b));assert.equal(audioEntry(copy,manifest),null);}
  const copy=structuredClone(b);copy.developments[0].text+=' New evidence.';assert.equal(audioEntry(copy,manifest),null);
  assert.equal(audioHash({...b,relatedCount:999}),audioHash(b));
 }
 const bad=structuredClone(manifest);bad.briefs[briefs[0].id].src='https://other.example/audio';assert.equal(audioEntry(briefs[0],bad),null);
});
test('HTML-first players disclose synthesis, offer transcripts and never autoplay',()=>{
 const html=renderThemes(home,feed);
 assert.equal((html.match(/<audio controls preload="none"/g)||[]).length,briefs.length);
 assert.equal((html.match(/Synthetic voice/g)||[]).length,briefs.length);
 assert.equal((html.match(/Read the narration transcript/g)||[]).length,briefs.length);
 assert.doesNotMatch(html,/autoplay/);
 const stale=renderThemes(home,feed,{audioManifest:{}});assert.doesNotMatch(stale,/<audio/);assert.match(stale,/Narration is being updated/);
 assert.equal(durationLabel(59.8),'1:00');
});
test('every timeline connects the events; quantitative highlights require source context',()=>{
 for(const b of briefs){assert.ok(b.timelineIntro.length>60);const text=narration(b);assert.ok(text.includes(b.timelineIntro));assert.doesNotMatch(text,/https:\/\/|related stories|Open filtered/);}
 const invalid=structuredClone(briefs);invalid[0].metric={value:'99%',label:'Claim',context:'Unknown',sourceId:-1};assert.throws(()=>validateBriefs(feed,invalid),/Metric/);
 assert.equal(briefs.filter(b=>b.metric).length,3);
 const workplace=briefs.find(b=>b.id==='workplace-agents');assert.equal(workplace.developments.length,5);assert.doesNotMatch(narration(workplace),/strongest tested configuration/);
 assert.match(narration(briefs.find(b=>b.id==='safety-vs-capability')),/Fairwind, Google’s program for trusted cyber defenders/);
});
