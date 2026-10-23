import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {oct23Revision,beforeOct23} from './theme-name-history.mjs';
import {related,validateBriefs,renderThemes} from '../scripts/theme-pages.mjs';
import {narration,audioEntry} from '../scripts/brief-audio.mjs';
import {themeQueue} from '../scripts/theme-lifecycle.mjs';
const root=new URL('../',import.meta.url), read=p=>JSON.parse(readFileSync(new URL(p,root)));
const feed=read('news.json'),audio=read('audio/briefs/manifest.json'),get=id=>briefs.find(b=>b.id===id);
test('October23 source-bound changes preserve earlier events except the explicit Replit copy repair',()=>{
 assert.equal(briefs.length,11);
 for(const [id,c]of Object.entries(oct23Revision.changes)){
  const b=get(id);assert.deepEqual(b,c.after);assert.deepEqual(beforeOct23(b),c.before);
  assert.equal(b.reviewedAt,'2026-10-23');assert.equal(b.title,c.before.title);assert.deepEqual(b.metric,c.before.metric);
  for(const d of c.before.developments){
   const now=b.developments.find(x=>x.id===d.id);assert.ok(now);
   if(d.id===974){assert.deepEqual({...now,title:d.title,text:d.text},d);assert.match(now.text,/Claude remains available/);}
   else assert.deepEqual(now,d);
  }
  for(const key of Object.keys(b)){
   const bad=structuredClone(b);bad[key]=typeof bad[key]==='string'?bad[key]+' unreviewed':null;
   assert.equal(beforeOct23(bad),bad,key);
  }
  assert.equal(beforeOct23({...b,unreviewed:true}).unreviewed,true);
 }
});
test('portable skills governance does not become a new portability invention or measured switching',()=>{
 const b=get('ai-market-leadership');
 assert.match(b.meaning,/already open/);assert.match(b.meaning,/Our inference/);
 assert.match(b.meaning,/Models, integrations and permissions still need testing/);
 assert.match(b.watch,/donation does not measure switching/);
 assert.match(b.developments[0].text,/does not mark the start/);
 assert.equal(b.developments[0].date,'2026-10-22');
});
test('attention mechanism retains preview limits and limits direct interaction to supported views',()=>{
 const b=get('workplace-agents');
 assert.match(b.meaning,/interactions the artifact already supports/);
 assert.match(b.meaning,/new questions can still require model work/);
 assert.match(b.meaning,/have not established the net time saved/);
 const duet=b.developments.find(d=>d.id===1010);
 assert.match(duet.text,/US Pro\/Max waitlisted preview/);assert.match(duet.text,/existing allowance/);
 assert.equal(duet.primaryUrl,'https://claude.com/product/claude-duet');
});
test('diagnostic evidence stays selected, simulated and distinct from prospective clinical performance',()=>{
 const b=get('evals');
 assert.match(b.meaning,/selected NEJM cases/);assert.match(b.meaning,/does not reproduce every reported result/);
 assert.match(b.meaning,/simulated cases/);assert.match(b.meaning,/performance in clinical settings to prospective study/);
 assert.equal(b.developments[0].primaryUrl,'https://microsoft.ai/news/building-medical-superintelligence/');
});
test('all four incorporated sources require reviewed exact links and render source attribution',()=>{
 validateBriefs(feed);
 const html=renderThemes(readFileSync(new URL('index.html',root),'utf8'),feed);
 for(const [theme,id]of [['ai-market-leadership',1014],['workplace-agents',1010],['workplace-agents',1015],['evals',1012]]){
  const d=get(theme).developments.find(x=>x.id===id);assert.ok(related(feed,theme).some(i=>i.digestItemId===id));
  assert.ok(html.includes(d.url));if(d.primaryUrl)assert.ok(html.includes(d.primaryUrl));
  for(const mode of ['missing','unreviewed','wrong-url']){
   const bad=structuredClone(feed);bad.items=bad.items.flatMap(i=>i.digestItemId!==id?[i]:mode==='missing'?[]:[{...i,reviewed:mode==='unreviewed'?false:i.reviewed,url:mode==='wrong-url'?'https://example.com/wrong':i.url,themes:[]}]);
   assert.throws(()=>validateBriefs(bad),new RegExp('source '+id));
  }
 }
});
test('new narration matches exact copy and only genuinely reviewed evidence clears the queue',()=>{
 for(const [id,c]of Object.entries(oct23Revision.changes)){
  const b=get(id),a=audioEntry(b,audio);assert.ok(a);
  assert.equal(readFileSync(new URL(a.src+'.txt',root),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry(c.before,audio),null);
 }
 for(const id of[1010,1011,1012,1013,1014,1015])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));
 const q=themeQueue(feed,'2026-10-23');assert.equal(q.updates.flatMap(x=>x.items).length,0);
 assert.equal(q.unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);assert.equal(q.candidates.length,0);
 assert.ok(!briefs.some(b=>b.developments.some(d=>[1011,1013].includes(d.id))));
 assert.equal(get('ai-regulation').reviewedAt,'2026-10-09');assert.equal(get('agent-economics').reviewedAt,'2026-10-22');
});
