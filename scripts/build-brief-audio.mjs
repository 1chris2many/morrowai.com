// Offline generation on the existing Mac publisher. Cached assets also work on other hosts.
import {readFile,writeFile,mkdir,rename,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {briefs} from './theme-current.mjs';
import {AUDIO_VERSION,narration,audioHash,audioEntry} from './brief-audio.mjs';
const root=new URL('../',import.meta.url);
const checksum=bytes=>createHash('sha256').update(bytes).digest('hex');
function run(command,args){const p=spawnSync(command,args,{encoding:'utf8',timeout:90000});if(p.error||p.status!==0)throw Error(`Narration failed: ${command}: ${p.error?.message||p.stderr}`);return p.stdout;}
export async function buildBriefAudio(){
 const dir=new URL('audio/briefs/',root),manifestPath=new URL('manifest.json',dir);
 await mkdir(dir,{recursive:true});
 let old={};try{old=JSON.parse(await readFile(manifestPath,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
 const manifest={version:1,engine:AUDIO_VERSION,briefs:{}};
 for(const b of briefs){
  const prior=audioEntry(b,old);
  if(prior){try{const bytes=await readFile(new URL(prior.src,root));if(bytes.length===prior.bytes&&checksum(bytes)===prior.sha256){manifest.briefs[b.id]=prior;continue;}}catch(e){if(e.code!=='ENOENT')throw e;}}
  if(process.platform!=='darwin')throw Error(`Current narration missing for ${b.id}; generate on the Mac publisher before release.`);
  const hash=audioHash(b),src=`audio/briefs/${b.id}-${hash.slice(0,16)}.m4a`;
  const destination=new URL(src,root),temp=new URL(src+'.tmp.m4a',root),input=new URL(src+'.txt',root);
  // Input text is public reviewed copy, kept as a downloadable transcript.
  await writeFile(input,narration(b)+'\n');
  run('/usr/bin/say',['-v','Samantha','-r','175','-f',input.pathname,'-o',temp.pathname,'--file-format=m4af','--data-format=aac']);
  const info=run('/usr/bin/afinfo',[temp.pathname]);
  const duration=Number(info.match(/estimated duration:\s*([\d.]+)\s*sec/)?.[1]);
  if(!Number.isFinite(duration)||duration<5||(await stat(temp)).size<1000)throw Error(`Invalid narration for ${b.id}`);
  await rename(temp,destination);
  const bytes=await readFile(destination);
  manifest.briefs[b.id]={hash,src,duration,bytes:bytes.length,sha256:checksum(bytes)};
  console.log(`Narrated ${b.id}: ${Math.round(duration)} seconds`);
 }
 const serialized=JSON.stringify(manifest,null,2)+'\n';
 if(JSON.stringify(manifest)!==JSON.stringify(old)){await writeFile(new URL('manifest.json.tmp',dir),serialized);await rename(new URL('manifest.json.tmp',dir),manifestPath);}
 return manifest;
}
