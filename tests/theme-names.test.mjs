import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {themeNameChanges,beforeThemeRename,beforeInsightRevision,insightRevision,oct20Revision,beforeOct20,oct21Revision,oct25Revision,oct27Revision,oct28Revision} from './theme-name-history.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const themes=readFileSync(new URL('../themes.html',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
const currentTitles={
 ...Object.fromEntries(Object.entries(insightRevision.changes).map(([id,change])=>[id,change.after.title])),
 ...Object.fromEntries(Object.entries(oct20Revision.changes).map(([id,change])=>[id,change.after.title])),
 ...Object.fromEntries(oct20Revision.added.map(b=>[b.id,b.title])),
 ...Object.fromEntries(oct21Revision.added.map(b=>[b.id,b.title])),
 ...Object.fromEntries(Object.entries(oct25Revision.changes).map(([id,c])=>[id,c.after.title])),
 ...Object.fromEntries(Object.entries(oct27Revision.changes).map(([id,c])=>[id,c.after.title])),
 ...Object.fromEntries(Object.entries(oct28Revision.changes).map(([id,c])=>[id,c.after.title]))
};
test('all theme headings state the reviewed insight while preserving stable links',()=>{
 assert.equal(Object.keys(currentTitles).length,11);
 assert.deepEqual(briefs.map(b=>b.id).sort(),Object.keys(currentTitles).sort());
 for(const b of briefs){
  const expected=currentTitles[b.id];
  assert.equal(b.title,expected);
  assert.ok(themes.includes('id="'+b.id+'-title">'+expected+'</h2>'),b.id);
  assert.ok(themes.includes('id="'+b.id+'"'));
  if(home.includes('data-theme="'+b.id+'"'))assert.ok(home.includes('href="themes.html#'+b.id+'">'+expected+'</a>'),b.id);
  if(Object.hasOwn(themeNameChanges,b.id))assert.ok(!themes.includes(themeNameChanges[b.id].after),b.id);
  const prior=oct20Revision.changes[b.id]?.before.title;
  if(prior&&prior!==expected)assert.ok(!themes.includes('id="'+b.id+'-title">'+prior+'</h2>'),b.id);
 }
});
test('revised audio starts with the visible heading and cannot reuse earlier recordings',()=>{
 assert.deepEqual(briefs.map(b=>b.id).sort(),Object.keys(currentTitles).sort());
 for(const b of briefs){
  const entry=audioEntry(b,manifest);assert.ok(entry,b.id);
  const text=readFileSync(new URL('../'+entry.src+'.txt',import.meta.url),'utf8');
  assert.equal(text,narration(b)+'\n');
  assert.ok(text.startsWith(b.label+'. '+b.title));
  if(Object.hasOwn(themeNameChanges,b.id)){
   assert.equal(audioEntry(beforeThemeRename(b),manifest),null,b.id+':pre-rename');
   assert.equal(audioEntry(beforeInsightRevision(b),manifest),null,b.id+':pre-insight');
  }else{
   assert.ok(['robot-transfer','chip-switching'].includes(b.id));
   const stale=structuredClone(b);stale.summary+=' Unreviewed stale text.';
   assert.equal(audioEntry(stale,manifest),null,b.id+':stale-text');
  }
  if(Object.hasOwn(oct20Revision.changes,b.id))assert.equal(audioEntry(beforeOct20(b),manifest),null,b.id+':pre-October20');
 }
});
test('historical snapshot normalization cannot conceal other title or body edits',()=>{
 for(const id of Object.keys(themeNameChanges)){
  const b=briefs.find(b=>b.id===id),restored=beforeThemeRename(b);
  assert.equal(restored.title,themeNameChanges[id].before,id);
  assert.equal(restored.meaning,insightRevision.changes[id].before.meaning,id);
  const unexpected={...b,title:'Unexpected replacement'};
  assert.equal(beforeThemeRename(unexpected),unexpected,id);
  const changedBody={...b,meaning:b.meaning+' Unexpected edit.'};
  assert.equal(beforeInsightRevision(changedBody),changedBody,id);
  const changedEvidence={...b,reviewedAt:'2099-01-01'};
  assert.equal(beforeInsightRevision(changedEvidence).reviewedAt,'2099-01-01',id);
 }
 const robot=briefs.find(b=>b.id==='robot-transfer');
 assert.equal(beforeThemeRename(robot),robot);
});
