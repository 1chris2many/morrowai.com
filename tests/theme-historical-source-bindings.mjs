// Test-only bridge between preserved pre-review snapshots and the two reviewed
// source replacements. Never import this adapter from production code.
import {readFileSync} from 'node:fs';
import {validateBriefs} from '../scripts/theme-pages.mjs';

const corrections=JSON.parse(readFileSync(new URL('./theme-source-binding-audit.json',import.meta.url)));
const reviewedIds=new Set([1010,1056]);

export function withReviewedHistoricalBindings(content){
 return content.map(b=>({...b,developments:b.developments.map(d=>{
  const c=reviewedIds.has(d.id)?corrections[d.id]:null;
  if(!c||d.url!==c.before.url||d.source!==c.before.source||
    (d.feedUrl!==undefined&&d.feedUrl!==c.before.feedUrl))return d;
  return {...d,source:c.after.source,url:c.after.url,
   ...(d.feedUrl===undefined?{}:{feedUrl:c.after.feedUrl})};
 })}));
}

export function validateHistoricalBriefs(feed,content){
 // Feed records, reviewed flags, relations, dates, prose and all other source
 // URLs remain untouched. The normal fail-closed validator still makes the decision.
 return validateBriefs(feed,withReviewedHistoricalBindings(content));
}
