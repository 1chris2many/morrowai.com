import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {oct22Revision,beforeOct22} from './theme-name-history.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
import {related,validateBriefs,renderThemes} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const feed=read('news.json'),audio=read('audio/briefs/manifest.json');
const get=id=>briefs.find(b=>b.id===id);
test('October22 exact reviewed replacements preserve every earlier development and stable identity',()=>{
 assert.equal(briefs.length,11);
 for(const [id,c]of Object.entries(oct22Revision.changes)){
  const b=get(id);assert.deepEqual(b,c.after);assert.deepEqual(b.developments.slice(1),c.before.developments);
  assert.equal(b.title,c.before.title);assert.deepEqual(b.metric,c.before.metric);assert.equal(b.reviewedAt,'2026-10-22');
  assert.deepEqual(beforeOct22(b),c.before);
  for(const field of Object.keys(b)){
   const changed=structuredClone(b);changed[field]=typeof changed[field]==='string'?changed[field]+' unreviewed':null;
   assert.equal(beforeOct22(changed),changed,field);
  }
  const extra={...b,unreviewed:true};assert.equal(beforeOct22(extra),extra);
 }
});
test('optional independent enforcement is qualified by mediated routes and remains an inference',()=>{
 const b=get('safety-vs-capability');assert.equal(b.developments[0].id,1009);
 assert.equal(b.developments[0].date,'2026-10-21');assert.match(b.developments[0].text,/optional/);
 assert.match(b.meaning,/Our inference/);assert.match(b.meaning,/bypasses it/);
 assert.match(b.watch,/does not establish comparative prevention rates/);
 assert.match(b.watch,/useful work blocked as well as violations stopped/);
 assert.match(b.timelineIntro,/not the runtime's first launch/);
 assert.doesNotMatch(JSON.stringify(b),/30x|20%|guarantees|prevents all/);
});
test('planned transaction revenue does not become current revenue or proven profitability',()=>{
 const b=get('agent-economics');assert.equal(b.developments[0].id,1006);
 assert.equal(b.developments[0].date,'2026-10-21');assert.match(b.summary,/planned business-paid transaction fees/);
 assert.match(b.developments[0].text,/subscriptions are its only current monetization/);
 assert.match(b.developments[0].text,/still requires technological advances/);
 assert.match(b.meaning,/Our inference/);assert.match(b.meaning,/buy nothing/);
 assert.match(b.meaning,/not measured savings/);assert.match(b.watch,/not lossless recall/);
 assert.match(b.watch,/October 31 at 16:00 UTC/);assert.match(b.watch,/November 30/);
});
test('exact sources and primary links are required; unreviewed or wrong links fail closed',()=>{
 validateBriefs(feed);
 const home=readFileSync(new URL('../index.html',import.meta.url),'utf8'),html=renderThemes(home,feed);
 for(const [theme,id]of [['safety-vs-capability',1009],['agent-economics',1006]]){
  assert.ok(related(feed,theme).some(i=>i.digestItemId===id));
  assert.ok(html.includes('href="'+get(theme).developments[0].primaryUrl+'"'));
  for(const change of [i=>null,i=>({...i,reviewed:false}),i=>({...i,url:'https://example.com/wrong',themes:[]})]){
   const bad=structuredClone(feed);bad.items=bad.items.map(i=>i.digestItemId===id?change(i):i).filter(Boolean);
   assert.throws(()=>validateBriefs(bad),new RegExp('source '+id));
  }
 }
});
test('both narrations match exact copy and reject the prior approved version',()=>{
 for(const [id,c]of Object.entries(oct22Revision.changes)){
  const b=get(id),a=audioEntry(b,audio);assert.ok(a);
  assert.equal(readFileSync(new URL('../'+a.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry(c.before,audio),null);
  assert.equal(audioEntry({...b,meaning:b.meaning+' unreviewed'},audio),null);
 }
});
test('all five sources are triaged without a forced new theme or unrelated freshness bump',()=>{
 for(const id of [1005,1006,1007,1008,1009])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));
 const q=themeQueue(feed,'2026-10-22');assert.equal(q.updates.flatMap(x=>x.items).length,0);
 assert.equal(q.candidates.length,0);assert.equal(q.unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);
 for(const [id,date]of Object.entries({'chip-switching':'2026-10-21','robot-transfer':'2026-10-20','ai-market-leadership':'2026-10-18','ai-science':'2026-10-18','ai-regulation':'2026-10-09','workplace-agents':'2026-10-20','ai-infrastructure':'2026-10-20','evals':'2026-10-16','open-weights':'2026-10-18'}))assert.equal(get(id).reviewedAt,date);
 assert.equal(lifecycle(get('ai-regulation'),'2026-10-22').status,'watching');
 assert.ok(!briefs.some(b=>b.developments.some(d=>[1005,1007,1008].includes(d.id))));
});
