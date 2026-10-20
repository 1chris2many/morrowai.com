import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {beforeThemeRename,beforeOct20} from './theme-name-history.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {validateBriefs,briefingCards} from '../scripts/theme-pages.mjs';
import {themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
const hash=x=>createHash('sha256').update(JSON.stringify(beforeThemeRename(x))).digest('hex');
const get=id=>briefs.find(b=>b.id===id);
test('October17 preserves two unrelated briefings and every earlier event and metric',()=>{
 const unchanged={"ai-regulation":"569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f","evals":"115b28b5eac8e506dedf5333c805e2e6e26d38fdfc345883efeebb44f4e493c7"};
 for(const [id,value]of Object.entries(unchanged))assert.equal(hash(get(id)),value,id);
 const histories={"safety-vs-capability":{"events":"2f88e3d861c1978dc093d1a3859ca87350407f6259e45fdd65be6a221a87a68c","metric":"74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"},"workplace-agents":{"events":"4ecac95bdbfe35c63e3811bf84a858f996833f653ed6272da8cf68940148b81c","metric":"27f5b1483e24beaa54e0e43c1d97309100fbf3c499b81dafe1a1ae469bd397cb"},"open-weights":{"events":"29818da4e99ed7695b4345208e5a736589533fea9fdd3191dda832228c911738","metric":"74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"}};
 for(const [id,prior]of Object.entries(histories)){
  const b=get(id);assert.equal(hash(b.developments.filter(d=>d.id<976)),prior.events,id);
  assert.equal(hash(b.metric||null),prior.metric,id);
  assert.ok(b.reviewedAt>='2026-10-17');
 }
 assert.equal(briefs.length,10);
 assert.equal(lifecycle(get('ai-regulation'),'2026-10-17').status,'watching');
 assert.ok(!briefingCards(feed).includes('data-theme="ai-regulation"'));
});
test('October17 source dates and key limitations survive synthesis',()=>{
 const open=get('open-weights'),work=get('workplace-agents'),safety=get('safety-vs-capability');
 for(const [b,id,date]of [[open,976,'2026-10-15'],[work,977,'2026-10-16'],[safety,978,'2026-10-15']]){
  const d=b.developments.find(d=>d.id===id);assert.equal(d.date,date);
  assert.notEqual(d.date,'2026-10-17');
 }
 const model=open.developments.find(d=>d.id===976);
 assert.match(model.text,/two M5 Ultra Mac Studios/);assert.match(model.text,/limited commercial terms/);
 assert.match(open.meaning,/multiple high-memory machines/);
 const survey=work.developments.find(d=>d.id===977);
 for(const re of [/August surveys/,/75%/,/28%/,/employed US respondents/,/unweighted/,/answer formats differed/,/expectations, not measured automation/])assert.match(survey.text,re);
 const armor=safety.developments.find(d=>d.id===978);
 for(const re of [/clients must honor flagged verdicts/,/Provider-native server tools are skipped by default/,/audit mode/,/false alarms and missed violations/])assert.match(armor.text,re);
 assert.match(beforeOct20(safety).meaning,/entire path/);assert.match(beforeOct20(safety).meaning,/unavailable check/);
});
test('all three new sources remain bound to reviewed related feed cards',()=>{
 validateBriefs(feed);
 for(const id of [976,977,978])for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===id?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),new RegExp('source '+id));
 }
});
test('updated narration exactly matches current public copy and rejects stale content',()=>{
 for(const id of ['open-weights','workplace-agents','safety-vs-capability']){
  const b=get(id),entry=audioEntry(b,manifest);assert.ok(entry,id);
  assert.equal(readFileSync(new URL('../'+entry.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry({...b,summary:b.summary+' changed'},manifest),null);
 }
});
test('all five new cards are triaged without forcing a new theme or redating governance',()=>{
 for(const id of [974,975,976,977,978])assert.ok(reviewedIds.includes(id));
 // The October 18 owner-requested competition briefing now uses corrected 974.
 assert.ok(!briefs.filter(b=>b.id!=='ai-market-leadership').some(b=>b.developments.some(d=>[974,975].includes(d.id))));
 assert.ok(!briefs.some(b=>b.developments.some(d=>d.id===975)));
 const q=themeQueue(feed,briefs.map(b=>b.reviewedAt).sort().at(-1));assert.equal(q.candidates.length,0);
 assert.ok(q.updates.every(b=>b.items.length===0));
 assert.equal(get('ai-regulation').reviewedAt,'2026-10-09');
});
