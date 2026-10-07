import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {briefs} from '../scripts/theme-current.mjs';
import {renderThemes,validateBriefs,briefingCards} from '../scripts/theme-pages.mjs';
const root=new URL('../',import.meta.url);
const home=await readFile(new URL('index.html',root),'utf8');
const feed=JSON.parse(await readFile(new URL('news.json',root),'utf8'));
test('substantive source-backed briefings are stable, HTML-first and escaped',()=>{
 const before=JSON.stringify(feed),out=renderThemes(home,feed,{preview:true});
 assert.equal(JSON.stringify(feed),before);
 assert.equal((out.match(/class="briefing tone-/g)||[]).length,briefs.length);
 for(const b of briefs){assert.ok(out.includes(b.id));for(const d of b.developments)assert.ok(out.includes(d.url));}
 assert.equal((out.match(/<h3>What it means<\/h3>/g)||[]).length,briefs.length);
 assert.equal((out.match(/<h3>What to watch<\/h3>/g)||[]).length,briefs.length);
 assert.equal((out.match(/opens in a new tab/g)||[]).length,briefs.reduce((n,b)=>n+b.developments.length,0));
 assert.match(out,/Text|AI oversight/);
 assert.match(out,/noindex,nofollow/);assert.doesNotMatch(renderThemes(home,feed),/noindex|nofollow" data-preview/);
 assert.match(out,/rel="canonical" href="https:\/\/usefulaiwerks.com\/themes.html"/);
 const next=structuredClone(feed);next.items[0].title='<script>bad()</script>';
 assert.doesNotMatch(renderThemes(home,next),/<script>bad/);
});
test('new coverage changes related inventory, never analysis date or copy',()=>{
 const next=structuredClone(feed),i=next.items.find(i=>i.themes?.some(t=>t.id==='workplace-agents'));
 const tomorrow=new Date(Date.parse(briefs.map(b=>b.reviewedAt).sort().at(-1))+86400000).toISOString().slice(0,10);
 next.publishedAt=tomorrow+'T19:00:00Z';
 next.items.unshift({...i,digestItemId:99999,digestDate:tomorrow,url:'https://example.com/new-coverage',anchor:'new-coverage',title:'New coverage'});
 const out=renderThemes(home,next);
 assert.match(out,/New coverage since this briefing was reviewed/);
 for(const date of new Set(briefs.map(b=>b.reviewedAt)))assert.equal(out.split('Reviewed <time datetime="'+date+'"').length-1,briefs.filter(b=>b.reviewedAt===date).length);
 assert.match(out,/news.html#new-coverage/);
 for(const b of briefs)assert.ok(out.includes(b.meaning.replaceAll('’','’')));
 assert.match(briefingCards(next),/themes.html#workplace-agents/);
});
test('October 7 editorial additions preserve scope and untouched review dates',()=>{
 for(const id of ['ai-regulation','safety-vs-capability'])assert.equal(briefs.find(b=>b.id===id).reviewedAt,'2026-10-06');
 const workplace=briefs.find(b=>b.id==='workplace-agents');
 assert.match(workplace.developments.find(d=>d.id===932).text,/rubric score of 55.0%/);
 assert.match(workplace.developments.find(d=>d.id===933).text,/exploring/);
 const infrastructure=briefs.find(b=>b.id==='ai-infrastructure');
 assert.match(infrastructure.developments.find(d=>d.id===930).text,/2028/);
 assert.match(infrastructure.developments.find(d=>d.id===934).text,/have not been delivered/);
 const evals=briefs.find(b=>b.id==='evals');assert.equal(evals.developments.length,3);
 assert.equal(new Set(evals.developments.map(d=>new URL(d.url).hostname)).size,3);
 assert.match(evals.developments.find(d=>d.id===916).text,/percentage points/);
 assert.match(evals.developments.find(d=>d.id===913).url,/www.cdc.gov/);
});
test('missing, unreviewed or mistagged source references fail closed',()=>{
 for(const mutate of [i=>null,i=>({...i,reviewed:false}),i=>({...i,themes:[]})]){
  const next=structuredClone(feed);next.items=next.items.map(i=>i.digestItemId===926?mutate(i):i).filter(Boolean);
  assert.throws(()=>validateBriefs(next),/source 926/);
 }
 const copy=structuredClone(briefs);copy[0].developments[0].url='javascript:alert(1)';assert.throws(()=>validateBriefs(feed,copy),/Unsafe/);
});
