import {briefs} from './theme-briefs.mjs';
const e=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=value=>new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
function external(raw){const u=new URL(raw);if(u.protocol!=='https:'||u.username||u.password)throw Error('Unsafe briefing source');return e(u.href);}
export function related(feed,id){return feed.items.filter(i=>i.themes?.some(t=>t.id===id)).sort((a,b)=>b.digestDate.localeCompare(a.digestDate)||a.title.localeCompare(b.title));}
export function validateBriefs(feed,content=briefs){
  const ids=new Set();
  for(const b of content){
    if(ids.has(b.id)||!['ai-regulation','safety-vs-capability','workplace-agents'].includes(b.id))throw Error('Invalid briefing identity');ids.add(b.id);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(b.reviewedAt)||!b.author||b.developments.length!==3||b.visual.length!==3)throw Error('Incomplete briefing');
    for(const d of b.developments){
      external(d.url);
      if(d.date>b.reviewedAt)throw Error('Briefing review predates evidence');
      if(!feed.items.some(i=>i.digestItemId===d.id&&i.reviewed===true&&i.themes?.some(t=>t.id===b.id)))throw Error(`Briefing source ${d.id} missing, unreviewed or unrelated`);
    }
  }
}
function visual(b){return `<figure class="brief-map"><figcaption>${e(b.visualTitle)}</figcaption><ul>${b.visual.map(([title,detail],i)=>`<li><span class="map-number" aria-hidden="true">0${i+1}</span><strong>${e(title)}</strong><span>${e(detail)}</span></li>`).join('')}</ul></figure>`;}
export function briefingCards(feed){
  return `<section id="developing" aria-labelledby="developing-heading"><div class="section-heading"><div><p class="kicker">Developing stories</p><h2 id="developing-heading">The bigger picture.</h2></div><a href="themes.html">Explore the briefings →</a></div><div class="brief-grid">${briefs.filter(b=>related(feed,b.id).length>=2).map((b,i)=>`<article class="brief-card tone-${b.accent}" data-theme="${b.id}"><div class="brief-card-top"><p class="kicker">${e(b.label)}</p><span class="brief-index" aria-hidden="true">0${i+1}</span></div><h3><a href="themes.html#${b.id}">${e(b.title)}</a></h3><p>${e(b.teaser)}</p>${visual(b)}<p class="meta">Reviewed ${date(b.reviewedAt)} · ${related(feed,b.id).length} related stories</p><a class="brief-link" href="themes.html#${b.id}">Read the briefing <span aria-hidden="true">↗</span></a></article>`).join('')}</div></section>`;
}
export function renderThemes(home,feed,{preview=false}={}){
  validateBriefs(feed);
  let head=home.slice(0,home.indexOf('</head>'))
    .replace(/<title>.*?<\/title>/,'<title>Developing stories — Useful AI Werks</title>')
    .replace(/<meta name="description"[^>]*>/,'<meta name="description" content="Briefings on AI governance, agent safety and work: what is changing, why it matters, and what comes next.">')
    .replace(/<link rel="canonical"[^>]*>/,'<link rel="canonical" href="https://usefulaiwerks.com/themes.html">')
    .replace(/<meta property="og:url"[^>]*>/,'<meta property="og:url" content="https://usefulaiwerks.com/themes.html">')
    .replace(/<meta property="og:title"[^>]*>/,'<meta property="og:title" content="Developing stories — Useful AI Werks">')
    .replace(/<meta property="og:description"[^>]*>/,'<meta property="og:description" content="Briefings on AI governance, agent safety and work: what is changing, why it matters, and what comes next.">')
    .replace(/\n?<meta name="robots" content="noindex,nofollow"(?: data-preview-robots)?\s*>/g,'');
  if(preview)head+='\n<meta name="robots" content="noindex,nofollow" data-preview-robots>';
  const articles=briefs.map(b=>{
    const items=related(feed,b.id),latest=items[0].digestDate;
    return `<section class="briefing tone-${b.accent}" id="${b.id}" aria-labelledby="${b.id}-title"><header class="brief-heading"><p class="kicker">${e(b.label)}</p><h2 id="${b.id}-title">${e(b.title)}</h2><p class="brief-deck">${e(b.summary)}</p><p class="meta">Analysis by ${e(b.author)} · Reviewed <time datetime="${b.reviewedAt}">${date(b.reviewedAt)}</time></p></header>${visual(b)}<div class="brief-columns"><div><h3>What it means</h3><p>${e(b.meaning)}</p><aside class="watch-next"><h3>What to watch</h3><p>${e(b.watch)}</p></aside></div><div><h3>Key developments</h3><ol class="brief-timeline">${b.developments.map(d=>`<li><time datetime="${d.date}">${date(d.date)}</time><h4>${e(d.title)}</h4><p>${e(d.text)}</p><a href="${external(d.url)}" target="_blank" rel="noopener noreferrer">${e(d.source)} <span aria-hidden="true">↗</span><span class="brief-sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ol></div></div><details class="brief-related"><summary>${items.length} related stories · Latest coverage ${date(latest)}</summary>${latest>b.reviewedAt?'<p class="meta">New coverage since this briefing was reviewed.</p>':''}<ol>${items.map(i=>`<li><time datetime="${i.digestDate}">Edition ${date(i.digestDate)}</time> · <a href="news.html#${e(i.anchor)}">${e(i.title)}</a></li>`).join('')}</ol><a href="news.html?theme=${b.id}">Open filtered news archive →</a></details></section>`;
  }).join('\n');
  const footer=home.slice(home.indexOf('</main>')+7);
  return `${head}</head><body class="news-first theme-page"><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="brand" href="./">USEFUL AI <span>WERKS</span></a><nav aria-label="Main navigation"><a href="index.html#latest">Latest</a><a href="themes.html" aria-current="page">Developing stories</a><a href="perspectives.html">Perspectives</a><a href="index.html#team">Team</a></nav></header><main id="main" tabindex="-1"><header class="intro"><p class="kicker">The bigger picture</p><h1>Follow the story.<br>Understand the change.</h1><p>Three briefings on the decisions shaping AI.</p><nav class="brief-jump" aria-label="Choose a briefing">${briefs.map(b=>`<a href="#${b.id}">${e(b.label)} ↓</a>`).join('')}</nav></header>${articles}</main>${footer}`;
}
