import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {beforeThemeRename} from './theme-name-history.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
const hash=x=>createHash('sha256').update(JSON.stringify(beforeThemeRename(x))).digest('hex');
const get=id=>briefs.find(b=>b.id===id);
test('October16 preserves unchanged briefs and the later-revised safety timeline exactly',()=>{
 const expected={
  'ai-regulation':'569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f',
  // October18 permits exactly three timing spans; its regression reverses them to the original hash.
  'ai-infrastructure':'40a392ab01ed7e02ead8568f1896851a53aefc897dcfc254f60a76a1fca7146a',
 };
 for(const [id,value]of Object.entries(expected))assert.equal(hash(get(id)),value,id);
 const safetyHistory=[963,958,950,945,940,939,896];
 assert.equal(hash(get('safety-vs-capability').developments.filter(d=>safetyHistory.includes(d.id))),'2f88e3d861c1978dc093d1a3859ca87350407f6259e45fdd65be6a221a87a68c');
 assert.equal(briefs.length,9);
});
test('October16 additions preserve historical developments and quantitative scope',()=>{
 const expected={
  evals:[[931,916,913],'231443556720333b164c22a6b891ebea1884e7299da97de4f9455285fb52af5b','7348746ebecf5bcb79ee2ca898607c484b49c6a12b80ea25fab9eeb552eac1f4'],
  'workplace-agents':[[967,951,954,947,949,932,933,929],'89bd2cf7e0fa6e7e418a034ea87cb65f210ebc8bbc9b52b3080b775673165e3f','27f5b1483e24beaa54e0e43c1d97309100fbf3c499b81dafe1a1ae469bd397cb'],
  'open-weights':[[965,937,936,925],'43d3f445d92a5159d5e9bd1429b6582c2b11a71aa91401528ac1d5cd3c00bc25','74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b']
 };
 for(const [id,[historical,events,metric]]of Object.entries(expected)){
  const b=get(id);assert.equal(hash(b.developments.filter(d=>historical.includes(d.id))),events);
  assert.equal(hash(b.metric||null),metric);
  if(id==='evals')assert.equal(b.reviewedAt,'2026-10-16');else assert.ok(b.reviewedAt>='2026-10-16');
  assert.equal(lifecycle(b,b.reviewedAt).status,'active');
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
 const review=work.developments.find(d=>d.id===972),flux=open.developments.find(d=>d.id===973),ibm=open.developments.find(d=>d.id===971);
 assert.equal(review.date,'2026-10-15');
 assert.match(review.text,/Anthropic says/);assert.match(review.text,/Team and Enterprise/);
 assert.match(review.text,/Administrators can choose Quick, Standard or Deep for each repository/);
 assert.deepEqual(open.developments.filter(d=>[973,971].includes(d.id)).map(d=>[d.id,d.date]),[[973,'2026-10-15'],[971,'2026-10-15']]);
 assert.match(flux.text,/excluding the text encoder/);
 assert.match(flux.text,/annual revenue under \$5 million/);
 assert.match(flux.text,/for commercial deployment/);
 assert.match(ibm.text,/released October 14/);
 assert.match(ibm.text,/8B or 30B base models/);
 assert.match(ibm.text,/Apache 2.0/);assert.match(ibm.text,/IBM says/);
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
 const reviewDay=briefs.map(b=>b.reviewedAt).sort().at(-1);
 const queue=themeQueue(feed,reviewDay);assert.equal(queue.candidates.length,0);
 for(const id of ['workplace-agents','open-weights'])assert.deepEqual(queue.updates.find(b=>b.id===id).items,[]);
});
