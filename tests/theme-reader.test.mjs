import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {renderThemes,validateBriefs} from '../scripts/theme-pages.mjs';
import {narration} from '../scripts/brief-audio.mjs';
import {readerRevision} from './theme-name-history.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const active=briefs.filter(b=>readerRevision.changes[b.id]);
test('every rewritten brief shows readers how each story connects to the theme',()=>{
 assert.equal(active.length,10);
 for(const b of active)for(const d of b.developments)assert.ok(d.why?.length>=30&&!/reviewed|primary|source/i.test(d.why),b.id+':'+d.id);
 const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 const out=renderThemes(home,feed,{audioManifest:{}});
 assert.equal((out.match(/class="brief-why"/g)||[]).length,active.reduce((n,b)=>n+b.developments.length,0));
 assert.ok(!out.includes(active[0].developments[0].relation));
});
test('a new development without a reader-facing why fails the build',()=>{
 const copy=structuredClone(briefs),b=copy.find(x=>x.id==='ai-market-leadership');delete b.developments[0].why;
 assert.throws(()=>validateBriefs(feed,copy),/reader-facing why/);
});
test('stories read oldest-first on the page and in narration',()=>{
 const home=readFileSync(new URL('../index.html',import.meta.url),'utf8'),out=renderThemes(home,feed,{audioManifest:{}});
 const b=briefs.find(x=>x.id==='ai-market-leadership');
 assert.ok(out.indexOf(b.id+'-source-985')<out.indexOf(b.id+'-source-1063'));
 assert.ok(narration(b).indexOf('More businesses change')<narration(b).indexOf('OpenAI’s fundraising'));
 assert.match(narration(b),/Why it’s here\./);
});
test('reader rewrite keeps evidence dates and sources intact',()=>{
 for(const [id,{before,after}] of Object.entries(readerRevision.changes)){
  assert.equal(after.reviewedAt,before.reviewedAt,id);
  for(const d of after.developments){const o=before.developments.find(x=>x.id===d.id);for(const k of ['date','source','url','primaryUrl','relation'])assert.equal(d[k],o[k],id+':'+d.id+':'+k);}
 }
});
