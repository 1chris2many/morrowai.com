import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const get=id=>briefs.find(b=>b.id===id);
test('October16 preserves all four unrelated briefs exactly',()=>{
 const expected={
  'ai-regulation':'569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f',
  'safety-vs-capability':'6c14078d76bde563c578ef5706312228318d06cea9c6d77d78e77faf86895024',
  'ai-infrastructure':'8a936788eb82088ebef10d14d72b169559c8b2378f72c5ec840443536bba7ae5',
  'agent-economics':'74215dabcf25368096118f13440f491a125039a05cd8412e2fe1b01fb4bb42cb'
 };
 for(const [id,value]of Object.entries(expected))assert.equal(hash(get(id)),value,id);
 assert.equal(briefs.length,7);
});
test('October16 additions preserve historical developments and quantitative scope',()=>{
 const expected={
  evals:[2,'231443556720333b164c22a6b891ebea1884e7299da97de4f9455285fb52af5b','7348746ebecf5bcb79ee2ca898607c484b49c6a12b80ea25fab9eeb552eac1f4'],
  'workplace-agents':[1,'89bd2cf7e0fa6e7e418a034ea87cb65f210ebc8bbc9b52b3080b775673165e3f','27f5b1483e24beaa54e0e43c1d97309100fbf3c499b81dafe1a1ae469bd397cb'],
  'open-weights':[2,'43d3f445d92a5159d5e9bd1429b6582c2b11a71aa91401528ac1d5cd3c00bc25','74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b']
 };
 for(const [id,[count,events,metric]]of Object.entries(expected)){
  const b=get(id);assert.equal(hash(b.developments.slice(count)),events);
  assert.equal(hash(b.metric||null),metric);assert.equal(b.reviewedAt,'2026-10-16');
  assert.equal(lifecycle(b,'2026-10-16').status,'active');
 }
});
test('evaluation review distinguishes access terms from results and keeps cross-theme sourcing explicit',()=>{
 const b=get('evals');assert.deepEqual(b.developments.slice(0,2).map(d=>[d.id,d.date]),[[969,'2026-10-15'],[967,'2026-10-14']]);
 assert.match(b.developments[0].text,/specified exclusions/);assert.match(b.developments[0].text,/defined redactions/);
 assert.match(b.developments[0].text,/results are to follow/);
 assert.match(b.developments[1].text,/contracted expert reviews/);
 for(const d of b.developments.slice(0,2))assert.ok(d.relation.length>=30);
 for(const id of [969,967])for(const mutate of [i=>null,i=>({...i,reviewed:false})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===id?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),new RegExp(`source ${id}`));
 }
});
test('model and code-review claims retain license conditions, component scope and vendor attribution',()=>{
 const work=get('workplace-agents'),open=get('open-weights');
 assert.equal(work.developments[0].date,'2026-10-15');assert.equal(work.developments[0].id,972);
 assert.match(work.developments[0].text,/Anthropic says/);assert.match(work.developments[0].text,/Team and Enterprise/);
 assert.match(work.summary,/Once enabled by an administrator/);assert.match(work.summary,/selected repositories/);
 assert.deepEqual(open.developments.slice(0,2).map(d=>[d.id,d.date]),[[973,'2026-10-15'],[971,'2026-10-15']]);
 assert.match(open.developments[0].text,/excluding the text encoder/);
 assert.match(open.developments[0].text,/annual revenue under \$5 million/);
 assert.match(open.developments[0].text,/for commercial deployment/);
 assert.match(open.developments[1].text,/released October 14/);
 assert.match(open.developments[1].text,/8B or 30B base models/);
 assert.match(open.developments[1].text,/Apache 2.0/);assert.match(open.developments[1].text,/IBM says/);
 for(const id of [971,972,973])for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===id?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),new RegExp(`source ${id}`));
 }
});
test('all three changes have exact narration and triage does not manufacture a new theme',()=>{
 validateBriefs(feed);
 for(const id of ['evals','workplace-agents','open-weights']){
  const b=get(id),entry=audioEntry(b,manifest);assert.ok(entry);
  assert.equal(readFileSync(new URL('../'+entry.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry({...b,summary:b.summary+' changed'},manifest),null);
 }
 for(const id of [969,970,971,972,973])assert.ok(reviewedIds.includes(id));
 assert.ok(!briefs.some(b=>b.developments.some(d=>d.id===970)));
 const queue=themeQueue(feed,'2026-10-16');assert.equal(queue.candidates.length,0);
 for(const id of ['workplace-agents','open-weights'])assert.deepEqual(queue.updates.find(b=>b.id===id).items,[]);
});
