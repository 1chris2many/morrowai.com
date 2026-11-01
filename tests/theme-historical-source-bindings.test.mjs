import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs as current} from '../scripts/theme-current.mjs';
import {briefs as historical} from './theme-pre-reader-briefs.mjs';
import {validateBriefs} from '../scripts/theme-pages.mjs';
import {withReviewedHistoricalBindings,validateHistoricalBriefs} from './theme-historical-source-bindings.mjs';

const corrections=JSON.parse(readFileSync(new URL('./theme-source-binding-audit.json',import.meta.url)));
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));

test('test adapter changes only the exact two reviewed historical bindings without mutating snapshots',()=>{
 const before=structuredClone(historical),adapted=withReviewedHistoricalBindings(historical);
 assert.deepEqual(historical,before);
 let changed=0;
 for(let index=0;index<historical.length;index++){
  const old=historical[index],next=adapted[index];
  assert.deepEqual({...next,developments:old.developments},old);
  for(let n=0;n<old.developments.length;n++){
   const d=old.developments[n],actual=next.developments[n],c=corrections[d.id];
   if(c&&d.url===c.before.url&&d.source===c.before.source){
    changed++;assert.equal(actual.url,c.after.url);assert.equal(actual.source,c.after.source);
    assert.deepEqual({...actual,url:d.url,source:d.source},d);
   }else assert.deepEqual(actual,d);
  }
 }
 assert.equal(changed,2);
 assert.deepEqual(withReviewedHistoricalBindings(current),current);
});

test('adapter refuses near matches, other source IDs and mismatched explicit feed provenance',()=>{
 for(const id of [1010,1056]){
  const c=corrections[id],d={id,source:c.before.source,url:c.before.url,feedUrl:c.before.feedUrl,title:'Unchanged',text:'Unchanged'};
  const mapped=withReviewedHistoricalBindings([{developments:[d]}])[0].developments[0];
  assert.deepEqual(mapped,{...d,...c.after});
  for(const wrong of [{...d,id:99999},{...d,url:d.url+'?unreviewed'},{...d,source:'Unreviewed publisher'},{...d,feedUrl:'https://example.com/wrong'},{...d,url:c.after.url}]){
   assert.deepEqual(withReviewedHistoricalBindings([{developments:[wrong]}])[0].developments[0],wrong);
  }
 }
});

test('normal validation still rejects missing, unreviewed and wrong source records after test adaptation',()=>{
 validateBriefs(feed);
 for(const id of [1010,1056])for(const mode of ['missing','unreviewed','wrong-url','old-url']){
  const changed={...feed,items:feed.items.flatMap(i=>i.digestItemId!==id?[i]:mode==='missing'?[]:[{...i,
   reviewed:mode==='unreviewed'?false:i.reviewed,
   url:mode==='wrong-url'?'https://example.com/wrong':mode==='old-url'?corrections[id].before.url:i.url,
   themes:mode==='wrong-url'||mode==='old-url'?[]:i.themes}])};
  assert.throws(()=>validateHistoricalBriefs(changed,historical),new RegExp('source '+id),id+':'+mode);
 }
 // A near-matching old URL is not silently upgraded into accepted evidence.
 const altered=structuredClone(historical);
 altered.find(b=>b.id==='workplace-agents').developments.find(d=>d.id===1010).url+='?unreviewed';
 assert.throws(()=>validateHistoricalBriefs(feed,altered),/source 1010/);
});
