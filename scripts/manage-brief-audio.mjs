// Explicit local handoff to/from Rig's broker. This tool never calls a provider.
import {mkdir,writeFile,rename,rm} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {briefs} from './theme-current.mjs';
import {AUDIO_VERSION,AUDIO_MODEL,AUDIO_VOICE,audioHash,audioEntry,narration,transcriptHash} from './brief-audio.mjs';
import {checksum,readRegular,readAudioManifest,inspectM4a,verifyCachedAudio} from './brief-audio-cache.mjs';
const defaultRoot=new URL('../',import.meta.url);
const folderURL=path=>pathToFileURL(resolve(path)+'/');
async function atomicWrite(path,bytes){
 const temp=new URL(path.href+'.'+randomUUID()+'.tmp');
 try{await writeFile(temp,bytes,{flag:'wx'});await rename(temp,path);}finally{await rm(temp,{force:true});}
}
export async function planBriefAudio(directory,{root=defaultRoot,briefings=briefs}={}){
 const dir=folderURL(directory);await mkdir(dir,{recursive:true});
 const plan={version:1,engine:AUDIO_VERSION,model:AUDIO_MODEL,voice:AUDIO_VOICE,format:'AAC in M4A',briefs:[]};
 const manifest=await readAudioManifest(root);
 for(const b of briefings){
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(b.id))throw Error('Invalid briefing ID');
  const hash=audioHash(b),transcript=`${b.id}.txt`;
  await atomicWrite(new URL(transcript,dir),narration(b)+'\n');
  let needsRender=false,reason='Verified cache is current';
  try{await verifyCachedAudio(root,b,manifest);}catch(error){needsRender=true;reason=error.message;}
  plan.briefs.push({id:b.id,hash,transcriptSha256:transcriptHash(b),transcript,output:`${b.id}-${hash.slice(0,16)}.m4a`,receipt:`${b.id}.receipt.json`,textCharacters:narration(b).length,needsRender,reason});
 }
 await atomicWrite(new URL('requests.json',dir),JSON.stringify(plan,null,2)+'\n');
 return plan;
}
export async function importBriefAudio(id,input,receiptPath,{root=defaultRoot,briefings=briefs}={}){
 const b=briefings.find(b=>b.id===id);if(!b||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id))throw Error('Unknown briefing ID');
 const receipt=JSON.parse((await readRegular(receiptPath,1_000_000)).toString('utf8'));
 if(receipt.id!==id||receipt.engine!==AUDIO_VERSION||receipt.model!==AUDIO_MODEL||receipt.voice!==AUDIO_VOICE)throw Error('Receipt must identify this briefing and Eleven v4 / Rachel');
 if(receipt.hash!==audioHash(b)||receipt.transcriptSha256!==transcriptHash(b))throw Error('Receipt does not match the current reviewed transcript; render a fresh plan');
 const bytes=await readRegular(input);
 if(receipt.bytes!==bytes.length||receipt.sha256!==checksum(bytes))throw Error('Receipt recording checksum or byte count does not match');
 const {duration}=inspectM4a(bytes);
 if(!Number.isFinite(receipt.duration)||Math.abs(duration-receipt.duration)>.1)throw Error('Receipt recording duration does not match');
 const hash=audioHash(b),src=`audio/briefs/${id}-${hash.slice(0,16)}.m4a`;
 const entry={hash,src,duration,bytes:bytes.length,sha256:checksum(bytes),transcriptSha256:transcriptHash(b)};
 const old=await readAudioManifest(root),manifest={version:1,engine:AUDIO_VERSION,briefs:{}};
 for(const current of briefings){const prior=audioEntry(current,old);if(prior)manifest.briefs[current.id]=prior;}
 // An unchanged repeat import is a read-only verification.
 if(JSON.stringify(manifest.briefs[id])===JSON.stringify(entry)){
  try{await verifyCachedAudio(root,b,manifest);return entry;}catch{/* Explicit import repairs a damaged cache. */}
 }
 await mkdir(new URL('audio/briefs/',root),{recursive:true});
 await atomicWrite(new URL(src,root),bytes);
 await atomicWrite(new URL(src+'.txt',root),narration(b)+'\n');
 manifest.briefs[id]=entry;
 await atomicWrite(new URL('audio/briefs/manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
 return entry;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{
  const [command,...args]=process.argv.slice(2);
  if(command==='plan'&&args.length===1){const plan=await planBriefAudio(args[0]);console.log(`Prepared ${plan.briefs.length} exact transcripts for ${plan.engine} in ${resolve(args[0])}. No audio generated.`);}
  else if(command==='import'&&args.length===3){const entry=await importBriefAudio(...args);console.log(`Imported verified ${AUDIO_VERSION} recording: ${entry.src}`);}
  else throw Error('Usage: node scripts/manage-brief-audio.mjs plan <output-directory> | import <brief-id> <recording.m4a> <receipt.json>');
 }catch(error){console.error(error.message);process.exitCode=1;}
}
