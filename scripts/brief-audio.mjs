// Narration uses the same reviewed fields as the page, never a second AI summary.
import {createHash} from 'node:crypto';
export const AUDIO_VERSION='macos-samantha-175-v1';
export function narration(b){
 const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(b.reviewedAt+'T12:00:00Z'));
 const parts=[`${b.label}. ${b.title}`,`Useful AI Werks. Analysis by ${b.author}. Reviewed ${date}. Synthetic narration.`,b.summary,
  `Three takeaways. ${b.visual.map(([title,detail])=>`${title}. ${detail}.`).join(' ')}`,
  `What it means. ${b.meaning}`];
 if(b.metric){const d=b.developments.find(d=>d.id===b.metric.sourceId);parts.push(`${b.metric.value}. ${b.metric.label}. ${b.metric.context} Source: ${d.source}, ${d.date}.`);}
 parts.push(`How the story developed. ${b.timelineIntro}`);
 // Chronological for listening; newest-first remains better for scanning the page.
 for(const d of [...b.developments].sort((a,b)=>a.date.localeCompare(b.date)))parts.push(`${new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(d.date+'T12:00:00Z'))}. ${d.title}. ${d.text} Source: ${d.source}.`);
 parts.push(`What to watch. ${b.watch}`);
 return parts.join('\n\n');
}
export const audioHash=b=>createHash('sha256').update(AUDIO_VERSION+'\n'+narration(b)).digest('hex');
export function audioEntry(b,manifest){
 const a=manifest?.version===1?manifest.briefs?.[b.id]:null;
 return a&&a.hash===audioHash(b)&&a.src===`audio/briefs/${b.id}-${a.hash.slice(0,16)}.m4a`&&Number.isFinite(a.duration)&&a.duration>0?a:null;
}
export const durationLabel=seconds=>`${Math.floor(Math.round(seconds)/60)}:${String(Math.round(seconds)%60).padStart(2,'0')}`;
