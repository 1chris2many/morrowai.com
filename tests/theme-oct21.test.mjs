import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {oct21Revision,beforeOct21,beforeOct22} from './theme-name-history.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
import {related,validateBriefs,briefingCards,renderThemes} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const feed=read('news.json'),audio=read('audio/briefs/manifest.json');
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const get=id=>briefs.find(b=>b.id===id);
test('October21 exact source-reviewed copy preserves earlier economics developments',()=>{
 const b=beforeOct22(get('agent-economics')),c=oct21Revision.changes[b.id];
 assert.deepEqual(b,c.after);assert.deepEqual(b.developments.slice(1),c.before.developments);
 assert.deepEqual(b.metric,c.before.metric);assert.deepEqual(beforeOct21(b),c.before);
 assert.deepEqual(get('chip-switching'),oct21Revision.added[0]);assert.equal(briefs.length,11);
 for(const field of Object.keys(b)){
  const changed=structuredClone(b);changed[field]=typeof changed[field]==='string'?changed[field]+' changed':null;
  assert.equal(beforeOct21(changed),changed,field);
 }
 const extra={...b,unreviewed:true};assert.equal(beforeOct21(extra),extra);
});
test('chip comparison distinguishes trial access from optimization and preserves primary attribution',()=>{
 const b=get('chip-switching');
 assert.deepEqual(b.developments.map(d=>[d.id,d.date]),[[1001,'2026-10-20'],[1004,'2026-10-20']]);
 assert.match(b.summary,/minimal code changes/);assert.match(b.summary,/specialized engineering/);
 assert.match(b.meaning,/Our inference/);assert.match(b.watch,/equivalent models and quality/);
 assert.match(b.timelineIntro,/not a head-to-head/);
 validateBriefs(feed);
 assert.deepEqual(new Set(related(feed,b.id).map(i=>i.digestItemId)),new Set([1001,1004]));
 assert.ok(briefingCards(feed).includes('data-theme="chip-switching"'));
 const html=renderThemes(home,feed);assert.ok(html.includes('href="'+b.developments[0].primaryUrl+'"'));
 for(const url of ['javascript:alert(1)','http://example.com','https://user:pass@example.com']){
  const bad=structuredClone(briefs);bad.find(b=>b.id==='chip-switching').developments[0].primaryUrl=url;
  assert.throws(()=>validateBriefs(feed,bad),/Unsafe briefing source/);
 }
 for(const change of [i=>null,i=>({...i,reviewed:false}),i=>({...i,url:'https://example.com/unrelated'})]){
  const bad=structuredClone(feed);bad.items=bad.items.map(i=>i.digestItemId===1001?change(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(bad),/source 1001/);
 }
});
test('fixed state is compressed history, not free memory or proved customer savings',()=>{
 const b=beforeOct22(get('agent-economics'));assert.equal(b.reviewedAt,'2026-10-21');
 assert.match(b.developments[0].text,/29.5 MB of recurrent state per sequence/);
 assert.match(b.developments[0].text,/retrieval quality needs workload-specific evaluation/);
 assert.match(b.watch,/not lossless recall or fixed total system memory/);
 assert.match(b.meaning,/not measured savings for equivalent completed tasks/);
 assert.match(b.meaning,/promise of lower customer prices/);
 assert.match(b.watch,/October 31 at 16:00 UTC/);assert.match(b.watch,/November 30/);
});
test('both changed recordings bind exact visible text and stale variants fail closed',()=>{
 for(const id of ['chip-switching','agent-economics']){
  const b=get(id),a=audioEntry(b,audio);assert.ok(a);
  assert.equal(readFileSync(new URL('../'+a.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry({...b,meaning:b.meaning+' unreviewed'},audio),null);
 }
 assert.equal(audioEntry(oct21Revision.changes['agent-economics'].before,audio),null);
});
test('six-source triage does not refresh unrelated briefs or admit the held story',()=>{
 for(const id of [999,1000,1001,1002,1003,1004])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));
 const q=themeQueue(feed,'2026-10-21',briefs.map(beforeOct22));
 assert.equal(q.updates.flatMap(x=>x.items).length,0);assert.equal(q.candidates.length,0);
 assert.equal(q.unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);
 assert.equal(get('ai-regulation').reviewedAt,'2026-10-09');
 assert.equal(lifecycle(get('ai-regulation'),'2026-10-21').status,'watching');
 assert.equal(beforeOct22(get('ai-science')).reviewedAt,'2026-10-18');
 assert.ok(!briefs.some(b=>b.developments.some(d=>[999,1000,1002,1003].includes(d.id))));
});
