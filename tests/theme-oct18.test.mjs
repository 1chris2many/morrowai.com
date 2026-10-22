import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {briefs} from '../scripts/theme-current.mjs';
import {beforeThemeRename,beforeOct20,beforeOct22} from './theme-name-history.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {related,validateBriefs,briefingCards,renderThemes} from '../scripts/theme-pages.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(beforeThemeRename(x))).digest('hex');
const get=id=>briefs.find(b=>b.id===id);
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('October18 preserves four unrelated briefings, all earlier developments and metrics',()=>{
 for(const [id,value]of Object.entries({"ai-regulation":"569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f","safety-vs-capability":"b0ec7f38a369aacdfa9de4a69c8b2ff4685192cc11a13d20373e976cbe2cad07","ai-infrastructure":"40a392ab01ed7e02ead8568f1896851a53aefc897dcfc254f60a76a1fca7146a","evals":"115b28b5eac8e506dedf5333c805e2e6e26d38fdfc345883efeebb44f4e493c7"}))assert.equal(hash(get(id)),value,id);
 for(const [id,prior]of Object.entries({"workplace-agents":{"events":"6645b0aa68a2c29779dbc58604103cd2e412641556cc83a55b5436bcf94db8a1","metric":"27f5b1483e24beaa54e0e43c1d97309100fbf3c499b81dafe1a1ae469bd397cb"},"open-weights":{"events":"69bc76aba90bde92ed2ca82742b1689c22ad79a55d7c91ed46d895d4daced612","metric":"74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"},"agent-economics":{"events":"e0570e1668d8170d76a71cb1ad4a1e95091119477b9b3ea67f82d30d495b0d32","metric":"74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"}})){
  const b=beforeOct20(get(id));
  assert.equal(hash(b.developments.filter(d=>![979,982].includes(d.id))),prior.events,id);
  assert.equal(hash(b.metric||null),prior.metric,id);
  assert.equal(b.reviewedAt,'2026-10-18');
 }
 assert.equal(briefs.length,11);
 assert.equal(get('ai-science').metric,undefined);
});
test('new workplace evidence preserves denominator, hiring shares and observational limits',()=>{
 const b=get('workplace-agents'),d=b.developments.find(d=>d.id===979);
 assert.equal(d.date,'2026-10-16');
 for(const re of [/share of junior technical hires/,/27% to 9%/,/agent runtime/,/estimated human work hours/,/40-hour week/,/not randomized/,/not equivalent to productive output/])assert.match(d.text,re);
 assert.match(b.meaning,/human’s attention/);assert.match(b.meaning,/other employers/);
});
test('DeepSeek separates downloadable-model operation from hosted tool charges',()=>{
 const open=get('open-weights'),econ=get('agent-economics');
 const d=open.developments.find(d=>d.id===982),cost=econ.developments.find(d=>d.id===982);
 for(const source of [d,cost])assert.equal(source.date,'2026-10-17');
 for(const re of [/downloadable weights/,/MIT/,/operator’s responsibility/,/reported by DeepSeek/])assert.match(d.text,re);
 for(const re of [/each cost \$0\.75 per 1,000 API calls/,/For DeepSeek API users/,/server-side tools/,/October 31 at 16:00 UTC/,/does not cover every direct API call/])assert.match(cost.text,re);
 assert.match(beforeOct22(econ).meaning,/per-call meter/);
 assert.match(open.meaning,/hosted search is separately priced/);
});
test('science links three distinct developments with original dates and readiness limits',()=>{
 const b=get('ai-science');
 assert.deepEqual(b.developments.map(d=>[d.id,d.date]),[[984,'2026-10-16'],[983,'2026-10-15'],[968,'2026-10-14']]);
 assert.equal(new Set(b.developments.map(d=>new URL(d.url).hostname.includes('google')?'Google':'CERN')).size,2);
 assert.match(b.developments[0].text,/three separate projects/);
 assert.match(b.developments[0].text,/Humans authorize sequences, verify protocols and supervise robot runs/);
 assert.match(b.developments[0].text,/next step/);
 assert.match(b.developments[1].text,/statement of intent/);
 assert.match(b.developments[1].text,/simulated proton collisions/);
 assert.match(b.developments[2].text,/up to 200/);
 assert.match(b.developments[2].text,/\$3 million in compute credits in total/);
});
test('explicitly reviewed relations make new science discoverable without mutating the feed',()=>{
 const before=JSON.stringify(feed);validateBriefs(feed);
 assert.deepEqual(new Set(related(feed,'ai-science').map(i=>i.digestItemId)),new Set([968,983,984]));
 assert.ok(briefingCards(feed).includes('data-theme="ai-science"'));
 const html=renderThemes(home,feed).split('id="ai-science"')[1].split('</section>')[0];
 assert.match(html,/3 related stories/);assert.match(html,/Browse the news archive/);
 assert.doesNotMatch(html,/news.html\?theme=ai-science/);
 for(const id of [968,983,984])assert.ok(html.includes(feed.items.find(i=>i.digestItemId===id).anchor));
 assert.equal(JSON.stringify(feed),before);
});
test('cross-theme relations fail closed for missing, unreviewed or wrong-URL evidence',()=>{
 for(const id of [979,982,983,984,968])for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,url:'https://example.com/unrelated'})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===id?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),new RegExp('source '+id));
 }
});
test('four new narrations match exact copy and source triage excludes held and unrelated stories',()=>{
 for(const id of ['workplace-agents','open-weights','agent-economics','ai-science']){
  const b=get(id),a=audioEntry(b,manifest);assert.ok(a);
  assert.equal(readFileSync(new URL('../'+a.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');
  assert.equal(audioEntry({...b,meaning:b.meaning+' altered'},manifest),null);
 }
 for(const id of [979,981,982,983,984])assert.ok(reviewedIds.includes(id));
 assert.ok(!reviewedIds.includes(980));
 assert.ok(!briefs.some(b=>b.developments.some(d=>[980,981].includes(d.id))));
});
