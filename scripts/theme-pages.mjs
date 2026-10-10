import {briefs} from './theme-current.mjs';
import {asOf,lifecycle,day,distinct} from './theme-lifecycle.mjs';
import {readFileSync} from 'node:fs';
import {narration,audioEntry,durationLabel} from './brief-audio.mjs';
const e=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=value=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
function external(raw){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password)throw Error('Unsafe briefing source');return e(u.href);}
export function related(feed,id){return distinct(feed.items.filter(i=>i.reviewed===true&&i.themes?.some(t=>t.id===id)).sort((a,b)=>b.digestDate.localeCompare(a.digestDate)||a.title.localeCompare(b.title)));}
export function validateBriefs(feed,content=briefs){
  const ids=new Set();
  for(const b of content){
    if(ids.has(b.id)||!/^[-a-z0-9]+$/.test(b.id))throw Error('Invalid briefing identity');ids.add(b.id);
    day(b.reviewedAt);lifecycle(b,asOf(feed));
    if(!b.author||b.developments.length<2||b.visual.length!==3)throw Error('Incomplete briefing');
    if(typeof b.timelineIntro!=='string'||b.timelineIntro.length<60)throw Error('Missing timeline context');
    if(b.metric&&(!b.metric.value||!b.metric.label||!b.metric.context||!b.developments.some(d=>d.id===b.metric.sourceId)))throw Error('Metric needs a briefing source and context');
    for(const d of b.developments){
      external(d.url);
      day(d.date);if(d.date>b.reviewedAt)throw Error('Briefing review predates evidence');
      if(!feed.items.some(i=>i.digestItemId===d.id&&i.reviewed===true&&(i.themes?.some(t=>t.id===b.id)||typeof d.relation==='string'&&d.relation.length>=30)))throw Error(`Briefing source ${d.id} missing, unreviewed or unrelated`);
    }
  }
}
function visual(b){return `<figure class="brief-map"><figcaption>${e(b.visualTitle)}</figcaption><ul>${b.visual.map(([title,detail],i)=>`<li><span class="map-number" aria-hidden="true">0${i+1}</span><strong>${e(title)}</strong><span>${e(detail)}</span></li>`).join('')}</ul></figure>`;}
function metric(b){if(!b.metric)return '';const m=b.metric,d=b.developments.find(d=>d.id===m.sourceId);return `<aside class="brief-metric" aria-label="A number in context"><strong>${e(m.value)}</strong><h3>${e(m.label)}</h3><p>${e(m.context)}</p><a href="#${b.id}-source-${d.id}">${e(d.source)} · ${date(d.date)} →</a></aside>`;}
function readAudio(){try{return JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url),'utf8'));}catch{return {};}}
function listen(b,manifest){const a=audioEntry(b,manifest);if(!a)return '<p class="meta">Narration is being updated. The complete briefing is below.</p>';return `<div class="brief-listen" data-brief-audio="${b.id}" data-audio-hash="${a.hash}" data-duration="${a.duration}"><div class="listen-heading"><strong id="${b.id}-listen">Listen to this brief</strong><span>${durationLabel(a.duration)} · Synthetic voice</span></div><audio controls preload="none" src="${a.src}" aria-labelledby="${b.id}-listen">Your browser does not support audio playback.</audio><div class="audio-options" data-audio-options hidden><label>Speed <select aria-label="Playback speed for ${e(b.label)}">${[.75,1,1.25,1.5,2].map(r=>`<option value="${r}"${r===1?' selected':''}>${r}×</option>`).join('')}</select></label><button type="button" data-resume hidden>Resume</button><button type="button" data-restart>Start over</button></div><p class="audio-status" role="status" aria-live="polite"></p><details class="audio-transcript"><summary>Read the narration transcript</summary>${narration(b).split('\n\n').map(p=>`<p>${e(p)}</p>`).join('')}</details><p class="audio-privacy">Playback position is saved on this browser when storage is available.</p></div>`;}
export function briefingCards(feed){
  return `<section id="developing" aria-labelledby="developing-heading"><div class="section-heading"><div><p class="kicker">Developing stories</p><h2 id="developing-heading">The bigger picture.</h2></div><a href="themes.html">Explore the briefings →</a></div><div class="brief-grid">${briefs.filter(b=>lifecycle(b,asOf(feed)).status==="active"&&related(feed,b.id).length>=2).map((b,i)=>`<article class="brief-card tone-${b.accent}" data-theme="${b.id}"><div class="brief-card-top"><p class="kicker">${e(b.label)}</p><span class="brief-index" aria-hidden="true">0${i+1}</span></div><h3><a href="themes.html#${b.id}">${e(b.title)}</a></h3><p>${e(b.teaser)}</p>${visual(b)}<p class="meta">Reviewed ${date(b.reviewedAt)} · ${related(feed,b.id).length} related stories</p><a class="brief-link" href="themes.html#${b.id}">Read the briefing <span aria-hidden="true">↗</span></a></article>`).join('')}</div></section>`;
}
export function renderThemes(home,feed,{preview=false,audioManifest=readAudio()}={}){
  validateBriefs(feed);
  let head=home.slice(0,home.indexOf('</head>'))
    .replace(/<title>.*?<\/title>/,'<title>Developing stories — Useful AI Werks</title>')
    .replace(/<meta name="description"[^>]*>/,'<meta name="description" content="Briefings on the forces shaping AI: what is changing, why it matters, and what comes next.">')
    .replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://usefulaiwerks.com/themes.html">')
    .replace(/<meta property="og:url"[^>]*>/,'<meta property="og:url" content="https://usefulaiwerks.com/themes.html">')
    .replace(/<meta property="og:title"[^>]*>/,'<meta property="og:title" content="Developing stories — Useful AI Werks">')
    .replace(/<meta property="og:description"[^>]*>/,'<meta property="og:description" content="Briefings on the forces shaping AI: what is changing, why it matters, and what comes next.">')
    .replace(/\n?<meta name="robots" content="noindex,nofollow"(?: data-preview-robots)?\s*>/g,'');
  if(preview)head+='\n<meta name="robots" content="noindex,nofollow" data-preview-robots>';
  const ordered=[...briefs].sort((a,b)=>(lifecycle(a,asOf(feed)).status==="active"?0:1)-(lifecycle(b,asOf(feed)).status==="active"?0:1));
  const articles=ordered.map(b=>{
    const items=related(feed,b.id),latest=items[0].digestDate;
    return `<section class="briefing tone-${b.accent}" id="${b.id}" aria-labelledby="${b.id}-title"><header class="brief-heading"><p class="kicker">${e(b.label)} · ${e(lifecycle(b,asOf(feed)).reason)}</p><h2 id="${b.id}-title">${e(b.title)}</h2><p class="brief-deck">${e(b.summary)}</p><p class="meta">Analysis by ${e(b.author)} · Reviewed <time datetime="${b.reviewedAt}">${date(b.reviewedAt)}</time></p>${listen(b,audioManifest)}</header>${visual(b)}<div class="brief-columns"><div><h3>What it means</h3><p>${e(b.meaning)}</p>${metric(b)}<aside class="watch-next"><h3>What to watch</h3><p>${e(b.watch)}</p></aside></div><div><h3>Key developments</h3><p class="timeline-intro">${e(b.timelineIntro)}</p><ol class="brief-timeline">${b.developments.map(d=>`<li id="${b.id}-source-${d.id}"><time datetime="${d.date}">${date(d.date)}</time><h4>${e(d.title)}</h4><p>${e(d.text)}</p><a href="${external(d.url)}" target="_blank" rel="noopener noreferrer">${e(d.source)} <span aria-hidden="true">↗</span><span class="brief-sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ol></div></div><details class="brief-related"><summary>${items.length} related stories · Latest coverage ${date(latest)}</summary>${latest>b.reviewedAt?'<p class="meta">New coverage since this briefing was reviewed.</p>':''}<ol>${items.map(i=>`<li><time datetime="${i.digestDate}">Edition ${date(i.digestDate)}</time> · <a href="news.html#${e(i.anchor)}">${e(i.title)}</a></li>`).join('')}</ol><a href="news.html?theme=${b.id}">Open filtered news archive →</a></details></section>`;
  }).join('\n');
  const footer=home.slice(home.indexOf('</main>')+7).replace('</body>','<script type="module" src="js/brief-audio.js?v=20261010"></script></body>');
  return `${head}</head><body class="news-first theme-page"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="./">USEFUL AI <span>WERKS</span></a><nav aria-label="Main navigation"><a href="index.html#latest">Latest</a><a href="themes.html" aria-current="page">Developing stories</a><a href="perspectives.html">Perspectives</a><a href="index.html#team">Team</a></nav></header><main id="main" tabindex="-1"><header class="intro"><p class="kicker">The bigger picture</p><h1>Follow the story.<br>Understand the change.</h1><p>The forces shaping AI, with dated analysis and the developments behind it.</p><nav class="brief-jump" aria-label="Choose a briefing">${ordered.map(b=>`<a href="#${b.id}">${e(b.label)}${lifecycle(b,asOf(feed)).status==="active"?"":" (archive / watching)"} ↓</a>`).join('')}</nav></header>${articles}</main>${footer}`;
}
