import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderHome,developing} from '../scripts/news-first-home.mjs';
const home=await readFile(new URL('../index.html',import.meta.url),'utf8');
const published=home;
const feed=JSON.parse(await readFile(new URL('../news.json',import.meta.url)));
const perspectives=await readFile(new URL('../perspectives.html',import.meta.url),'utf8');
const section=(html,id)=>html.match(new RegExp(`<section\\b[^>]*\\bid="${id}"[^>]*>[\\s\\S]*?</section>`))[0];
test('production regenerates without drift or mutation and preserves profile, contact and privacy assets',()=>{
 const before=JSON.stringify(feed);assert.equal(renderHome(home,feed,perspectives),home);assert.equal(JSON.stringify(feed),before);
 for(const id of ['about','contact'])assert.equal(section(home,id),section(published,id));
 for(const value of ['google-site-verification','js/analytics.js?v=20260925','data-analytics-opt-out'])assert.ok(home.includes(value));
 assert.doesNotMatch(home,/noindex|nofollow/);
 assert.doesNotMatch(home,/final editorial copy pending|public role copy pending|data-editorial-placeholder/);
});
test('new edition refreshes Latest and chronological themes without stale headline copies',()=>{
 const next=structuredClone(feed),c={...next.items.find(i=>i.themes?.some(t=>t.id==='safety-vs-capability')),digestItemId:99999,digestDate:'2026-09-26',anchor:'story-2026-09-26-synthetic',title:'Synthetic next-edition headline',summary:'Synthetic next-edition summary for isolated validation.'};
 next.items.unshift(c);next.digestDate=c.digestDate;next.notice='2026-09-25 · 1 story';
 const out=renderHome(home,next,perspectives),latest=section(out,'latest');
 assert.equal((latest.match(/data-digest-item-id=/g)||[]).length,1);assert.ok(latest.includes(c.summary));assert.ok(latest.includes(c.digestDate));
 assert.ok(section(out,'developing').includes('14 related stories'));
 assert.equal(section(out,'about'),section(home,'about'));
});
test('single-story themes are not featured and new published Perspectives can grow the list',()=>{
 assert.doesNotMatch(developing(feed),/data-theme="agentic-commerce"/);
 assert.equal((developing({...feed,items:[feed.items[0]]}).match(/data-theme=/g)||[]).length,0);
 const extra='<a class="essay-card" data-author-id="test-author" href="future.html"><h2>A future approved piece</h2></a>';
 assert.ok(renderHome(home,feed,perspectives+extra).includes('<h3>A future approved piece</h3>'));
 assert.throws(()=>renderHome(home,feed,''),/inventory/);
});
test('invalid feed and duplicate identity fail before returning a homepage',()=>{
 assert.throws(()=>renderHome(home,{...feed,items:[...feed.items,feed.items[0]]},perspectives),/duplicate/);
 assert.throws(()=>renderHome(home,{...feed,items:feed.items.map((i,n)=>n?i:{...i,reviewed:false})},perspectives),/Unreviewed/);
});
test('production regeneration cannot restore private-preview robots restrictions',()=>{
 const production=renderHome(home,feed,perspectives,{preview:false});
 assert.doesNotMatch(production,/noindex|nofollow|data-preview-robots/);
 assert.equal(renderHome(production,feed,perspectives),production);
 const privateAgain=renderHome(production,feed,perspectives,{preview:true});
 assert.equal((privateAgain.match(/name="robots"/g)||[]).length,1);
 assert.match(privateAgain,/noindex,nofollow/);
 assert.equal(renderHome(privateAgain,feed,perspectives,{preview:true}),privateAgain);
 assert.equal(renderHome(privateAgain,feed,perspectives),production);
});
