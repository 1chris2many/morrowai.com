import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {beforeOct20} from './theme-name-history.mjs';
import {reviewedIds} from '../scripts/theme-reviewed-inventory.mjs';
import {sourceOrganization,themeQueue,lifecycle} from '../scripts/theme-lifecycle.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
// Historical October19 triage uses only its nine briefs, undoing byte-exact
// approved October20 replacements; today's evidence has its own regression.
const historical=briefs.filter(b=>b.id!=='robot-transfer').map(beforeOct20);
const fixture=(urls)=>({items:urls.map((url,n)=>({digestItemId:990001+n,digestDate:'2026-10-19',reviewed:true,url,title:'Distinct development '+n,themes:[{id:'candidate-only',name:'Candidate'}]}))});
test('Google research and blogs count as one source organization',()=>{
 const urls=['https://blog.google/a','https://deepmind.google/b','https://research.google/c'];
 assert.deepEqual(urls.map(sourceOrganization),['google','google','google']);
 assert.equal(themeQueue(fixture(urls),'2026-10-19',historical).candidates.length,0);
});
test('NVIDIA newsroom and company blog cannot manufacture source diversity',()=>{
 const urls=['https://blogs.nvidia.com/a','https://nvidianews.nvidia.com/b'];
 assert.deepEqual(urls.map(sourceOrganization),['nvidia','nvidia']);
 assert.equal(themeQueue(fixture(urls),'2026-10-19',historical).candidates.length,0);
});
test('separate organizations still produce a review candidate, not an approved briefing',()=>{
 const before=JSON.stringify(briefs),q=themeQueue(fixture(['https://research.google/a','https://home.cern/b']),'2026-10-19',historical);
 assert.equal(q.candidates.length,1);assert.equal(q.candidates[0].sourceCount,2);
 assert.equal(JSON.stringify(briefs),before);
});
test('organization folding is exact and cannot swallow similarly named hosts',()=>{
 for(const host of ['research.google.example.org','nvidianews.nvidia.com.example.org','other.nvidia.com'])assert.equal(sourceOrganization('https://'+host+'/a'),host);
 assert.equal(sourceOrganization('https://www.research.google/a'),'google');
 assert.equal(sourceOrganization('https://www.anthropic.com/a'),sourceOrganization('https://claude.com/b'));
});
test('October19 source triage does not imply incorporation or change source dates',()=>{
 for(const id of [989,990,991,992,993]){
  assert.ok(reviewedIds.includes(id));
  assert.ok(feed.items.some(i=>i.digestItemId===id));
  assert.ok(!briefs.some(b=>b.developments.some(d=>d.id===id)));
 }
 assert.ok(!reviewedIds.includes(980));
 assert.equal(briefs.find(b=>b.id==='ai-regulation').reviewedAt,'2026-10-09');
 assert.equal(lifecycle(briefs.find(b=>b.id==='ai-regulation'),'2026-10-19').status,'watching');
 assert.equal(themeQueue(feed,'2026-10-19',historical).unclassified.filter(i=>!reviewedIds.includes(i.id)).length,0);
});
