import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {briefs} from '../scripts/theme-current.mjs';
import {beforeThemeRename,beforeOct23} from './theme-name-history.mjs';
import {related,validateBriefs,briefingCards} from '../scripts/theme-pages.mjs';
import {audioEntry,narration} from '../scripts/brief-audio.mjs';
const feed=JSON.parse(readFileSync(new URL('../news.json',import.meta.url)));
const manifest=JSON.parse(readFileSync(new URL('../audio/briefs/manifest.json',import.meta.url)));
const b=briefs.find(b=>b.id==='ai-market-leadership');
const hash=x=>createHash('sha256').update(JSON.stringify(beforeThemeRename(x))).digest('hex');
test('historical competition release snapshots survive only the exact later editorial revisions',()=>{
 const prior={"ai-science":"cdd0110e195a2bd93525293c6da083e2463d2e1e096af1a6f972dc12d75a1330","ai-regulation":"569612be8f5b46cd953c8b16975242bfd92980dcdbdac60368bafac88d00928f","safety-vs-capability":"b0ec7f38a369aacdfa9de4a69c8b2ff4685192cc11a13d20373e976cbe2cad07","workplace-agents":"c23a50fe73f788983f12dc3a7b7e3905781146f5927e69e1c621ac23aa5ce668","ai-infrastructure":"40a392ab01ed7e02ead8568f1896851a53aefc897dcfc254f60a76a1fca7146a","evals":"115b28b5eac8e506dedf5333c805e2e6e26d38fdfc345883efeebb44f4e493c7","open-weights":"821ea467482d978dac9513cc0f05dfd06d4767f3128e09af8900c61663bb8fca","agent-economics":"3c75555dfa2603c4825a5029f1d166bae233aa2b155f453de81d0a2ed80a828f"};
 const audio={"ai-science":{"hash":"e8226b9d4fb06b065d9a8d80c686fe0540b6a3ec36332e9f5c7af56f7f9e68cc","src":"audio/briefs/ai-science-e8226b9d4fb06b06.m4a","duration":150.972653,"bytes":648340,"sha256":"c05c5a18ded7eb3816463dac651038913a1c8acc9e7360dc58d62ec2cc94fc85"},"ai-regulation":{"hash":"0f2bf88978249ef13a3820afda14c285b6dfbbc14c1e17556a2899ae9a679d89","src":"audio/briefs/ai-regulation-0f2bf88978249ef1.m4a","duration":143.089478,"bytes":615437,"sha256":"88fc4ce37faf30513a005b209e6c81259460dad3944a57b2af248d1664cfcaed"},"safety-vs-capability":{"hash":"f09fb1e44350bae954ae6595f27b776e53cdaaf5e1db59fbf0f41e152de3fb20","src":"audio/briefs/safety-vs-capability-f09fb1e44350bae9.m4a","duration":247.64898,"bytes":1040608,"sha256":"fec14096576753b2f26b6b1d36e5d54448b71b2028fa48354cfaa715dba7072c"},"workplace-agents":{"hash":"56bfcbca97fa82ddaa7d7fcb3394ea746a0b83a0ff122f1c978e049fef436bf4","src":"audio/briefs/workplace-agents-56bfcbca97fa82dd.m4a","duration":326.225306,"bytes":1361628,"sha256":"01074d0ed1267fe3b270763536ff40de72fcd33df61526722f8023040fa187fd"},"ai-infrastructure":{"hash":"730c974b0238a20297f25186b18b982eee634be497694d0be657c30acb5453c7","src":"audio/briefs/ai-infrastructure-730c974b0238a202.m4a","duration":219.784989,"bytes":926677,"sha256":"b51f2041de0a6dca26863cf9f2e52147c9af371355feda3d5b80aa1758a783b4"},"evals":{"hash":"aaecba59a43bd196f07d327abd383b13c4f5f521f6d7c4a154bfec692010f7ed","src":"audio/briefs/evals-aaecba59a43bd196.m4a","duration":209.428889,"bytes":885686,"sha256":"c6e9dc2519e7ba43bedc902e098741d1a3d04c5cfc11f5974a15552a85ca3265"},"open-weights":{"hash":"7e93836c6b5c7197f376a13058690b0e51a9dfc5e09c729b3029c283552b9821","src":"audio/briefs/open-weights-7e93836c6b5c7197.m4a","duration":268.636553,"bytes":1126143,"sha256":"dd00413e8461c1125ea4e28d0417943226d985fef7895ff5310dc3c861ce79cd"},"agent-economics":{"hash":"87da5d8a88342e70d8459936b41239501778786811f370a338810dba147651de","src":"audio/briefs/agent-economics-87da5d8a88342e70.m4a","duration":175.214286,"bytes":747208,"sha256":"bae76ce80bb9e0d4fc53115eb8516187117b43d88938b7e1d1551c54042140f9"}};
 assert.equal(briefs.length,11);
 for(const [id,h]of Object.entries(prior)){
  assert.equal(hash(briefs.find(b=>b.id===id)),h,id);
  assert.deepEqual(audioEntry(beforeThemeRename(briefs.find(b=>b.id===id)),{version:1,briefs:audio}),audio[id],id);
 }
});
test('competition thesis distinguishes retained accounts from lost work without claiming causation',()=>{
 const b=beforeOct23(briefs.find(b=>b.id==='ai-market-leadership'));
 assert.equal(b.reviewedAt,'2026-10-18');
 assert.match(b.summary,/Our hypothesis/);
 assert.match(b.summary,/do not identify why customers moved/);
 assert.match(b.meaning,/account retention and workload retention/);
 assert.match(b.meaning,/metered consumption/);
 assert.match(b.meaning,/credits and contractual commitments/);
 assert.match(b.meaning,/same work is moving to a rival/);
 assert.match(b.meaning,/valuations/);
 assert.match(b.watch,/do not establish a decline in Anthropic’s total revenue/);
 assert.doesNotMatch(JSON.stringify(b),/cost per accepted|human correction time|industry.wide regression/i);
});
test('market-share number identifies the sample, period and denominator',()=>{
 assert.equal(b.metric.value,'54.1% → 52.2%');
 assert.equal(b.metric.sourceId,986);
 for(const re of [/Q2 to Q3 2026/,/Capital on Tap business cardholders/,/12.8% to 14.5%/,/exclude invoiced contracts/,/not companywide revenue/])assert.match(b.metric.context,re);
 const billing=b.developments.find(d=>d.id===988);
 assert.match(billing.text,/terms checked October 18/);
 assert.match(billing.text,/Legacy arrangements transition at renewal/);
 assert.equal(b.developments.find(d=>d.id===985).date,'2026-10-06');
});
test('six exact reviewed sources connect the theme to stable news anchors',()=>{
 validateBriefs(feed);
 const ids=[974,985,986,987,988,1014];
 assert.deepEqual(new Set(related(feed,b.id).map(i=>i.digestItemId)),new Set(ids));
 assert.match(briefingCards(feed),/themes.html#ai-market-leadership/);
 for(const id of ids){
  const item=feed.items.find(i=>i.digestItemId===id);assert.ok(item.anchor);
  const next=structuredClone(feed);next.items=next.items.filter(i=>i.digestItemId!==id);
  assert.throws(()=>validateBriefs(next),new RegExp('source '+id));
 }
});
test('corrected historical cards preserve anchors and distinguish accounting from revenue loss',()=>{
 const replit=feed.items.find(i=>i.digestItemId===974);
 assert.equal(replit.summary,'OpenAI is now the default; customers can still choose Claude.');
 assert.equal(replit.digestDate,'2026-10-17');
 const revenue=feed.items.find(i=>i.digestItemId===892);
 assert.equal(revenue.title,'OpenAI revenue accounting clarified');
 assert.match(revenue.summary,/partner-sales accounting/);
 assert.equal(revenue.url,'https://techcrunch.com/2026/10/08/openais-revenue-is-reportedly-20-billion-less-than-previously-projected/');
 assert.equal(revenue.digestDate,'2026-09-30');
 assert.ok(revenue.anchor.startsWith('story-2026-09-30-'));
});
test('new narration is tied to exact reviewed copy and a checked audio file',()=>{
 const entry=audioEntry(b,manifest);assert.ok(entry);
 const bytes=readFileSync(new URL('../'+entry.src,import.meta.url));
 assert.equal(bytes.length,entry.bytes);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);
 assert.equal(readFileSync(new URL('../'+entry.src+'.txt',import.meta.url),'utf8'),narration(b)+'\n');
 assert.equal(audioEntry({...b,meaning:b.meaning+' changed'},manifest),null);
});
