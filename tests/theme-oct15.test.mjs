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
test('October15 leaves every other briefing and its review date unchanged',()=>{
 const expected={
  'ai-regulation':'569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f',
  'workplace-agents':'e9a8d1062b031ac40182def4bd0351bc31dfeafc127d7e9da2c2b49af1f84dfd',
  'ai-infrastructure':'8a936788eb82088ebef10d14d72b169559c8b2378f72c5ec840443536bba7ae5',
  evals:'46754145fab18cf562c7112526c2030a99a7aaf889fe0a130a366ec40b24529f',
  'open-weights':'0a18b18453d9549651aec7ee093d69d0e40d1e02efc9bfaaa375a2018681aaef'
 };
 for(const b of briefs.filter(b=>b.id!==safety.id))assert.equal(createHash('sha256').update(JSON.stringify(b)).digest('hex'),expected[b.id]);
 assert.equal(lifecycle(briefs.find(b=>b.id==='evals'),'2026-10-15').status,'watching');
});
test('triaged sources clear pending updates without claiming a new governance synthesis',()=>{
 for(const id of [962,963,964])assert.ok(reviewedIds.includes(id));
 const queue=themeQueue(feed,'2026-10-15');
 assert.deepEqual(queue.updates.find(b=>b.id===safety.id).items,[]);
 assert.deepEqual(queue.updates.find(b=>b.id==='ai-regulation').items,[]);
 const stale={version:1,briefs:{[safety.id]:{hash:'0818b97ff9aa5ffb0285fbd01dad86e57533f616dd302f95dd42cc7c93784cad'}}};
 assert.equal(audioEntry(safety,stale),null);
});
