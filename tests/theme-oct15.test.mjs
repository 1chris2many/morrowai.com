import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {beforeThemeRename,beforeOct21,beforeOct22} from './theme-name-history.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
import {audioEntry} from '../scripts/brief-audio.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const reviewDay=briefs.map(b=>b.reviewedAt).sort().at(-1);
const safety=briefs.find(b=>b.id==='safety-vs-capability');
test('October15 safety update distinguishes misuse and preserves source dates and earlier timeline',()=>{
 assert.ok(safety.reviewedAt>='2026-10-15');
 const election=safety.developments.find(d=>d.id===963);
 assert.match(election.text,/Anthropic says/);
 assert.match(election.text,/could miss election abuse spread across ordinary-looking requests/);
 assert.match(election.text,/classifiers targeting multi-step misuse/);
 assert.match(beforeOct22(safety).watch,/legitimate work blocked/);
 const historical=[963,958,950,945,940,939,896];
 assert.deepEqual(safety.developments.filter(d=>historical.includes(d.id)).map(d=>d.id),historical);
 assert.equal(election.date,'2026-10-14');
 assert.equal(election.url,'https://www.anthropic.com/news/2026-us-midterms');
 validateBriefs(feed);
 for(const change of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const altered=structuredClone(feed);altered.items=altered.items.map(i=>i.digestItemId===963?change(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(altered),/source 963/);
 }
});
test('October15 leaves unrelated briefings and their review dates unchanged',()=>{
 const expected={
  'ai-regulation':'569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f',
  // October18 permits exactly three timing spans; its regression reverses them to the original hash.
  'ai-infrastructure':'40a392ab01ed7e02ead8568f1896851a53aefc897dcfc254f60a76a1fca7146a'
 };
 for(const b of briefs.filter(b=>expected[b.id]))assert.equal(createHash('sha256').update(JSON.stringify(beforeThemeRename(b))).digest('hex'),expected[b.id]);
 assert.equal(lifecycle(briefs.find(b=>b.id==='evals'),'2026-10-16').status,'active');
});
test('October15 model and research updates retain availability and authorship limits',()=>{
 const work=briefs.find(b=>b.id==='workplace-agents'),open=briefs.find(b=>b.id==='open-weights');
 assert.ok(work.reviewedAt>='2026-10-16');assert.ok(open.reviewedAt>='2026-10-16');
 const meta=work.developments.find(d=>d.id===967),nv=open.developments.find(d=>d.id===965);
 assert.equal(meta.date,'2026-10-14');assert.match(meta.text,/ten manuscripts/);
 assert.match(meta.text,/Researchers led scientific decisions/);assert.match(meta.text,/contracted outside experts/);
 assert.equal(nv.date,'2026-10-15');assert.match(nv.text,/company says Bolt/);
 assert.match(nv.text,/24GB/);assert.match(nv.text,/due October 23/);
 const workHistory=[951,954,947,949,932,933,929],openHistory=[937,936,925];
 assert.deepEqual(work.developments.filter(d=>workHistory.includes(d.id)).map(d=>d.id),workHistory);
 assert.deepEqual(open.developments.filter(d=>openHistory.includes(d.id)).map(d=>d.id),openHistory);
 for(const id of [965,967])for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===id?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),new RegExp(`source ${id}`));
 }
});
test('new economics briefing distinguishes pricing structures and event dates',()=>{
 const b=briefs.find(b=>b.id==='agent-economics');
 assert.ok(b.reviewedAt>='2026-10-15');
 const original=b.developments.filter(d=>[961,946,935].includes(d.id));
 assert.deepEqual(original.map(d=>[d.id,d.date]),[[961,'2026-10-13'],[946,'2026-10-09'],[935,'2026-10-07']]);
 assert.equal(new Set(original.map(d=>new URL(d.url).hostname)).size,3);
 assert.match(b.summary,/fixed-choice decisions without an output-token charge/);
 assert.match(original[0].text,/expires November 30, 2026/);
 assert.match(original[1].text,/\$0\.042 per million input tokens/);
 assert.match(original[2].text,/Above that threshold/);
 assert.match(beforeOct21(b).meaning,/not measured savings between equivalent systems/);
 assert.match(beforeOct21(b).watch,/preserve the needed quality/);
 const queue=themeQueue(feed,reviewDay);
 assert.ok(!queue.candidates.some(c=>c.id===b.id));
 for(const id of [961,965,966,967,968])assert.ok(reviewedIds.includes(id));
 for(const id of [961,946,935]){
  const next=structuredClone(feed);next.items=next.items.filter(i=>i.digestItemId!==id);
  assert.throws(()=>validateBriefs(next),new RegExp(`source ${id}`));
 }
});
test('triaged sources clear pending updates without claiming a new governance synthesis',()=>{
 for(const id of [962,963,964])assert.ok(reviewedIds.includes(id));
 const queue=themeQueue(feed,reviewDay);
 assert.deepEqual(queue.updates.find(b=>b.id===safety.id).items,[]);
 assert.deepEqual(queue.updates.find(b=>b.id==='ai-regulation').items,[]);
 const stale={version:1,briefs:{[safety.id]:{hash:'0818b97ff9aa5ffb0285fbd01dad86e57533f616dd302f95dd42cc7c93784cad'}}};
 assert.equal(audioEntry(safety,stale),null);
});
