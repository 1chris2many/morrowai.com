// Deterministic editorial triage; never generates or approves public analysis.
import {briefs} from './theme-current.mjs';
import {reviewedIds} from './theme-reviewed-inventory.mjs';
const DAY=86400000;
export function day(value){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||new Date(value+'T00:00:00Z').toISOString().slice(0,10)!==value)throw Error('Invalid theme date');
 return value;
}
export function asOf(feed){return day(process.env.THEME_AS_OF || new Intl.DateTimeFormat('en-CA',{timeZone:'America/Los_Angeles'}).format(new Date(feed.publishedAt)));}
const age=(now,then)=>(Date.parse(day(now))-Date.parse(day(then)))/DAY;
export function lifecycle(b,now){
 if(age(now,b.reviewedAt)<0)throw Error('Future briefing review');
 const latest=b.developments.map(d=>day(d.date)).sort().at(-1);
 if(b.retiredAt&&b.retiredAt<=now)return {status:'archived',reason:b.retirementReason||'Editorially retired'};
 if(age(now,b.reviewedAt)>14||age(now,latest)>21)return {status:'archived',reason:'Historical briefing'};
 if(age(now,b.reviewedAt)>7||age(now,latest)>14)return {status:'watching',reason:'Awaiting a fresh assessment'};
 return {status:'active',reason:'Current briefing'};
}
export function canonical(raw){const u=new URL(raw);u.hash='';for(const k of [...u.searchParams.keys()])if(k.startsWith('utm_')||['ref','fbclid','gclid'].includes(k))u.searchParams.delete(k);return u.href.replace(/\/$/,'');}
export function distinct(items){const seen=new Set();return items.filter(i=>{const k=canonical(i.url);if(seen.has(k))return false;seen.add(k);return true;});}
export function sourceOrganization(raw){
 const host=new URL(raw).hostname.replace(/^www\./,'');
 if(['claude.com','anthropic.com'].includes(host))return 'anthropic';
 if(host==='blog.google'||host==='deepmind.google')return 'google';
 return host;
}
export function themeQueue(feed,now=asOf(feed),content=briefs){
 const reviewed=feed.items.filter(i=>i.reviewed===true&&i.digestDate<=now);
 const recent=distinct(reviewed.filter(i=>age(now,i.digestDate)<=7).sort((a,b)=>a.digestDate.localeCompare(b.digestDate)));
 const summarize=items=>items.map(i=>({id:i.digestItemId,editionDate:i.digestDate,title:i.title,url:i.url,source:i.source}));
 const updates=content.map(b=>{
  const covered=new Set(b.developments.map(d=>d.id));
  const items=distinct(reviewed.filter(i=>!reviewedIds.includes(i.digestItemId)&&!covered.has(i.digestItemId)&&i.themes?.some(t=>t.id===b.id)));
  return {id:b.id,reviewedAt:b.reviewedAt,...lifecycle(b,now),needsReview:items.length>0||age(now,b.reviewedAt)>=1,items:summarize(items)};
 });
 const topics=[...new Map(recent.flatMap(i=>(i.themes||[]).map(t=>[t.id,t]))).values()];
 const candidates=topics.filter(t=>!content.some(b=>b.id===t.id)).map(t=>{
  const items=recent.filter(i=>i.themes?.some(x=>x.id===t.id));
  const sources=new Set(items.map(i=>sourceOrganization(i.url)));
  return {id:t.id,name:t.name,sourceCount:sources.size,items:summarize(items)};
 }).filter(t=>t.items.length>=2&&t.sourceCount>=2);
 const reviewDay=updates.some(b=>b.needsReview)?now:new Date(Date.parse(now)+DAY).toISOString().slice(0,10);
 return {version:1,asOf:now,owner:'codex',nextReviewBy:reviewDay+'T10:00:00 America/Los_Angeles',
  note:'Discovery signals only. Edition dates are not event dates. Check original sources, duplicate events and source independence before creating or updating a briefing. Inspect unclassified stories for themes not in the taxonomy. Retirement is editorial or age-based archival, not proof a trend has ended.',
  updates,candidates,unclassified:summarize(recent.filter(i=>!i.themes?.length))};
}
