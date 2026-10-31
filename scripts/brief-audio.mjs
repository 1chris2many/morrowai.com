// Narration uses the same reviewed fields as the page, never a second AI summary.
import {createHash} from 'node:crypto';
export const AUDIO_VERSION='eleven-v4-rachel-v1';
export const AUDIO_MODEL='eleven_v4';
export const AUDIO_VOICE='21m00Tcm4TlvDq8ikWAM';
export function narration(b){
 const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(b.reviewedAt+'T12:00:00Z'));
 const parts=[`${b.label}. ${b.title}`,`Useful AI Werks. Analysis by ${b.author}. Reviewed ${date}. Synthetic narration.`,b.summary,
  `Three takeaways. ${b.visual.map(([title,detail])=>`${title}. ${detail}.`).join(' ')}`,
  `Why it matters. ${b.meaning}`];
 if(b.metric){const d=b.developments.find(d=>d.id===b.metric.sourceId);parts.push(`${b.metric.value}. ${b.metric.label}. ${b.metric.context} Source: ${d.source}, ${d.date}.`);}
 parts.push(`How the story developed. ${b.timelineIntro}`);
 // Chronological for listening; newest-first remains better for scanning the page.
 for(const d of [...b.developments].sort((a,b)=>a.date.localeCompare(b.date)))parts.push(`${d.dateKind==='source-review'?'Source checked ':''}${new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(d.date+'T12:00:00Z'))}. ${d.title}. ${d.text}${d.why?` Why it’s here. ${d.why}`:''} Source: ${d.source}.`);
 parts.push(`What to watch. ${b.watch}`);
 return parts.join('\n\n');
}
export const audioHash=b=>createHash('sha256').update(AUDIO_VERSION+'\n'+narration(b)).digest('hex');
export const transcriptHash=b=>createHash('sha256').update(narration(b)+'\n').digest('hex');
export function audioEntry(b,manifest){
 const a=manifest?.version===1&&manifest.engine===AUDIO_VERSION?manifest.briefs?.[b.id]:null;
 return a&&a.hash===audioHash(b)&&a.src===`audio/briefs/${b.id}-${a.hash.slice(0,16)}.m4a`
  &&Number.isFinite(a.duration)&&a.duration>=5&&a.duration<=7200
  &&Number.isSafeInteger(a.bytes)&&a.bytes>=1000&&a.bytes<=100*1024*1024
  &&/^[a-f0-9]{64}$/.test(a.sha256)&&a.transcriptSha256===transcriptHash(b)?a:null;
}
export const durationLabel=seconds=>`${Math.floor(Math.round(seconds)/60)}:${String(Math.round(seconds)%60).padStart(2,'0')}`;
