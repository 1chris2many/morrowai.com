import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {briefs} from '../scripts/theme-current.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const get=id=>briefs.find(b=>b.id===id);
test('October18 timing correction changes exactly three spans, without redating the briefing',()=>{
 const b=get('ai-infrastructure'), prior=structuredClone(b);
 for(const [holder,key,corrected,old] of [
  [prior,'meaning','2027 chip deployments and power additions expected by 2028','2027 chip deployments and 2028 power additions'],
  [prior.metric,'context','The first additional output is expected by 2028','The first additional output is expected in 2028'],
  [prior.developments.find(d=>d.id===930),'text','The first increases are expected by 2028','The first increases are scheduled for 2028']
 ]){
  assert.equal(holder[key].split(corrected).length,2);
  holder[key]=holder[key].replace(corrected,old);
 }
 assert.equal(hash(prior),'8a936788eb82088ebef10d14d72b169559c8b2378f72c5ec840443536bba7ae5');
 assert.equal(b.reviewedAt,'2026-10-12');
 assert.equal(b.metric.value,'890 MW');
 assert.equal(b.developments.find(d=>d.id===930).date,'2026-10-06');
});
test('October18 precision correction preserves three still-unrevised briefings',()=>{
 const unchanged={"ai-regulation":"569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f","safety-vs-capability":"b0ec7f38a369aacdfa9de4a69c8b2ff4685192cc11a13d20373e976cbe2cad07","evals":"115b28b5eac8e506dedf5333c805e2e6e26d38fdfc345883efeebb44f4e493c7"};
 for(const [id,value] of Object.entries(unchanged))assert.equal(hash(get(id)),value,id);
 assert.equal(briefs.length,9);
});
test('corrected infrastructure narration is exact, valid and rejects the old audio',()=>{
 const b=get('ai-infrastructure');
 const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
 const entry=audioEntry(b,manifest);assert.ok(entry);
 assert.notEqual(entry.src,'audio/briefs/ai-infrastructure-d5e055680656d6cf.m4a');
 const bytes=readFileSync(new URL('../'+entry.src,import.meta.url));
 assert.equal(bytes.length,entry.bytes);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
 const text=readFileSync(new URL('../'+entry.src+'.txt',import.meta.url),'utf8');
 assert.equal(text,narration(b)+'\n');
 assert.match(text,/expected by 2028/);
 assert.doesNotMatch(text,/expected in 2028|scheduled for 2028/);
 const stale=structuredClone(b);
 stale.metric.context=stale.metric.context.replace('expected by 2028','expected in 2028');
 assert.equal(audioEntry(stale,manifest),null);
});
