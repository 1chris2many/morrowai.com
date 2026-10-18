// Owner requested simpler public theme names on October 18.
// Normalize ONLY those exact approved renames for earlier content-preservation snapshots.
// Unexpected title edits still fail; current names are asserted in theme-names.test.mjs.
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
 const change=value&&themeNameChanges[value.id];
 return change&&value.title===change.after?{...value,title:change.before}:value;
}
