import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {oct25Revision,beforeOct25,beforeOct26} from './theme-name-history.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {narration,audioEntry} from '../scripts/brief-audio.mjs';
import {themeQueue} from '../scripts/theme-lifecycle.mjs';
const root=new URL('../',import.meta.url),read=p=>JSON.parse(readFileSync(new URL(p,root))),feed=read('news.json');
test('October25 preserves earlier milestones and metrics; historical adapter cannot conceal arbitrary edits',()=>{
 assert.equal(briefs.length,11);
 for(const[id,c]of Object.entries(oct25Revision.changes)){
  const b=beforeOct26(briefs.find(x=>x.id===id));assert.deepEqual(b,c.after);assert.deepEqual(beforeOct25(b),c.before);
  assert.deepEqual(b.metric,c.before.metric);
  for(const d of c.before.developments)assert.deepEqual(b.developments.find(x=>x.id===d.id),d);
  for(const key of Object.keys(b)){const bad=structuredClone(b);bad[key]=typeof bad[key]==='string'?bad[key]+' unreviewed':null;assert.equal(beforeOct25(bad),bad,key);}
  assert.equal(beforeOct25({...b,unreviewed:true}).unreviewed,true);
 }
});
test('new training, shared-rules and open-weights evidence requires the exact reviewed source',()=>{
 validateBriefs(feed);
 for(const id of[1023,1024,1025])for(const mode of['missing','unreviewed','wrong-url']){
  const bad=structuredClone(feed);bad.items=bad.items.flatMap(i=>i.digestItemId!==id?[i]:mode==='missing'?[]:[{...i,reviewed:mode==='unreviewed'?false:i.reviewed,url:mode==='wrong-url'?'https://example.com/unreviewed':i.url,themes:[]}]);
  assert.throws(()=>validateBriefs(bad),new RegExp('source '+id));
 }
});
test('every revised brief has an exact transcript and rejects its earlier recording',()=>{
 const manifest=read('audio/briefs/manifest.json');
 for(const[id,c]of Object.entries(oct25Revision.changes)){
  const b=briefs.find(x=>x.id===id),a=audioEntry(b,manifest);assert.ok(a);
  assert.equal(readFileSync(new URL(a.src+'.txt',root),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry(c.before,manifest),null);
 }
});
test('triage retains standalone stories and excludes the obsolete held story without concealing new evidence',()=>{
 for(const id of[1021,1022,1023,1024,1025])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));assert.ok(!briefs.some(b=>b.developments.some(d=>[980,1021,1022].includes(d.id))));
 const q=themeQueue(feed,'2026-10-25',briefs.map(beforeOct26));assert.equal(q.updates.flatMap(x=>x.items).length,0);
 assert.equal(q.unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);assert.equal(q.candidates.length,0);
});
