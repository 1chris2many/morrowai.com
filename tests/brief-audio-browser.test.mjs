import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {briefs} from '../scripts/theme-current.mjs';
let server,browser,base;
before(async()=>{
 server=createServer(async(req,res)=>{try{
  const path=new URL(req.url,'http://localhost').pathname.slice(1)||'themes.html';
  if(!/^(?:themes\.html|(?:js|css)\/[\w.-]+|audio\/briefs\/[\w.-]+)$/.test(path))return res.writeHead(404).end();
  const data=await readFile(new URL('../'+path,import.meta.url));
  res.setHeader('Content-Type',({html:'text/html',js:'text/javascript',css:'text/css',m4a:'audio/mp4',json:'application/json',txt:'text/plain'})[path.split('.').at(-1)]);
  res.setHeader('Accept-Ranges','bytes');
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=Math.min(range[2]?Number(range[2]):data.length-1,data.length-1);res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});return res.end(data.subarray(start,end+1));}
  res.setHeader('Content-Length',data.length);res.end(data);
 }catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({channel:'chrome',chromiumSandbox:true});await mkdir(new URL('../test-results/',import.meta.url),{recursive:true});
});
after(async()=>{await browser?.close();server?.closeAllConnections();await new Promise(resolve=>server?.close(resolve));});
test('real audio decodes and plays every briefing, speed/resume persist, only one plays',{timeout:45000},async()=>{
 const context=await browser.newContext({viewport:{width:390,height:844}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/themes.html');
 assert.equal(await page.locator('audio').count(),briefs.length);
 for(let i=0;i<briefs.length;i++){
  const box=page.locator('[data-brief-audio]').nth(i);
  await box.locator('[data-restart]').click();
  await page.waitForFunction(i=>{const a=document.querySelectorAll('audio')[i];return a.currentTime>0&&a.duration>60&&!a.error;},i);
  assert.equal(await page.locator('audio').evaluateAll(as=>as.filter(a=>!a.paused).length),1);
 }
 const first=page.locator('[data-brief-audio]').first();
 const firstId=await first.getAttribute('data-brief-audio');
 assert.ok(briefs.some(brief=>brief.id===firstId));
 await first.locator('[data-restart]').click();
 await first.locator('select').selectOption('1.5');
 await first.locator('audio').evaluate(async a=>{await new Promise(resolve=>{a.addEventListener('seeked',resolve,{once:true});a.currentTime=45;});a.pause();});
 await page.waitForFunction(id=>Object.entries(localStorage).some(([k,v])=>k.startsWith(`brief-audio:${id}:`)&&JSON.parse(v).time>=45),firstId);
 await page.reload();
 await first.locator('[data-resume]').waitFor({state:'visible'});
 assert.match(await first.locator('[data-resume]').textContent(),/0:45/);
 assert.equal(await first.locator('select').inputValue(),'1.5');
 // Changing speed before loading audio must not destroy the saved position.
 await first.locator('select').selectOption('1.25');await page.reload();
 assert.match(await first.locator('[data-resume]').textContent(),/0:45/);
 await first.locator('[data-resume]').click();
 await page.waitForFunction(()=>document.querySelector('audio').currentTime>=45);
 assert.equal(await first.locator('audio').evaluate(a=>a.playbackRate),1.25);
 await first.locator('[data-restart]').click();assert.ok(await first.locator('audio').evaluate(a=>a.currentTime<5));
 await first.locator('audio').evaluate(a=>a.pause());
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  await page.locator('#workplace-agents .brief-listen').scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:`test-results/audio-brief-${width}.png`});
 }
 assert.deepEqual(errors,[]);await context.close();
});
test('October22 safety and operating-cost updates are readable at phone and desktop widths',async()=>{
 const ctx=await browser.newContext(),page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/themes.html');
 for(const width of [390,1440])for(const id of ['safety-vs-capability','agent-economics']){
  await page.setViewportSize({width,height:1000});
  const section=page.locator('#'+id);await section.scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await section.locator('audio').count(),1);
  await section.screenshot({path:`test-results/oct22-${id}-${width}.png`});
 }
 assert.equal(await page.locator('#safety-vs-capability-source-1009 a').count(),2);
 assert.equal(await page.locator('#agent-economics-source-1006 a').count(),2);
 assert.deepEqual(errors,[]);await ctx.close();
});
test('October23 updated briefings and primary links remain usable on phone and desktop',async()=>{
 const ctx=await browser.newContext(),page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/themes.html');
 for(const width of [390,1440])for(const id of ['ai-market-leadership','workplace-agents','evals']){
  await page.setViewportSize({width,height:1000});
  const section=page.locator('#'+id);await section.locator('h2').scrollIntoViewIfNeeded();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await section.locator('audio').count(),1);
  assert.equal(await section.locator('header time').getAttribute('datetime'),'2026-10-23');
  await page.screenshot({path:`test-results/oct23-${id}-${width}.png`});
 }
 assert.equal(await page.locator('#workplace-agents-source-1010 a').count(),2);
 assert.equal(await page.locator('#evals-source-1012 a').count(),2);
 assert.match(await page.locator('#ai-market-leadership-source-974').textContent(),/Claude remains available/);
 assert.deepEqual(errors,[]);await ctx.close();
});
test('audio errors and disabled storage retain a readable usable page',async()=>{
 const ctx=await browser.newContext(),p=await ctx.newPage(),errors=[];
 await ctx.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('disabled');};Storage.prototype.setItem=()=>{throw Error('disabled');};});
 await ctx.route('**/*.m4a',route=>route.abort());p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'/themes.html');const box=p.locator('[data-brief-audio]').first();await box.locator('[data-restart]').click();
 await p.waitForFunction(()=>document.querySelector('.audio-status').textContent.includes('transcript'));
 await box.locator('summary').click();assert.ok(await box.locator('.audio-transcript p').first().isVisible());assert.deepEqual(errors,[]);await ctx.close();
});
test('no JavaScript still exposes native controls and a complete transcript',async()=>{
 const ctx=await browser.newContext({javaScriptEnabled:false}),p=await ctx.newPage();await p.goto(base+'/themes.html');
 assert.equal(await p.locator('audio[controls]').count(),briefs.length);assert.equal(await p.locator('.audio-options:visible').count(),0);
 await p.locator('.audio-transcript summary').first().click();assert.ok(await p.locator('.audio-transcript p').first().isVisible());await ctx.close();
});
