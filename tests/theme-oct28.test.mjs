import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {oct28Revision,beforeOct28,beforeOct29} from './theme-name-history.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url))),feed=read('news.json'),audio=read('audio/briefs/manifest.json');
test('October28 revisions preserve prior evidence and only exact historical snapshots can unwind them',()=>{
 for(const[id,c]of Object.entries(oct28Revision.changes)){
  const b=briefs.find(b=>b.id===id);assert.deepEqual(b,c.after);assert.deepEqual(b.developments.slice(1),c.before.developments);assert.deepEqual(beforeOct28(b),c.before);
  for(const key of Object.keys(b)){const bad=structuredClone(b);bad[key]=typeof bad[key]==='string'?bad[key]+' unreviewed':null;assert.equal(beforeOct28(bad),bad,key);}
 }
});
test('new supplier and risk-disclosure evidence fails closed for missing, unreviewed or mismatched sources',()=>{
 validateBriefs(feed);
 for(const id of[1039,1040])for(const mode of['missing','unreviewed','wrong-url']){
  const bad=structuredClone(feed);bad.items=bad.items.flatMap(i=>i.digestItemId!==id?[i]:mode==='missing'?[]:[{...i,reviewed:mode==='unreviewed'?false:i.reviewed,url:mode==='wrong-url'?'https://example.com/unreviewed':i.url,themes:[]}]);
  assert.throws(()=>validateBriefs(bad),new RegExp('source '+id));
 }
});
test('both new narrations match public copy and cannot reuse earlier audio',()=>{
 for(const[id,c]of Object.entries(oct28Revision.changes)){const b=briefs.find(b=>b.id===id),a=audioEntry(b,audio);assert.ok(a);assert.equal(audioEntry(c.before,audio),null);assert.equal(readFileSync(new URL('../'+a.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');}
});
test('triage closes current evidence while retaining distinct event dates and the aged robotics brief',()=>{
 const infra=briefs.find(b=>b.id==='ai-infrastructure'),safety=briefs.find(b=>b.id==='safety-vs-capability'),robot=briefs.find(b=>b.id==='robot-transfer');
 assert.equal(infra.developments[0].date,'2026-10-28');assert.equal(safety.developments[0].date,'2026-10-26');assert.equal(safety.reviewedAt,'2026-10-28');
 assert.equal(robot.reviewedAt,'2026-10-20');assert.equal(lifecycle(robot,'2026-10-28').status,'watching');
 for(const id of[1038,1039,1040,1041,1042])assert.ok(reviewedIds.includes(id));
 const q=themeQueue(feed,'2026-10-28',briefs.map(beforeOct29));assert.equal(q.updates.flatMap(x=>x.items).length,0);assert.equal(q.candidates.length,0);assert.equal(q.unclassified.filter(x=>!reviewedIds.includes(x.id)).length,0);
 assert.ok(!reviewedIds.includes(980));assert.ok(!reviewedIds.includes(1034));
});
