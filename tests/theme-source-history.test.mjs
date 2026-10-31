import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {briefs} from '../scripts/theme-current.mjs';
import {sourceHistory} from '../scripts/theme-source-history.mjs';
import {related,renderThemes,validateSourceHistory} from '../scripts/theme-pages.mjs';
import {audioHash} from '../scripts/brief-audio.mjs';

const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const render=history=>renderThemes(home,feed,{audioManifest:{},history});
const records=Object.entries(sourceHistory).flatMap(([theme,b])=>b.developments.map(d=>({theme,...d})));

test('all 47 earlier developments preserve the exact 4c3f649 source notes',()=>{
  assert.equal(records.length,47);
  const original=Object.fromEntries(Object.entries(sourceHistory).map(([id,b])=>[id,b.developments.map(({feedUrl,...d})=>d)]));
  // Independently calculated from the removed developments in commit 4c3f649.
  assert.equal(createHash('sha256').update(JSON.stringify(original)).digest('hex'),'6354228f47a0b0c625353ebcf89c0a8fca612da9b71fc2e2bf40f5019989dba8');
  validateSourceHistory(feed);
  const cdc=sourceHistory.evals.developments.find(d=>d.id===913);
  assert.equal(cdc.source,'CDC');
  assert.equal(cdc.url,'https://www.cdc.gov/flu-forecasting/evaluation/2025-2026-report.html');
  assert.equal(cdc.feedUrl,feed.items.find(i=>i.digestItemId===913).url);
  assert.notEqual(cdc.url,cdc.feedUrl);
});

test('folded history keeps every earlier fragment and full source link without duplicating anchors',()=>{
  const html=render(sourceHistory);
  assert.equal((html.match(/<details class="brief-related brief-source-history">/g)||[]).length,8);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const {theme,...d} of records){
    const anchor=`${theme}-source-${d.id}`;
    assert.equal(ids.filter(id=>id===anchor).length,1,anchor);
    const item=html.split(`id="${anchor}"`)[1].split('</li>')[0];
    for(const url of [d.url,d.primaryUrl].filter(Boolean))assert.ok(item.includes(`href="${escape(new URL(url).href)}"`),anchor+':'+url);
    assert.ok(item.includes(escape(d.text)),anchor);
    if(d.relation)assert.ok(!item.includes(escape(d.relation)),anchor+':internal relation');
  }
  const timelineItems=(html.match(/<li id="[^"]+-source-\d+"/g)||[]).length;
  assert.equal(timelineItems,47+briefs.reduce((n,b)=>n+b.developments.length,0));
});

test('earlier cross-theme source relations remain discoverable in related coverage',()=>{
  const restored={
    'ai-market-leadership':[1014], 'ai-science':[983], 'safety-vs-capability':[958],
    'workplace-agents':[1010,979], 'ai-infrastructure':[1039], 'open-weights':[982], 'agent-economics':[1006]
  };
  for(const [theme,ids] of Object.entries(restored)){
    const items=related(feed,theme);
    assert.equal(items.length,new Set(items.map(i=>i.digestItemId)).size,theme);
    for(const id of ids){
      assert.ok(!feed.items.find(i=>i.digestItemId===id).themes?.some(t=>t.id===theme));
      assert.ok(items.some(i=>i.digestItemId===id),theme+':'+id);
    }
  }
});

test('historical sources fail closed for missing, unreviewed or changed feed provenance',()=>{
  for(const {id} of records)for(const mode of ['missing','unreviewed','wrong-url']){
    const changed={...feed,items:feed.items.flatMap(i=>i.digestItemId!==id?[i]:mode==='missing'?[]:[{...i,reviewed:mode==='unreviewed'?false:i.reviewed,url:mode==='wrong-url'?'https://example.com/other':i.url}])};
    assert.throws(()=>validateSourceHistory(changed),new RegExp(`History source ${id} `),id+':'+mode);
  }
  const unrelated=structuredClone(sourceHistory);delete unrelated['ai-market-leadership'].developments[0].relation;
  assert.throws(()=>validateSourceHistory(feed,unrelated),/History source 1014/);
  for(const field of ['url','primaryUrl','feedUrl']){
    const unsafe=structuredClone(sourceHistory);unsafe['safety-vs-capability'].developments[0][field]='javascript:alert(1)';
    assert.throws(()=>render(unsafe),/Unsafe briefing source/,field);
  }
  const duplicate=structuredClone(sourceHistory);duplicate.evals.developments.push(duplicate.evals.developments[0]);
  assert.throws(()=>render(duplicate),/duplicate history source/);
});

test('history prose is escaped and does not change current timelines or narration',()=>{
  const originalBriefs=JSON.stringify(briefs),hashes=briefs.map(audioHash);
  const history=structuredClone(sourceHistory),d=history['ai-market-leadership'].developments[0];
  const attack='<img src=x onerror="alert(1)"> & \'history\'';
  d.title=attack;d.text=attack;d.source=attack;
  const html=render(history);
  assert.ok(html.includes(escape(attack)));
  assert.ok(!html.includes(attack));
  assert.equal(JSON.stringify(briefs),originalBriefs);
  assert.deepEqual(briefs.map(audioHash),hashes);
  for(const b of briefs){
    const section=html.split(`id="${b.id}"`)[1].split('</section>')[0];
    const mainTimeline=section.split('<ol class="brief-timeline">')[1].split('</ol>')[0];
    assert.equal((mainTimeline.match(/<li id=/g)||[]).length,b.developments.length,b.id);
  }
});
