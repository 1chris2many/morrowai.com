import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {narration,audioEntry} from '../scripts/brief-audio.mjs';
import {validateBriefs,related,renderThemes,briefingCards} from '../scripts/theme-pages.mjs';
import {lifecycle,themeQueue} from '../scripts/theme-lifecycle.mjs';
import {beforeOct20,oct20Revision,beforeOct21,beforeOct22} from './theme-name-history.mjs';
const root=new URL('../',import.meta.url),read=p=>JSON.parse(readFileSync(new URL(p,root)));
const feed=read('news.json'),manifest=read('audio/briefs/manifest.json'),get=id=>briefs.find(b=>b.id===id);
const home=readFileSync(new URL('index.html',root),'utf8');
test('October20 exact reviewed replacements preserve every previous development and metric',()=>{
 for(const [id,c]of Object.entries(oct20Revision.changes)){
  const b=beforeOct22(get(id));assert.deepEqual(b,c.after);
  assert.deepEqual(b.developments.slice(1),c.before.developments);
  assert.deepEqual(b.metric,c.before.metric);
  assert.equal(b.reviewedAt,'2026-10-20');
  assert.deepEqual(beforeOct20(b),c.before);
  assert.equal(beforeOct20({...b,meaning:b.meaning+' mutation'}).meaning,b.meaning+' mutation');
 }
 assert.equal(briefs.length,11);
 assert.deepEqual(get('robot-transfer'),oct20Revision.added[0]);
});
test('new controls and review are proposals and optional workflows, not measured safety or productivity',()=>{
 const s=beforeOct22(get('safety-vs-capability')),w=beforeOct22(get('workplace-agents'));
 assert.match(s.meaning,/Valid credentials cannot establish/);
 assert.match(s.meaning,/must enforce/);
 assert.match(s.developments[0].text,/first announced in July/);
 assert.match(s.developments[0].text,/does not report measured prevention/);
 assert.match(w.meaning,/Our inference/);
 assert.match(w.meaning,/unnecessary checkpoint/);
 assert.match(w.developments[0].text,/skip the review toggle/);
 assert.match(w.developments[0].text,/over the following week/);
});
test('infrastructure reactivation requires substantive new evidence and keeps future capacity qualified',()=>{
 const b=get('ai-infrastructure');
 assert.equal(lifecycle(b,'2026-10-20').status,'active');
 assert.match(b.summary,/hundreds of thousands/);assert.match(b.summary,/one million is the planned/);
 assert.match(b.meaning,/Our inference/);
 assert.match(b.watch,/not an industry comparison/);
 assert.match(b.watch,/2027/);assert.match(b.watch,/expected by 2028/);
 assert.equal(b.developments[0].id,995);assert.equal(b.developments[0].date,'2026-10-19');
 assert.doesNotMatch(JSON.stringify(b),/13%|14\.9%|54K/);
});
test('robotics connects distinct transfer tests without inventing an exact launch date or success equivalence',()=>{
 const b=get('robot-transfer');
 assert.equal(b.developments[0].dateKind,'source-review');
 assert.equal(b.developments[1].date,'2026-09-17');
 assert.match(b.developments[0].text,/no exact launch day/);
 assert.match(b.summary,/three trained behaviors/);
 assert.match(b.summary,/different transfer problem/);
 assert.match(b.metric.context,/not a result for Dream-1/);
 assert.match(b.watch,/not validated for safety-critical/);
 assert.match(narration(b),/Source checked October 20/);
 const html=renderThemes(home,feed);
 assert.match(html,/Source checked Oct 20, 2026/);
 assert.ok(briefingCards(feed).includes('data-theme="robot-transfer"'));
 assert.deepEqual(new Set(related(feed,b.id).map(x=>x.digestItemId)),new Set([814,997]));
 const bad=structuredClone(briefs);bad.find(x=>x.id===b.id).developments[0].dateKind='invented';
 assert.throws(()=>validateBriefs(feed,bad),/date kind/);
});
test('four exact narrations reject stale text and preserve matching downloadable transcripts',()=>{
 for(const id of ['robot-transfer','safety-vs-capability','workplace-agents','ai-infrastructure']){
  const b=get(id),a=audioEntry(b,manifest);assert.ok(a,id);
  assert.equal(readFileSync(new URL(a.src+'.txt',root),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry({...b,meaning:b.meaning+' changed'},manifest),null);
 }
});
test('new triage clears pending sources without refreshing unrelated governance',()=>{
 for(const id of[994,995,996,997,998])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));
 const q=themeQueue(feed,'2026-10-20',briefs.filter(b=>b.id!=='chip-switching').map(beforeOct21));
 assert.equal(q.updates.flatMap(x=>x.items).length,0);
 assert.equal(q.unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);
 const governance=get('ai-regulation');
 assert.equal(governance.reviewedAt,'2026-10-09');
 assert.equal(lifecycle(governance,'2026-10-20').status,'watching');
 assert.ok(!briefs.some(b=>b.developments.some(d=>d.id===998)));
});
