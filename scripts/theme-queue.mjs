import {readFile} from 'node:fs/promises';
import {themeQueue} from './theme-lifecycle.mjs';
const feed=JSON.parse(await readFile(new URL('../news.json',import.meta.url),'utf8'));
console.log(JSON.stringify(themeQueue(feed),null,2));
