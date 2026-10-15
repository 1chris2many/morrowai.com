import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
import {audioEntry} from '../scripts/brief-audio.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const safety=briefs.find(b=>b.id==='safety-vs-capability');
test('October15 safety update distinguishes misuse and preserves source dates and earlier timeline',()=>{
 assert.equal(safety.reviewedAt,'2026-10-15');
 assert.match(safety.summary,/could miss deliberate abuse/);
 assert.match(safety.summary,/company says/);
 assert.match(safety.watch,/false alarms/);
 assert.deepEqual(safety.developments.map(d=>d.id),[963,958,950,945,940,939,896]);
 assert.equal(safety.developments[0].date,'2026-10-14');
 assert.equal(safety.developments[0].url,'https://www.anthropic.com/news/2026-us-midterms');
 validateBriefs(feed);
 for(const change of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const altered=structuredClone(feed);altered.items=altered.items.map(i=>i.digestItemId===963?change(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(altered),/source 963/);
 }
});
test('October15 leaves unrelated briefings and their review dates unchanged',()=>{
 const expected={
  'ai-regulation':'569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f',
  'ai-infrastructure':'8a936788eb82088ebef10d14d72b169559c8b2378f72c5ec840443536bba7ae5',
  evals:'46754145fab18cf562c7112526c2030a99a7aaf889fe0a130a366ec40b24529f'
 };
 for(const b of briefs.filter(b=>expected[b.id]))assert.equal(createHash('sha256').update(JSON.stringify(b)).digest('hex'),expected[b.id]);
 assert.equal(lifecycle(briefs.find(b=>b.id==='evals'),'2026-10-15').status,'watching');
});
test('October15 model and research updates retain availability and authorship limits',()=>{
 const work=briefs.find(b=>b.id==='workplace-agents'),open=briefs.find(b=>b.id==='open-weights');
 assert.equal(work.reviewedAt,'2026-10-15');assert.equal(open.reviewedAt,'2026-10-15');
 assert.equal(work.developments[0].id,967);assert.equal(work.developments[0].date,'2026-10-14');
 assert.match(work.summary,/ten manuscripts/);assert.match(work.summary,/Researchers retained responsibility/);
 assert.match(work.summary,/contracted outside experts/);
 assert.equal(open.developments[0].id,965);assert.equal(open.developments[0].date,'2026-10-15');
 assert.match(open.summary,/It says the Bolt model fits in 24GB/);assert.match(open.summary,/due October 23/);
 assert.match(open.summary,/planned for later in October/);
 assert.deepEqual(work.developments.slice(1).map(d=>d.id),[951,954,947,949,932,933,929]);
 assert.deepEqual(open.developments.slice(1).map(d=>d.id),[937,936,925]);
 for(const id of [965,967])for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===id?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),new RegExp(`source ${id}`));
 }
});
test('new economics briefing distinguishes pricing structures and event dates',()=>{
 const b=briefs.find(b=>b.id==='agent-economics');
 assert.equal(b.reviewedAt,'2026-10-15');
 assert.deepEqual(b.developments.map(d=>[d.id,d.date]),[[961,'2026-10-13'],[946,'2026-10-09'],[935,'2026-10-07']]);
 assert.equal(new Set(b.developments.map(d=>new URL(d.url).hostname)).size,3);
 assert.match(b.summary,/fixed-choice scores/);
 assert.match(b.developments[0].text,/expires November 30, 2026/);
 assert.match(b.developments[1].text,/\$0\.042 per million input tokens/);
 assert.match(b.developments[2].text,/Above that threshold/);
 assert.match(b.meaning,/total cost of an accepted result/);
 assert.match(b.meaning,/quality and response time/);
 const queue=themeQueue(feed,'2026-10-15');
 assert.ok(!queue.candidates.some(c=>c.id===b.id));
 for(const id of [961,965,966,967,968])assert.ok(reviewedIds.includes(id));
 for(const id of [961,946,935]){
  const next=structuredClone(feed);next.items=next.items.filter(i=>i.digestItemId!==id);
  assert.throws(()=>validateBriefs(next),new RegExp(`source ${id}`));
 }
});
test('triaged sources clear pending updates without claiming a new governance synthesis',()=>{
 for(const id of [962,963,964])assert.ok(reviewedIds.includes(id));
 const queue=themeQueue(feed,'2026-10-15');
 assert.deepEqual(queue.updates.find(b=>b.id===safety.id).items,[]);
 assert.deepEqual(queue.updates.find(b=>b.id==='ai-regulation').items,[]);
 const stale={version:1,briefs:{[safety.id]:{hash:'0818b97ff9aa5ffb0285fbd01dad86e57533f616dd302f95dd42cc7c93784cad'}}};
 assert.equal(audioEntry(safety,stale),null);
});
