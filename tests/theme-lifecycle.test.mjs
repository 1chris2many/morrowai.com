import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {lifecycle,themeQueue,distinct,day,sourceOrganization} from '../scripts/theme-lifecycle.mjs';
import {briefingCards,renderThemes} from '../scripts/theme-pages.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const reviewDay=briefs.map(b=>b.reviewedAt).sort().at(-1);
test('aging removes old analysis from front page, retains stable archive anchors',()=>{
 assert.equal(lifecycle(briefs[0],'2026-10-06').status,'active');
 assert.equal(lifecycle(briefs[0],'2026-10-14').status,'watching');
 assert.equal(lifecycle(briefs[0],'2026-10-21').status,'archived');
 const archivedDay=new Date(Date.parse(reviewDay)+15*86400000).toISOString().slice(0,10);
 const f={...feed,publishedAt:archivedDay+'T19:00:00Z'};
 assert.doesNotMatch(briefingCards(f),/class="brief-card tone-/);
 const html=renderThemes(home,f);for(const b of briefs)assert.ok(html.includes('id="'+b.id+'"'));
 assert.match(html,/Historical briefing/);
 assert.match(html,/2026-10-06/);
});
test('explicit retirement wins; refreshed source evidence can reactivate',()=>{
 const b={...briefs[0],retiredAt:'2026-10-06',retirementReason:'Story resolved'};
 assert.equal(lifecycle(b,'2026-10-06').status,'archived');
 const renewed={...briefs[0],reviewedAt:'2026-10-22',developments:[{date:'2026-10-22'}]};
 assert.equal(lifecycle(renewed,'2026-10-22').status,'active');
 assert.throws(()=>lifecycle(renewed,'2026-10-06'),/Future/);
 assert.throws(()=>day('2026-02-30'),/Invalid/);
});
test('same-day new evidence queues review, does not rewrite copy; duplicates collapse',()=>{
 const i=feed.items.find(i=>i.digestItemId===926), before=JSON.stringify(briefs);
 const f={...feed,items:[...feed.items,{...i,digestItemId:99001,url:'https://example.com/new'}, {...i,digestItemId:99002,url:'https://example.com/new?utm_source=test'}]};
 const q=themeQueue(f,reviewDay);
 assert.equal(q.updates.find(x=>x.id==='ai-regulation').items.length,1);
 assert.equal(q.updates.find(x=>x.id==='ai-regulation').needsReview,true);
 assert.equal(JSON.stringify(briefs),before);
});
test('candidate needs distinct URLs and two publishers; unclassified stories surfaced',()=>{
 // Anchor synthetic coverage to the reviewed fixture, not a later live edition.
 const i={...feed.items[0],digestDate:reviewDay,reviewed:true};
 const f={...feed,items:[{...i,digestItemId:99001,url:'https://a.example/a',themes:[{id:'new-topic',name:'New'}]},{...i,digestItemId:99002,url:'https://b.example/b',themes:[{id:'new-topic',name:'New'}]},{...i,digestItemId:99003,url:'https://c.example/c',themes:[]}]};
 const q=themeQueue(f,reviewDay);assert.equal(q.candidates.length,1);assert.equal(q.unclassified.length,1);
 f.items[1].url='https://a.example/b';assert.equal(themeQueue(f,reviewDay).candidates.length,0);
 assert.equal(distinct([{url:'https://a.example/a'},{url:'https://a.example/a?utm_campaign=x#top'}]).length,1);
});
test('held and future coverage cannot produce candidates',()=>{
 assert.equal(sourceOrganization('https://claude.com/blog/a'),sourceOrganization('https://www.anthropic.com/news/b'));
 const f={...feed,items:feed.items.map(i=>({...i,reviewed:false}))};assert.equal(themeQueue(f,reviewDay).candidates.length,0);
 const future={...feed,items:feed.items.map(i=>({...i,digestDate:'2027-01-01'}))};assert.equal(themeQueue(future,reviewDay).candidates.length,0);
});
