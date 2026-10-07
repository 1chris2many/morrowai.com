// Source pages personally read by Codex on 2026-10-06. Source/event dates,
// not ingest dates. Feed ingestion cannot approve or refresh this analysis.
export const briefs = [
 {
  id:'ai-regulation', label:'AI governance', title:'The rules are reaching the product.',
  reviewedAt:'2026-10-06',author:'Codex',accent:'gold',
  teaser:'Text watermarks and government purchasing controls show how oversight is changing the products people actually use.',
  summary:'AI oversight is becoming visible in product settings. OpenAI is introducing text watermarking in response to EU rules. Anthropic’s government offering gives agencies spending caps, access controls and audit records. These are concrete choices about how AI can be bought, used and checked.',
  meaning:'The next test is whether these controls help people make better decisions. A watermark can offer a clue about a text’s origin, but editing can weaken it. Agency administrators need useful records and enforceable limits as adoption spreads across departments. Buyers should ask what a control establishes and how it behaves when it fails.',
  watch:'Watch the EU rollout, independent testing of text detection, and how agencies use their new administrative controls.',
  visualTitle:'Oversight becomes a product feature',
  visual:[['Identify','Signals about generated text'],['Limit','Spending and model access'],['Account','Records of administrative actions']],
  developments:[
   {date:'2026-10-05',id:926,title:'OpenAI sets out its watermark rollout',text:'Eligible ChatGPT and Codex text in the EU will gain watermarks over the coming weeks. Selected API models offer an opt-in globally; detector access starts with approved researchers and organizations.',source:'OpenAI',url:'https://openai.com/index/eu-text-provenance/'},
   {date:'2026-09-30',id:915,title:'Claude for Government leaves beta',text:'Anthropic made its FedRAMP High offering generally available, with departmental spending caps, model limits and audit logs. Claude Code CLI and Microsoft 365 support remain in early access.',source:'Anthropic',url:'https://claude.com/blog/claude-for-government-is-now-generally-available'}
  ]
 },
 {
  id:'safety-vs-capability',label:'Agent safety',title:'Access is becoming a safety decision.',
  reviewedAt:'2026-10-06',author:'Codex',accent:'mint',
  teaser:'A restricted model rollout and a disclosed extraction campaign put access controls at the center of frontier AI safety.',
  summary:'Google is starting Gemini 4 Argon with trusted cyber defenders while preparing a wider release. OpenAI has disclosed a campaign to extract protected model reasoning. Together, these developments highlight the difficulty of giving useful capabilities to legitimate users while containing misuse.',
  meaning:'Access decisions now carry more of the safety burden. A limited release gives a lab time to observe use and improve safeguards. Once a model is available through multiple services, defenses must cover those routes too. Our reading: customers should look for evidence of incident detection and response alongside launch evaluations.',
  watch:'Watch what changes before Argon’s wider release and whether protections against reasoning extraction extend consistently to partner-hosted services.',
  visualTitle:'Controls across the release cycle',
  visual:[['Before release','Select early users'],['During use','Detect suspicious activity'],['After an incident','Close paths across providers']],
  developments:[
   {date:'2026-09-30',id:896,title:'Google starts Argon with trusted defenders',text:'Google announced a phased rollout through its Fairwind program, with broader availability planned after further safeguards work and feedback from early testers.',source:'Google',url:'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/'},
   {date:'2026-09-30',id:909,relation:'The response to extraction connects access controls and cross-provider safety defenses.',title:'OpenAI reports a reasoning-extraction campaign',text:'OpenAI disclosed July activity and described account restrictions, technical fixes and partner coordination. Its reported request counts represent attempts, not confirmed successful extractions.',source:'OpenAI',url:'https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign/'}
  ]
 },
 {
  id:'workplace-agents',label:'Agents at work',title:'Agents are moving into the workflow.',
  reviewedAt:'2026-10-06',author:'Codex',accent:'lilac',
  teaser:'Event-triggered tasks, customizable coding tools and a bank-wide rollout show how agents are becoming part of everyday operations.',
  summary:'Manus can now start work when something happens in a connected service. Claude Code lets developers change tool behavior through mods. Barclays is expanding Claude across its operations. The common direction is toward AI woven into recurring work, with more decisions made before a task begins.',
  meaning:'Our reading: the setup around an agent increasingly determines its usefulness. Triggers decide when work starts; extensions shape what it can do; organizational rules determine who checks the result. Teams should measure completed work, corrections and cost together. A busy agent or a large rollout alone says little about the quality of the outcome.',
  watch:'Watch whether automated workflows finish reliably, how teams review powerful extensions, and whether enterprise rollouts publish results beyond adoption counts.',
  visualTitle:'From a request to recurring work',
  visual:[['Trigger','Events can start a task'],['Customize','Tools fit the workflow'],['Operate','Teams deploy at scale']],
  developments:[
   {date:'2026-10-01',id:910,title:'Barclays expands its use of Claude',text:'Anthropic reports that more than 16,000 Barclays colleagues use its knowledge assistant. The bank expects Claude Code adoption to reach half its developers by year-end.',source:'Anthropic',url:'https://www.anthropic.com/news/barclays-scales-claude'},
   {date:'2026-10-01',id:918,title:'Claude Code adds programmable mods',text:'Mods can change prompts, tool calls and the interface. They run with Claude Code’s access to the computer and are not sandboxed.',source:'Anthropic',url:'https://claude.com/blog/claude-code-mods'},
   {date:'2026-09-28',id:929,title:'Manus introduces event-triggered automation',text:'Manus 2.0 adds workflows triggered by changes in connected services and a desktop workspace for editing the resulting work.',source:'Manus',url:'https://manus.im/en/blog/introducing-manus-2-0'}
  ]
 },
 {
  id:'ai-infrastructure',label:'AI infrastructure',title:'The buildout meets its neighbors.',
  reviewedAt:'2026-10-06',author:'Codex',accent:'blue',
  teaser:'New computing capacity is reaching customers while communities press for a say in the costs of expansion.',
  summary:'CoreWeave is bringing NVIDIA’s newest systems into production. In Washington, organizers have called for a pause on new data centers until rules address their costs to residents and the environment. These stories expose two pressures shaping the buildout: delivering capacity and securing local support.',
  meaning:'Our reading: the pace of AI infrastructure will depend on decisions well beyond chip performance. Providers need sites, services and permission to expand. Communities want a clearer account of who benefits and who bears the costs. Local decisions could become an important constraint on where the next wave of capacity appears.',
  watch:'Watch actual capacity delivered, local permitting decisions and concrete proposals for allocating infrastructure costs.',
  visualTitle:'Three questions behind the buildout',
  visual:[['Capacity','What is running today?'],['Location','Where can it expand?'],['Costs','Who pays for the growth?']],
  developments:[
   {date:'2026-10-04',id:924,title:'Washington organizers call for a pause',text:'KIRO reported plans for more than 20 events calling for a construction moratorium while cost and environmental rules are developed. Its report describes planned events, not verified turnout.',source:'KIRO 7',url:'https://www.kiro7.com/news/local/anti-data-center-events-planned-across-washington-sunday/CHTOEWIWWRF4DCXQ2KUY5WWUMQ/'},
   {date:'2026-09-30',id:912,title:'CoreWeave introduces Vera Rubin capacity',text:'NVIDIA says Cognition is running production workloads on CoreWeave’s new systems, with early access available to other customers.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/coreweave-agentic-ai-vera-rubin/'}
  ]
 }
];
