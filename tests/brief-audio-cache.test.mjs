import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm,stat,symlink,readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {briefs} from '../scripts/theme-current.mjs';
import {AUDIO_VERSION,AUDIO_MODEL,AUDIO_VOICE,narration,audioHash,audioEntry,transcriptHash} from '../scripts/brief-audio.mjs';
import {buildBriefAudio} from '../scripts/build-brief-audio.mjs';
import {planBriefAudio,importBriefAudio} from '../scripts/manage-brief-audio.mjs';
import {checksum,inspectM4a,verifyCachedAudio} from '../scripts/brief-audio-cache.mjs';
import {renderThemes} from '../scripts/theme-pages.mjs';

// Minimal metadata fixture, not playable speech and never written to public assets.
function box(type,...parts){const payload=Buffer.concat(parts),header=Buffer.alloc(8);header.writeUInt32BE(payload.length+8);header.write(type,4);return Buffer.concat([header,payload]);}
function m4a({duration=120,codec='mp4a'}={}){
 const mvhd=Buffer.alloc(100);mvhd.writeUInt32BE(1000,12);mvhd.writeUInt32BE(duration*1000,16);
 const handler=Buffer.alloc(12);handler.write('soun',8);
 const sample=Buffer.alloc(8);sample.writeUInt32BE(1,4);
 const stbl=box('stbl',box('stsd',sample,box(codec,Buffer.alloc(28))));
 const track=box('trak',box('mdia',box('hdlr',handler),box('minf',stbl)));
 return Buffer.concat([box('ftyp',Buffer.from('M4A \0\0\0\0isom')),box('moov',box('mvhd',mvhd),track),box('mdat',Buffer.alloc(1400,0x5a))]);
}
async function fixture(t){
 const dir=await mkdtemp(join(tmpdir(),'brief-audio-cache-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 const root=pathToFileURL(dir+'/'),briefings=briefs.slice(0,2),bytes=m4a();
 const file=join(dir,'recording.m4a'),receiptPath=join(dir,'receipt.json');await writeFile(file,bytes);
 function receipt(b=briefings[0]){return {id:b.id,engine:AUDIO_VERSION,model:AUDIO_MODEL,voice:AUDIO_VOICE,hash:audioHash(b),transcriptSha256:transcriptHash(b),bytes:bytes.length,sha256:checksum(bytes),duration:120,privateBrokerToken:'must-not-copy'};}
 async function imported(b=briefings[0],r=receipt(b)){await writeFile(receiptPath,JSON.stringify(r));return importBriefAudio(b.id,file,receiptPath,{root,briefings});}
 return {dir,root,briefings,bytes,file,receiptPath,receipt,imported};
}

test('voice replacement preserves every reviewed transcript exactly and changes the engine/content key',async()=>{
 const root=new URL('../',import.meta.url),manifest=JSON.parse(await readFile(new URL('audio/briefs/manifest.json',root)));
 assert.equal(briefs.length,11);assert.equal(AUDIO_VERSION,'eleven-v4-rachel-v1');
 for(const b of briefs){
  const previous=manifest.briefs[b.id];
  assert.equal(await readFile(new URL(previous.src+'.txt',root),'utf8'),narration(b)+'\n',b.id);
  const legacyHash=checksum(Buffer.from('macos-samantha-175-v1\n'+narration(b)));
  assert.notEqual(audioHash(b),legacyHash);
  assert.equal(audioEntry(b,{version:1,engine:'macos-samantha-175-v1',briefs:{[b.id]:previous}}),null);
 }
});

test('plan exports exact public text and only requests missing or stale cache entries',async t=>{
 const f=await fixture(t),output=join(f.dir,'plan');
 let plan=await planBriefAudio(output,{root:f.root,briefings:f.briefings});
 assert.equal(plan.engine,AUDIO_VERSION);assert.equal(plan.model,AUDIO_MODEL);assert.equal(plan.voice,AUDIO_VOICE);
 assert.deepEqual(plan.briefs.map(b=>b.needsRender),[true,true]);
 for(const [i,p] of plan.briefs.entries()){
  assert.equal(await readFile(join(output,p.transcript),'utf8'),narration(f.briefings[i])+'\n');
  assert.equal(checksum(await readFile(join(output,p.transcript))),p.transcriptSha256);
  assert.equal(p.hash,audioHash(f.briefings[i]));assert.match(p.output,/^[a-z-]+-[a-f0-9]{16}\.m4a$/);
 }
 await f.imported();plan=await planBriefAudio(output,{root:f.root,briefings:f.briefings});
 assert.deepEqual(plan.briefs.map(b=>b.needsRender),[false,true]);
 const changed=structuredClone(f.briefings);changed[0].summary+=' New reviewed evidence.';
 plan=await planBriefAudio(output,{root:f.root,briefings:changed});assert.equal(plan.briefs[0].needsRender,true);
});

test('ordinary builds fail clearly with every missing ID, never create audio, and allow complete verified imports',async t=>{
 const f=await fixture(t),options={root:f.root,briefings:f.briefings};
 await assert.rejects(buildBriefAudio(options),error=>f.briefings.every(b=>error.message.includes(b.id))&&/never generate audio or fall back to Samantha/.test(error.message));
 await assert.rejects(stat(new URL('audio/',f.root)),{code:'ENOENT'});
 await f.imported();await assert.rejects(buildBriefAudio(options),new RegExp(f.briefings[1].id));
 await f.imported(f.briefings[1]);
 const manifest=await buildBriefAudio(options);assert.equal(manifest.engine,AUDIO_VERSION);assert.equal(Object.keys(manifest.briefs).length,2);
 const path=new URL('audio/briefs/manifest.json',f.root),before=await stat(path),serialized=await readFile(path,'utf8');
 await buildBriefAudio(options);await f.imported();
 assert.equal((await stat(path)).mtimeMs,before.mtimeMs);assert.equal(await readFile(path,'utf8'),serialized);
 assert.doesNotMatch(serialized,/privateBrokerToken|must-not-copy|recording\.m4a/);
 assert.equal((await readdir(new URL('audio/briefs/',f.root))).filter(n=>n.endsWith('.tmp')).length,0);
});

test('import refuses wrong engine, voice, copy, checksum, bytes and duration without touching an existing manifest',async t=>{
 const f=await fixture(t);await f.imported();
 const path=new URL('audio/briefs/manifest.json',f.root),before=await readFile(path,'utf8');
 for(const [key,value] of [['engine','macos-samantha-175-v1'],['voice','another-voice'],['model','another-model'],['id','wrong-brief'],['hash','0'.repeat(64)],['transcriptSha256','0'.repeat(64)],['bytes',1],['sha256','0'.repeat(64)],['duration',999]]){
  await assert.rejects(f.imported(f.briefings[0],{...f.receipt(),[key]:value}));
  assert.equal(await readFile(path,'utf8'),before,key);
 }
 const changed=structuredClone(f.briefings);changed[0].watch+=' Changed.';
 await writeFile(f.receiptPath,JSON.stringify(f.receipt()));
 await assert.rejects(importBriefAudio(changed[0].id,f.file,f.receiptPath,{root:f.root,briefings:changed}),/current reviewed transcript/);
 await assert.rejects(importBriefAudio('../outside',f.file,f.receiptPath,{root:f.root,briefings:f.briefings}),/Unknown briefing ID/);
});

test('cache verification detects corruption, transcript drift, unsafe paths and symlinks',async t=>{
 const f=await fixture(t),entry=await f.imported(),manifest=JSON.parse(await readFile(new URL('audio/briefs/manifest.json',f.root)));
 await writeFile(new URL(entry.src,f.root),Buffer.alloc(f.bytes.length));
 await assert.rejects(verifyCachedAudio(f.root,f.briefings[0],manifest),/checksum/);
 await f.imported();await writeFile(new URL(entry.src+'.txt',f.root),'Changed transcript');
 await assert.rejects(verifyCachedAudio(f.root,f.briefings[0],manifest),/transcript/);
 await f.imported();await rm(new URL(entry.src,f.root));await symlink(f.file,new URL(entry.src,f.root));
 await assert.rejects(verifyCachedAudio(f.root,f.briefings[0],manifest));
 const unsafe=structuredClone(manifest);unsafe.briefs[f.briefings[0].id].src='../../recording.m4a';
 assert.equal(audioEntry(f.briefings[0],unsafe),null);
});

test('M4A inspector rejects truncated containers, non-AAC codecs and invalid duration',()=>{
 assert.equal(inspectM4a(m4a()).duration,120);
 for(const bytes of [Buffer.alloc(1500),m4a().subarray(0,1000),m4a({duration:0}),m4a({codec:'mp4v'})])assert.throws(()=>inspectM4a(bytes));
});

test('modern metadata preserves transcript, native player and resume keys; legacy manifest cannot attach audio',async t=>{
 const f=await fixture(t);await f.imported();const manifest=await buildBriefAudio({root:f.root,briefings:[f.briefings[0]]});
 const root=new URL('../',import.meta.url),home=await readFile(new URL('index.html',root),'utf8'),feed=JSON.parse(await readFile(new URL('news.json',root)));
 const html=renderThemes(home,feed,{audioManifest:manifest}),entry=manifest.briefs[f.briefings[0].id];
 assert.ok(html.includes(`data-audio-hash="${entry.hash}"`));assert.ok(html.includes(`src="${entry.src}"`));
 assert.match(html,/<audio controls preload="none"/);assert.match(html,/Read the narration transcript/);assert.match(html,/data-resume/);assert.doesNotMatch(html,/autoplay/);
 assert.doesNotMatch(renderThemes(home,feed,{audioManifest:{...manifest,engine:'macos-samantha-175-v1'}}),/<audio/);
});
