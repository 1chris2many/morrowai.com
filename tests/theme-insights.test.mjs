import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {briefs} from '../scripts/theme-current.mjs';
import {insightRevision,beforeInsightRevision,oct20Revision,beforeOct20} from './theme-name-history.mjs';
import {lifecycle} from '../scripts/theme-lifecycle.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const immutable={
  "ai-market-leadership": "ba067342e2bf4200e10a782994fe3a06188ab0b2918b24476f3fefac89f59f96",
  "ai-science": "d246cf177ddc41d02ba533495f16c0352d5e7c4aa8b3894600e6ef6f08bff30d",
  "ai-regulation": "d264fed350f8f79378fdc9e35787125077a856d790be7140d1879e1752c0085d",
  "safety-vs-capability": "829acdedc2206fed6d55a9c1b5874449d725dca4ef7c9058db1901bfe5fda8bf",
  "workplace-agents": "eb86c89627641095a14dc0d1b556f4524ba57567847ab813e4040e43f32c70c7",
  "ai-infrastructure": "7e518fe84e556e2b4d855fd201f7577e95bc788d783c246457f0a7c0c54b3dae",
  "evals": "b357ae0d7f9919de5dc0b09d9439efc0f32e5db0e3f65543a7f939b5955e321a",
  "open-weights": "9a1d280690b9828dfc78400350c3d3f1876d4129d4907deb8adf35f078ef5119",
  "agent-economics": "65a0f599d3dcec2f28a2ae8a2f627326f4077f4c651a190ee616860e01c13b04"
};
const originalBriefs=briefs.filter(b=>Object.hasOwn(immutable,b.id));
test('October20 includes exactly the approved replacements and the new robotics brief',()=>{
 assert.deepEqual(briefs.map(b=>b.id).sort(),[...Object.keys(immutable),'robot-transfer'].sort());
 assert.deepEqual(Object.keys(oct20Revision.changes).sort(),['ai-infrastructure','safety-vs-capability','workplace-agents']);
 assert.deepEqual(oct20Revision.added.map(b=>b.id),['robot-transfer']);
 for(const [id,change] of Object.entries(oct20Revision.changes)){
  const current=briefs.find(b=>b.id===id);
  assert.deepEqual(current,change.after,id);
  assert.deepEqual(beforeOct20(current),change.before,id);
 }
 assert.deepEqual(briefs.find(b=>b.id==='robot-transfer'),oct20Revision.added[0]);
});
test('historical insight revision changes only the eight reviewed editorial fields',()=>{
 assert.equal(originalBriefs.length,9);
 for(const current of originalBriefs){
  const b=beforeOct20(current);
  const evidence=Object.fromEntries(Object.entries(b).filter(([k])=>!insightRevision.fields.includes(k)));
  assert.equal(hash(evidence),immutable[b.id],b.id);
  for(const k of insightRevision.fields)assert.deepEqual(b[k],insightRevision.changes[b.id].after[k],b.id+':'+k);
 }
});
test('rewriting interpretation never manufactures a new evidence date or reactivates stale governance',()=>{
 const expected={"ai-market-leadership":"2026-10-18","ai-science":"2026-10-18","ai-regulation":"2026-10-09","safety-vs-capability":"2026-10-17","workplace-agents":"2026-10-18","ai-infrastructure":"2026-10-12","evals":"2026-10-16","open-weights":"2026-10-18","agent-economics":"2026-10-18"};
 for(const current of originalBriefs){
  const b=beforeOct20(current);
  assert.equal(b.reviewedAt,expected[b.id],b.id);
  assert.equal(current.reviewedAt,oct20Revision.changes[b.id]?'2026-10-20':expected[b.id],b.id);
 }
 assert.equal(briefs.find(b=>b.id==='robot-transfer').reviewedAt,'2026-10-20');
 const b=briefs.find(b=>b.id==='ai-regulation');
 assert.equal(lifecycle(b,'2026-10-18').status,'watching');
 const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.ok(!home.includes('data-theme="ai-regulation"'));
});
test('snapshot reconstruction cannot hide changes to any editorial field',()=>{
 for(const b of originalBriefs){
  assert.notEqual(beforeInsightRevision(b),b);
  for(const k of insightRevision.fields){
   const altered=structuredClone(b);
   if(k==='visual')altered.visual[0][1]+=' unreviewed';
   else altered[k]+=' unreviewed';
   assert.equal(beforeInsightRevision(altered),altered,b.id+':'+k);
  }
 }
});
test('October20 normalization rejects unapproved metadata and evidence changes',()=>{
 for(const id of Object.keys(oct20Revision.changes)){
  const b=briefs.find(b=>b.id===id);
  for(const field of ['id','label','title','reviewedAt','author','accent',...insightRevision.fields]){
   const altered=structuredClone(b);
   if(field==='visual')altered.visual[0][1]+=' unreviewed';
   else altered[field]+=' unreviewed';
   assert.equal(beforeOct20(altered),altered,id+':'+field);
  }
  for(const field of ['date','id','title','text','source','url']){
   const altered=structuredClone(b);
   altered.developments[0][field]+=' unreviewed';
   assert.equal(beforeOct20(altered),altered,id+':development:'+field);
  }
  const extra=structuredClone(b);extra.unreviewedField=true;
  assert.equal(beforeOct20(extra),extra,id+':extra-field');
  if(b.metric){
   const altered=structuredClone(b);altered.metric.context+=' unreviewed';
   assert.equal(beforeOct20(altered),altered,id+':metric');
  }
 }
 const robot=briefs.find(b=>b.id==='robot-transfer');
 assert.equal(beforeOct20(robot),robot);
 assert.equal(beforeInsightRevision(robot),robot);
});
test('mechanisms retain concrete evidence and distinguish hypotheses from measured results',()=>{
 const get=id=>briefs.find(b=>b.id===id);
 assert.match(get('ai-science').summary,/specificity deteriorated/);
 assert.match(get('workplace-agents').summary,/interactive agent sessions.*80%.*elapsed time/);
 assert.match(get('safety-vs-capability').meaning,/application must enforce a flagged verdict/);
 assert.match(get('safety-vs-capability').watch,/unavailable checks/);
 assert.match(get('safety-vs-capability').watch,/architecture, not measured prevention rates/);
 assert.match(get('ai-regulation').summary,/not a measured change in readers’ beliefs/);
 assert.match(get('ai-infrastructure').meaning,/Our inference.*losing less work to failures/);
 assert.match(get('ai-infrastructure').watch,/not an industry comparison/);
 assert.match(get('workplace-agents').meaning,/Our inference.*early decision/);
 assert.match(get('workplace-agents').meaning,/no measured time savings/);
 assert.match(get('robot-transfer').summary,/56% full-task success.*three trained behaviors.*30 unfamiliar homes/);
 assert.match(get('robot-transfer').meaning,/Our inference.*interventions, retries and integration/);
 assert.match(get('robot-transfer').watch,/not the robot, supervision or repairs/);
 assert.match(get('robot-transfer').watch,/not validated for safety-critical use/);
 assert.match(get('evals').meaning,/does not establish how reliably the model/);
 assert.match(get('agent-economics').meaning,/not measured savings/);
 assert.doesNotMatch(get('agent-economics').meaning,/Measure the cost of an accepted result/);
});
