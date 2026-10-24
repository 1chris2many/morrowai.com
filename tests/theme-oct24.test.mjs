import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {oct24Revision,beforeOct24} from './theme-name-history.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {narration,audioEntry} from '../scripts/brief-audio.mjs';
import {themeQueue} from '../scripts/theme-lifecycle.mjs';
const root=new URL('../',import.meta.url),read=p=>JSON.parse(readFileSync(new URL(p,root))),feed=read('news.json');
test('October24 revision preserves each prior development and metric; history adapter cannot hide stray edits',()=>{
 assert.equal(briefs.length,11);
 for(const[id,c]of Object.entries(oct24Revision.changes)){
  const b=briefs.find(x=>x.id===id);assert.deepEqual(b,c.after);assert.deepEqual(beforeOct24(b),c.before);
  assert.equal(b.title,c.before.title);assert.deepEqual(b.metric,c.before.metric);
  for(const d of c.before.developments)assert.deepEqual(b.developments.find(x=>x.id===d.id),d);
  for(const key of Object.keys(b)){const bad=structuredClone(b);bad[key]=typeof bad[key]==='string'?bad[key]+' unreviewed':null;assert.equal(beforeOct24(bad),bad,key);}
  assert.equal(beforeOct24({...b,unreviewed:true}).unreviewed,true);
 }
});
test('each new timeline source must remain reviewed and have its exact public source link',()=>{
 validateBriefs(feed);
 for(const id of[1016,1018,1019,1020])for(const mode of['missing','unreviewed','wrong-url']){
  const bad=structuredClone(feed);bad.items=bad.items.flatMap(i=>i.digestItemId!==id?[i]:mode==='missing'?[]:[{...i,reviewed:mode==='unreviewed'?false:i.reviewed,url:mode==='wrong-url'?'https://example.com/unreviewed':i.url,themes:[]}]);
  assert.throws(()=>validateBriefs(bad),new RegExp('source '+id));
 }
});
test('changed narration matches actual briefs and stale recordings cannot be selected',()=>{
 const manifest=read('audio/briefs/manifest.json');
 for(const[id,c]of Object.entries(oct24Revision.changes)){
  const b=briefs.find(x=>x.id===id),a=audioEntry(b,manifest);assert.ok(a);
  assert.equal(readFileSync(new URL(a.src+'.txt',root),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry(c.before,manifest),null);
 }
});
test('triage clears only read evidence without inventing a health theme or incorporating the held source',()=>{
 for(const id of[1016,1017,1018,1019,1020])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));
 assert.ok(!briefs.some(b=>b.developments.some(d=>[980,1017].includes(d.id))));
 const q=themeQueue(feed,'2026-10-24');assert.equal(q.updates.flatMap(x=>x.items).length,0);
 assert.equal(q.unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);assert.equal(q.candidates.length,0);
});
