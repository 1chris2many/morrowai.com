import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {briefs} from '../scripts/theme-briefs.mjs';
import {renderThemes,validateBriefs,briefingCards} from '../scripts/theme-pages.mjs';
const root=new URL('../',import.meta.url);
const home=await readFile(new URL('index.html',root),'utf8');
const feed=JSON.parse(await readFile(new URL('news.json',root),'utf8'));
test('three substantive source-backed briefings are stable, HTML-first and escaped',()=>{
 const before=JSON.stringify(feed),out=renderThemes(home,feed,{preview:true});
 assert.equal(JSON.stringify(feed),before);
 assert.equal((out.match(/class="briefing tone-/g)||[]).length,3);
 for(const b of briefs){assert.ok(out.includes(b.id));for(const d of b.developments)assert.ok(out.includes(d.url));}
 assert.equal((out.match(/<h3>What it means<\/h3>/g)||[]).length,3);
 assert.equal((out.match(/<h3>What to watch<\/h3>/g)||[]).length,3);
 assert.equal((out.match(/opens in a new tab/g)||[]).length,9);
 assert.match(out,/UK MPs have invited four major labs/);
 assert.match(out,/noindex,nofollow/);assert.doesNotMatch(renderThemes(home,feed),/noindex|nofollow" data-preview/);
 assert.match(out,/rel="canonical" href="https:\/\/usefulaiwerks.com\/themes.html"/);
 const next=structuredClone(feed);next.items[0].title='<script>bad()</script>';
 assert.doesNotMatch(renderThemes(home,next),/<script>bad/);
});
test('new coverage changes related inventory, never analysis date or copy',()=>{
 const next=structuredClone(feed),i=next.items.find(i=>i.themes?.some(t=>t.id==='workplace-agents'));
 next.items.unshift({...i,digestItemId:99999,digestDate:'2026-09-26',anchor:'new-coverage',title:'New coverage'});
 const out=renderThemes(home,next);
 assert.match(out,/New coverage since this briefing was reviewed/);
 assert.equal((out.match(/Reviewed <time datetime="2026-09-25"/g)||[]).length,3);
 assert.match(out,/news.html#new-coverage/);
 for(const b of briefs)assert.ok(out.includes(b.meaning.replaceAll('’','’')));
 assert.match(briefingCards(next),/themes.html#workplace-agents/);
});
test('missing, unreviewed or mistagged source references fail closed',()=>{
 for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===783?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),/source 783/);
 }
 const copy=structuredClone(briefs);copy[0].developments[0].url='javascript:alert(1)';assert.throws(()=>validateBriefs(feed,copy),/Unsafe/);
});
