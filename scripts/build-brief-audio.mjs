// Builds only verify pre-generated assets. No synthesis, credentials or fallback.
import {briefs} from './theme-current.mjs';
import {AUDIO_VERSION} from './brief-audio.mjs';
import {readAudioManifest,verifyCachedAudio} from './brief-audio-cache.mjs';
const defaultRoot=new URL('../',import.meta.url);
export async function buildBriefAudio({root=defaultRoot,briefings=briefs}={}){
 const old=await readAudioManifest(root);
 const manifest={version:1,engine:AUDIO_VERSION,briefs:{}},missing=[];
 for(const b of briefings){
  try{manifest.briefs[b.id]=await verifyCachedAudio(root,b,old);}
  catch(error){missing.push(`${b.id}: ${error.message}`);}
 }
 if(missing.length)throw Error(`Verified Eleven v4 / Rachel narration is required before building.\n${missing.join('\n')}\nRun npm run audio:plan -- /path/to/plan, render its exact transcripts through Rig's registered speak action, then npm run audio:import -- <brief-id> <recording.m4a> <receipt.json>. Builds never generate audio or fall back to Samantha.`);
 return manifest;
}
