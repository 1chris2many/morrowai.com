import {readFileSync} from 'node:fs';
export const oct30Revision=JSON.parse(readFileSync(new URL('./theme-oct30-fixture.json',import.meta.url)));
export function beforeOct30(value){const c=value&&oct30Revision.changes[value.id];return c&&JSON.stringify(value)===JSON.stringify(c.after)?c.before:value;}
export const oct29Revision=JSON.parse(readFileSync(new URL('./theme-oct29-fixture.json',import.meta.url)));
export function beforeOct29(value){
 value=beforeOct30(value);
 const change=value&&oct29Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct28Revision=JSON.parse(readFileSync(new URL('./theme-oct28-fixture.json',import.meta.url)));
export function beforeOct28(value){
 value=beforeOct29(value);
 const change=value&&oct28Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct27Revision=JSON.parse(readFileSync(new URL('./theme-oct27-fixture.json',import.meta.url)));
export function beforeOct27(value){
 value=beforeOct28(value);
 const change=value&&oct27Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct26Revision=JSON.parse(readFileSync(new URL('./theme-oct26-fixture.json',import.meta.url)));
export function beforeOct26(value){
 value=beforeOct27(value);
 const change=value&&oct26Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct25Revision=JSON.parse(readFileSync(new URL('./theme-oct25-fixture.json',import.meta.url)));
export function beforeOct25(value){
 value=beforeOct26(value);
 const change=value&&oct25Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct24Revision=JSON.parse(readFileSync(new URL('./theme-oct24-fixture.json',import.meta.url)));
export function beforeOct24(value){
 value=beforeOct25(value);
 const change=value&&oct24Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct23Revision=JSON.parse(readFileSync(new URL('./theme-oct23-fixture.json',import.meta.url)));
export function beforeOct23(value){
 value=beforeOct24(value);
 const change=value&&oct23Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct22Revision=JSON.parse(readFileSync(new URL('./theme-oct22-fixture.json',import.meta.url)));
export function beforeOct22(value){
 value=beforeOct23(value);
 const change=value&&oct22Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct21Revision=JSON.parse(readFileSync(new URL('./theme-oct21-fixture.json',import.meta.url)));
export function beforeOct21(value){
 value=beforeOct22(value);
 const change=value&&oct21Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const oct20Revision=JSON.parse(readFileSync(new URL('./theme-oct20-fixture.json',import.meta.url)));
// Undo only a byte-exact approved October20 replacement for older snapshots.
// Today's tests separately assert the full new content and every preserved event.
export function beforeOct20(value){
 value=beforeOct21(value);
 const change=value&&oct20Revision.changes[value.id];
 return change&&JSON.stringify(value)===JSON.stringify(change.after)?change.before:value;
}
export const insightRevision=JSON.parse(readFileSync(new URL('./theme-insight-fixture.json',import.meta.url)));
// Historical snapshots predate the owner-requested insight revision. Reverse only
// the exact reviewed editorial fields. Unexpected edits fail the old snapshots;
// IDs, dates, source developments, metrics and other fields are never normalized.
export function beforeInsightRevision(value){
 value=beforeOct20(value);
 const change=value&&insightRevision.changes[value.id];
 if(!change||!insightRevision.fields.every(k=>JSON.stringify(value[k])===JSON.stringify(change.after[k])))return value;
 return {...value,...change.before};
}
// Also reverse the earlier exact title-only revision for pre-rename snapshots.
export const themeNameChanges={
  "ai-market-leadership": {
    "before": "The cost of losing the default.",
    "after": "Competition between AI providers"
  },
  "ai-science": {
    "before": "AI research moves closer to the experiment.",
    "after": "AI in scientific research"
  },
  "ai-regulation": {
    "before": "A source check has several layers.",
    "after": "Checking AI sources"
  },
  "safety-vs-capability": {
    "before": "Agent safeguards need the whole task in view.",
    "after": "AI agent safety"
  },
  "workplace-agents": {
    "before": "AI work needs an inspectable result.",
    "after": "AI agents at work"
  },
  "ai-infrastructure": {
    "before": "Power, cooling and chips need to fit together.",
    "after": "Power and hardware for AI"
  },
  "evals": {
    "before": "Put the result to the test.",
    "after": "Testing AI performance"
  },
  "open-weights": {
    "before": "Running a model yourself takes more than weights.",
    "after": "Running AI models yourself"
  },
  "agent-economics": {
    "before": "The model bill depends on the job.",
    "after": "The cost of running AI"
  }
};
export function beforeThemeRename(value){
 value=beforeInsightRevision(value);
 const change=value&&themeNameChanges[value.id];
 return change&&value.title===change.after?{...value,title:change.before}:value;
}
