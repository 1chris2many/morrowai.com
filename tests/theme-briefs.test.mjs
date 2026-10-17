import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {renderThemes,validateBriefs,briefingCards} from '../scripts/theme-pages.mjs';
const root=new URL('../',import.meta.url);
const home=await readFile(new URL('index.html',root),'utf8');
const feed=JSON.parse(await readFile(new URL('news.json',root),'utf8'));
const updatedBriefs=new Set(['safety-vs-capability','workplace-agents','open-weights']);
function assertReviewDate(id,date){
 const b=briefs.find(b=>b.id===id);
 if(updatedBriefs.has(id))assert.ok(b.reviewedAt>=date,`${id} review must not predate ${date}`);
 else assert.equal(b.reviewedAt,date,id);
}
test('substantive source-backed briefings are stable, HTML-first and escaped',()=>{
 const before=JSON.stringify(feed),out=renderThemes(home,feed,{preview:true});
 assert.equal(JSON.stringify(feed),before);
 assert.equal((out.match(/class="briefing tone-/g)||[]).length,briefs.length);
 for(const b of briefs){assert.ok(out.includes(b.id));for(const d of b.developments)assert.ok(out.includes(d.url));}
 assert.equal((out.match(/<h3>What it means<\/h3>/g)||[]).length,briefs.length);
 assert.equal((out.match(/<h3>What to watch<\/h3>/g)||[]).length,briefs.length);
 assert.equal((out.match(/opens in a new tab/g)||[]).length,briefs.reduce((n,b)=>n+b.developments.length,0));
 assert.match(out,/Text|AI oversight/);
 assert.match(out,/noindex,nofollow/);assert.doesNotMatch(renderThemes(home,feed),/noindex|nofollow" data-preview/);
 assert.match(out,/rel="canonical" href="https:\/\/usefulaiwerks.com\/themes.html"/);
 const next=structuredClone(feed);next.items[0].title='<script>bad()</script>';
 assert.doesNotMatch(renderThemes(home,next),/<script>bad/);
});
test('new coverage changes related inventory, never analysis date or copy',()=>{
 const next=structuredClone(feed),i=next.items.find(i=>i.themes?.some(t=>t.id==='workplace-agents'));
 const tomorrow=new Date(Date.parse(briefs.map(b=>b.reviewedAt).sort().at(-1))+86400000).toISOString().slice(0,10);
 next.publishedAt=tomorrow+'T19:00:00Z';
 next.items.unshift({...i,digestItemId:99999,digestDate:tomorrow,url:'https://example.com/new-coverage',anchor:'new-coverage',title:'New coverage'});
 const out=renderThemes(home,next);
 assert.match(out,/New coverage since this briefing was reviewed/);
 for(const date of new Set(briefs.map(b=>b.reviewedAt)))assert.equal(out.split('Reviewed <time datetime="'+date+'"').length-1,briefs.filter(b=>b.reviewedAt===date).length);
 assert.match(out,/news.html#new-coverage/);
 for(const b of briefs)assert.ok(out.includes(b.meaning.replaceAll('’','’')));
 assert.match(briefingCards(next),/themes.html#workplace-agents/);
});
test('October 7 editorial additions preserve scope and untouched review dates',()=>{
 assert.equal(briefs.find(b=>b.id==='ai-regulation').reviewedAt,'2026-10-09');
 const workplace=briefs.find(b=>b.id==='workplace-agents');
 assert.match(workplace.developments.find(d=>d.id===932).text,/rubric score of 55.0%/);
 assert.match(workplace.developments.find(d=>d.id===933).text,/exploring/);
 const infrastructure=briefs.find(b=>b.id==='ai-infrastructure');
 assert.match(infrastructure.developments.find(d=>d.id===930).text,/2028/);
 const evals=briefs.find(b=>b.id==='evals');assert.equal(evals.developments.length,5);
 assert.equal(new Set(evals.developments.map(d=>new URL(d.url).hostname)).size,5);
 assert.match(evals.developments.find(d=>d.id===916).text,/percentage points/);
 assert.match(evals.developments.find(d=>d.id===913).url,/www.cdc.gov/);
});
test('October 8 synthesis preserves availability distinctions and unrelated dates',()=>{
 const safety=briefs.find(b=>b.id==='safety-vs-capability');
 assertReviewDate(safety.id,'2026-10-15');
 assert.match(safety.developments.find(d=>d.id===939).text,/authorization/);
 const infra=briefs.find(b=>b.id==='ai-infrastructure');
 assert.match(infra.developments.find(d=>d.id===938).text,/October 16/);
 assert.match(infra.developments.find(d=>d.id===938).text,/November/);
 const open=briefs.find(b=>b.id==='open-weights');
 const historical=[973,971,965,937,936,925];
 assert.equal(new Set(open.developments.filter(d=>historical.includes(d.id)).map(d=>new URL(d.url).hostname)).size,6);
 assert.match(open.developments.find(d=>d.id===936).text,/plans to release/);
 assert.match(open.developments.find(d=>d.id===925).text,/promised/);
 assert.match(open.developments.find(d=>d.id===937).text,/Apache 2.0/);
 assert.equal(briefs.find(b=>b.id==='evals').reviewedAt,'2026-10-16');
 assert.equal(briefs.find(b=>b.id==='ai-regulation').reviewedAt,'2026-10-09');
 for(const id of [935,936,937,938,939])assert.ok(reviewedIds.includes(id));
});
test('October 9 synthesis distinguishes provenance, truth and unreviewed security findings',()=>{
 const governance=briefs.find(b=>b.id==='ai-regulation');
 assert.match(governance.meaning,/absence does not establish human authorship/);
 assert.match(governance.meaning,/does not settle whether a claim is true/);
 assert.match(governance.developments.find(d=>d.id===942).text,/OpenAI says/);
 assert.match(governance.developments.find(d=>d.id===943).text,/Apple support planned/);
 const safety=briefs.find(b=>b.id==='safety-vs-capability');
 assert.match(safety.developments.find(d=>d.id===940).text,/unreviewed/);
 assert.match(safety.developments.find(d=>d.id===940).text,/human-verified disclosure continues/);
 assert.equal(safety.developments.find(d=>d.id===940).date,'2026-10-08');
 assertReviewDate('open-weights','2026-10-16');
 for(const id of [768,940,941,942,943,944])assert.ok(reviewedIds.includes(id));
});
test('October 10 synthesis keeps evaluation scope, beta access and event dates explicit',()=>{
 const safety=briefs.find(b=>b.id==='safety-vs-capability');
 assert.match(safety.developments.find(d=>d.id===945).text,/all internal evaluations/);
 assert.match(safety.developments.find(d=>d.id===945).text,/After reporting unintended actions/);
 assert.match(safety.developments.find(d=>d.id===945).text,/does not establish performance on new cases/);
 assert.equal(safety.developments.find(d=>d.id===945).date,'2026-10-09');
 const workplace=briefs.find(b=>b.id==='workplace-agents');
 assert.match(workplace.developments.find(d=>d.id===947).text,/Google describes/);
 const dashboard=workplace.developments.find(d=>d.id===949);
 assert.match(dashboard.text,/beta on paid plans/);
 assert.match(dashboard.text,/require Enterprise administrators/);
 assert.equal(dashboard.date,'2026-10-08');
 assert.equal(briefs.length,7);
 for(const id of [945,946,947,948,949])assert.ok(reviewedIds.includes(id));
});
test('missing, unreviewed or mistagged source references fail closed',()=>{
 for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===926?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),/source 926/);
 }
 const copy=structuredClone(briefs);copy[0].developments[0].url='javascript:alert(1)';assert.throws(()=>validateBriefs(feed,copy),/Unsafe/);
});
test('October 11 timeline keeps proposal status and event date',()=>{
 const safety=briefs.find(b=>b.id==='safety-vs-capability');
 const addition=safety.developments.find(d=>d.id===950);
 assert.equal(addition.date,'2026-10-10');
 assertReviewDate(safety.id,'2026-10-15');
 assert.match(addition.text,/TechCrunch reports/);
 assert.match(addition.text,/proposals, not verified deployments/);
 assert.ok(addition.relation.length>=30);
 assert.ok(reviewedIds.includes(950));
 assert.equal(briefs.length,7);
 const missing=structuredClone(feed);missing.items=missing.items.filter(i=>i.digestItemId!==950);
 assert.throws(()=>validateBriefs(missing),/source 950/);
});
test('October 12 memory and infrastructure synthesis preserves actual availability and unchanged dates',()=>{
 const work=briefs.find(b=>b.id==='workplace-agents');
 const infra=briefs.find(b=>b.id==='ai-infrastructure');
 assertReviewDate(work.id,'2026-10-16');assert.equal(infra.reviewedAt,'2026-10-12');
 assert.match(work.developments.find(d=>d.id===951).text,/memory retrieval/);
 assert.match(work.developments.find(d=>d.id===951).text,/App rollout is still planned/);
 assert.match(work.developments.find(d=>d.id===954).text,/It says audio is deleted after transcription/);
 assert.match(work.meaning,/inspect, correct and delete/);
 assert.match(infra.meaning,/Power availability, cooling, compatible equipment and maintenance/);
 assert.match(infra.developments.find(d=>d.id===952).text,/planned for 2027/);
 assert.match(infra.developments.find(d=>d.id===952).text,/expected 40%/);
 assert.match(infra.developments.find(d=>d.id===953).text,/shared designs/);
 assert.ok(!infra.developments.some(d=>d.id===934),'October 7 proposal has no verified outcome; keep archive card, omit from refreshed brief');
 for(const b of [work,infra])for(const d of b.developments.filter(d=>d.id>=951&&d.id<=954))assert.equal(d.date,'2026-10-12');
 for(const id of [951,952,953,954,955])assert.ok(reviewedIds.includes(id));
 assert.equal(briefs.length,7);assert.ok(!briefs.some(b=>b.developments.some(d=>d.id===955)));
 for(const [id,date]of [
  ['ai-regulation','2026-10-09'],['safety-vs-capability','2026-10-15'],['evals','2026-10-16'],['open-weights','2026-10-16'],['agent-economics','2026-10-15']
 ])assertReviewDate(id,date);
});
test('October 14 replication addition separates hardware demo from simplified lab capability',()=>{
 const safety=briefs.find(b=>b.id==='safety-vs-capability');
 const d=safety.developments.find(d=>d.id===958);
 assert.equal(d.date,'2026-10-12');
 assertReviewDate(safety.id,'2026-10-15');
 assert.match(d.text,/separate tests/);
 assert.match(d.text,/ran externally/);
 assert.match(d.text,/does not demonstrate a self-sustaining outbreak/);
 assert.match(d.text,/consumer devices/);
 assert.match(d.relation,/consumer hardware/);
 for(const id of [956,957,958,959,960])assert.ok(reviewedIds.includes(id));
 assert.equal(briefs.length,7);
 for(const [id,date]of [
  ['ai-regulation','2026-10-09'],['workplace-agents','2026-10-16'],['ai-infrastructure','2026-10-12'],['evals','2026-10-16'],['open-weights','2026-10-16'],['agent-economics','2026-10-15']
 ])assertReviewDate(id,date);
 const missing=structuredClone(feed);missing.items=missing.items.filter(i=>i.digestItemId!==958);
 assert.throws(()=>validateBriefs(missing),/source 958/);
});
