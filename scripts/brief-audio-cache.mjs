import {constants} from 'node:fs';
import {open} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {audioEntry,narration} from './brief-audio.mjs';
export const checksum=bytes=>createHash('sha256').update(bytes).digest('hex');
export async function readRegular(path,maxBytes=100*1024*1024){
 const file=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW);
 try{
  const stat=await file.stat();
  if(!stat.isFile()||stat.size<1||stat.size>maxBytes)throw Error('Expected a bounded regular file');
  return await file.readFile();
 }finally{await file.close();}
}
export async function readAudioManifest(root){
 try{return JSON.parse((await readRegular(new URL('audio/briefs/manifest.json',root),1_000_000)).toString('utf8'));}
 catch(error){if(error.code==='ENOENT')return {};throw Error('Audio manifest is unreadable or malformed');}
}

// Inspect ISO BMFF metadata without a platform-specific encoder or subprocess.
// Browser decoding remains a release check; this is not voice authentication.
function boxes(bytes,start=0,end=bytes.length){
 const result=[];
 for(let offset=start;offset<end;){
  if(end-offset<8)throw Error('Truncated M4A box');
  let size=bytes.readUInt32BE(offset),header=8;
  if(size===1){if(end-offset<16)throw Error('Truncated M4A box');size=Number(bytes.readBigUInt64BE(offset+8));header=16;}
  if(size===0)size=end-offset;
  if(!Number.isSafeInteger(size)||size<header||size>end-offset)throw Error('Invalid M4A box size');
  result.push({type:bytes.toString('ascii',offset+4,offset+8),start:offset+header,end:offset+size});
  offset+=size;
 }
 return result;
}
export function inspectM4a(bytes){
 if(!Buffer.isBuffer(bytes)||bytes.length<1000||bytes.length>100*1024*1024)throw Error('Expected a nonempty M4A recording');
 const top=boxes(bytes),ftyp=top.find(b=>b.type==='ftyp'),moov=top.find(b=>b.type==='moov');
 if(!ftyp||ftyp.end-ftyp.start<8||!moov||!top.some(b=>b.type==='mdat'&&b.end>b.start))throw Error('Expected an M4A container with audio data');
 const children=box=>boxes(bytes,box.start,box.end),movie=children(moov),mvhd=movie.find(b=>b.type==='mvhd');
 if(!mvhd||mvhd.end-mvhd.start<20)throw Error('M4A duration is missing');
 const version=bytes[mvhd.start];
 if(version>1||(version===1&&mvhd.end-mvhd.start<32))throw Error('Invalid M4A duration');
 const scale=bytes.readUInt32BE(mvhd.start+(version===1?20:12));
 const ticks=version===1?Number(bytes.readBigUInt64BE(mvhd.start+24)):bytes.readUInt32BE(mvhd.start+16);
 const duration=ticks/scale;
 if(!Number.isFinite(duration)||duration<5||duration>7200)throw Error('M4A duration is out of bounds');
 const audio=movie.filter(b=>b.type==='trak').some(trak=>{
  const mdia=children(trak).find(b=>b.type==='mdia');if(!mdia)return false;
  const media=children(mdia),handler=media.find(b=>b.type==='hdlr'),minf=media.find(b=>b.type==='minf');
  if(!handler||handler.end-handler.start<12||bytes.toString('ascii',handler.start+8,handler.start+12)!=='soun'||!minf)return false;
  const stbl=children(minf).find(b=>b.type==='stbl');if(!stbl)return false;
  const stsd=children(stbl).find(b=>b.type==='stsd');
  return !!stsd&&stsd.end-stsd.start>=8&&boxes(bytes,stsd.start+8,stsd.end).some(b=>b.type==='mp4a');
 });
 if(!audio)throw Error('Expected an AAC audio track in the M4A');
 return {duration};
}
export async function verifyCachedAudio(root,brief,manifest){
 const entry=audioEntry(brief,manifest);
 if(!entry)throw Error('matching modern engine/content metadata is missing');
 const bytes=await readRegular(new URL(entry.src,root));
 if(bytes.length!==entry.bytes||checksum(bytes)!==entry.sha256)throw Error('recording checksum or byte count does not match');
 const transcript=await readRegular(new URL(entry.src+'.txt',root),1_000_000);
 if(transcript.toString('utf8')!==narration(brief)+'\n'||checksum(transcript)!==entry.transcriptSha256)throw Error('reviewed transcript does not match');
 if(Math.abs(inspectM4a(bytes).duration-entry.duration)>.1)throw Error('recording duration does not match');
 return entry;
}
