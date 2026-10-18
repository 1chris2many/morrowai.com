import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {briefs} from '../scripts/theme-current.mjs';
import {themeNameChanges,beforeThemeRename} from './theme-name-history.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const themes=readFileSync(new URL('../themes.html',import.meta.url),'utf8');
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
test('all theme headings use the approved direct topic names and stable links',()=>{
 assert.deepEqual(briefs.map(b=>b.id).sort(),Object.keys(themeNameChanges).sort());
 for(const b of briefs){
  const change=themeNameChanges[b.id];
  assert.equal(b.title,change.after);
  assert.ok(themes.includes('id="'+b.id+'-title">'+change.after+'</h2>'));
  assert.ok(themes.includes('id="'+b.id+'"'));
  if(home.includes('data-theme="'+b.id+'"'))assert.ok(home.includes('href="themes.html#'+b.id+'">'+change.after+'</a>'));
  assert.ok(!themes.includes(change.before),b.id);
 }
});
test('renamed audio starts with the visible heading and cannot reuse old-title recordings',()=>{
 for(const b of briefs){
  const entry=audioEntry(b,manifest);assert.ok(entry,b.id);
  const text=readFileSync(new URL('../'+entry.src+'.txt',import.meta.url),'utf8');
  assert.equal(text,narration(b)+'\n');
  assert.ok(text.startsWith(b.label+'. '+b.title));
  assert.equal(audioEntry(beforeThemeRename(b),manifest),null,b.id);
 }
});
test('historical snapshot normalization cannot conceal other title or body edits',()=>{
 const b=briefs[0],restored=beforeThemeRename(b);
 assert.equal(restored.title,themeNameChanges[b.id].before);
 assert.equal(restored.meaning,b.meaning);
 const unexpected={...b,title:'Unexpected replacement'};
 assert.equal(beforeThemeRename(unexpected),unexpected);
});
