// Source pages personally read by Codex; review dates belong to each briefing. Source/event dates,
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
  reviewedAt:'2026-10-08',author:'Codex',accent:'mint',
  teaser:'Cybersecurity access is becoming tiered, with permissions tied to the work an organization is authorized to do.',
  summary:'Anthropic now offers three verified cybersecurity access tiers, from defense to specialized testing of sensitive systems. Google’s phased Argon rollout and OpenAI’s response to a reasoning-extraction campaign show other ways labs are controlling access as capabilities spread.',
  meaning:'For a security team, access approval is becoming part of deployment. The tier determines which work is allowed, while verification and data-handling requirements affect how the tool fits into existing systems. Buyers should check those terms alongside model performance, then ask how misuse is detected and how incidents are handled across service providers.',
  watch:'Watch how quickly legitimate teams gain access, which tasks still encounter blocks, and whether incident responses work across partner-hosted services.',
  visualTitle:'Controls across the release cycle',
  visual:[['Before release','Select early users'],['During use','Detect suspicious activity'],['After an incident','Close paths across providers']],
  developments:[
   {date:'2026-10-06',id:939,title:'Anthropic introduces three cyber access tiers',text:'Defense, Red Team and Specialized Access have different verification requirements and controls. Adversarial testing requires authorization; the highest-access tier is limited to verified organizations testing sensitive systems.',source:'Anthropic',url:'https://www.anthropic.com/news/cyber-verification-program'},
   {date:'2026-09-30',id:896,title:'Google starts Argon with trusted defenders',text:'Google announced a phased rollout through its Fairwind program, with broader availability planned after further safeguards work and feedback from early testers.',source:'Google',url:'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/'},
   {date:'2026-09-30',id:909,relation:'The response to extraction connects access controls and cross-provider safety defenses.',title:'OpenAI reports a reasoning-extraction campaign',text:'OpenAI disclosed July activity and described account restrictions, technical fixes and partner coordination. Its reported request counts represent attempts, not confirmed successful extractions.',source:'OpenAI',url:'https://openai.com/index/disrupting-a-coordinated-model-distillation-campaign/'}
  ]
 },
 {
  id:'workplace-agents',label:'Agents at work',title:'Agents are moving into the workflow.',
  reviewedAt:'2026-10-07',author:'Codex',accent:'lilac',
  teaser:'Agents are getting closer to the systems where work happens. Legal-workflow tests show how much checking the results still need.',
  summary:'Atlassian is expanding its OpenAI partnership across its products and Rovo, while Manus and Claude Code give teams more ways to automate recurring work. Evidence of reliability is starting to catch up with rollout announcements: OpenAI and Ironclad have published tests of agents navigating legal workflows, with substantial room for improvement.',
  meaning:'An agent can handle several steps correctly and still leave a job unfinished. Ironclad’s tests score individual requirements within complex tasks; that makes the remaining gaps visible. Teams adopting these tools need to track completed jobs, corrections and time spent reviewing results. Connections to more workplace systems make those checks increasingly consequential.',
  watch:'Watch for whole-task completion rates, review costs and evidence that promised integrations have reached customers.',
  visualTitle:'Three parts of a useful workflow',
  visual:[['Connect','Reach the systems teams use'],['Complete','Finish every required step'],['Check','Measure corrections and review time']],
  developments:[
   {date:'2026-10-06',id:932,title:'Ironclad tests agents on legal workflows',text:'OpenAI reports a mean rubric score of 55.0% for its strongest tested configuration across 11 tasks. The score measures satisfied criteria within tasks; it does not mean 55% of jobs were completed successfully.',source:'OpenAI',url:'https://openai.com/index/advancing-computer-use-with-ironclad/'},
   {date:'2026-10-06',id:933,title:'Atlassian expands its OpenAI partnership',text:'OpenAI models will support more of Atlassian’s platform and Rovo. The companies are exploring deeper Jira integrations for assigning work and tracking progress.',source:'OpenAI',url:'https://openai.com/index/atlassian-partnership/'},
   {date:'2026-10-01',id:910,title:'Barclays expands its use of Claude',text:'Anthropic reports that more than 16,000 Barclays colleagues use its knowledge assistant. The bank expects Claude Code adoption to reach half its developers by year-end.',source:'Anthropic',url:'https://www.anthropic.com/news/barclays-scales-claude'},
   {date:'2026-10-01',id:918,title:'Claude Code adds programmable mods',text:'Mods can change prompts, tool calls and the interface. They run with Claude Code’s access to the computer and are not sandboxed.',source:'Anthropic',url:'https://claude.com/blog/claude-code-mods'},
   {date:'2026-09-28',id:929,title:'Manus introduces event-triggered automation',text:'Manus 2.0 adds workflows triggered by changes in connected services and a desktop workspace for editing the resulting work.',source:'Manus',url:'https://manus.im/en/blog/introducing-manus-2-0'}
  ]
 },
 {
  id:'ai-infrastructure',label:'AI infrastructure',title:'The buildout reaches the desktop.',
  reviewedAt:'2026-10-08',author:'Codex',accent:'blue',
  teaser:'New local-AI computers give teams another deployment option as cloud providers plan years of additional power capacity.',
  summary:'NVIDIA has opened preorders for RTX Spark laptops, with compact desktops due in November. At the other end of the buildout, Google and Constellation plan nuclear upgrades expected to add 890 megawatts, starting in 2028. These investments put more AI computing both near users and in large shared facilities.',
  meaning:'Teams have another placement decision to make: which workloads belong on their own machines and which need shared capacity. Local hardware gives them more control over where processing happens, alongside responsibility for maintenance and utilization. Compare total operating costs and task performance before choosing. Delivery dates also matter: a preorder and a multiyear power agreement offer very different planning horizons.',
  watch:'Watch independent tests after the October 16 laptop release, desktop availability in November, and whether scheduled power upgrades arrive on time.',
  visualTitle:'From supply to access',
  visual:[['Power','When does electricity arrive?'],['Capacity','What is running today?'],['Access','Who can use and afford it?']],
  developments:[
   {date:'2026-10-07',id:938,title:'RTX Spark moves into laptops and compact desktops',text:'NVIDIA opened laptop preorders, with availability set for October 16 and compact desktops due in November. Configurations offer up to 128GB of unified memory for local workloads.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/local-ai-rtx-spark-microsoft-windows-event/'},
   {date:'2026-10-07',id:934,title:'Research computing credits are proposed',text:'POLITICO reports that National Compute plans $100 million in credits for the Genesis Mission, citing two people familiar with the plans. An announcement is expected October 8; the credits have not been delivered.',source:'POLITICO',url:'https://www.politico.com/news/2026/10/07/trump-compute-credits-ai-science-initiative-01109749'},
   {date:'2026-10-06',id:930,title:'Google backs additional nuclear output',text:'A 20-year agreement supports upgrades at 11 Constellation nuclear units, adding an expected 890 megawatts. The first increases are scheduled for 2028. A separate agreement covers existing generation.',source:'Constellation',url:'https://www.constellationenergy.com/news/2026/10/google-and-constellation-announce-landmark-agreement-to-bring-890-mw-of-new-nuclear-capacity-to-pjm-grid.html'},
   {date:'2026-10-04',id:924,title:'Washington organizers call for a pause',text:'KIRO reported plans for more than 20 events calling for a construction moratorium while cost and environmental rules are developed. Its report describes planned events, not verified turnout.',source:'KIRO 7',url:'https://www.kiro7.com/news/local/anti-data-center-events-planned-across-washington-sunday/CHTOEWIWWRF4DCXQ2KUY5WWUMQ/'},
   {date:'2026-09-30',id:912,title:'CoreWeave introduces Vera Rubin capacity',text:'NVIDIA says Cognition is running production workloads on CoreWeave’s new systems, with early access available to other customers.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/coreweave-agentic-ai-vera-rubin/'}
  ]
 },
 {
  id:'evals',label:'AI evaluations',title:'Put the result to the test.',
  reviewedAt:'2026-10-07',author:'Codex',accent:'mint',
  teaser:'Flu forecasts, mathematical proofs and simulated survey respondents show why the test must fit the task.',
  summary:'Google’s flu forecasts led a CDC season evaluation. OpenAI is publishing mathematical results with machine-checkable versions of many proofs. Pew found sizable errors when AI stood in for human survey respondents. Each offers a different way to judge an AI result against something outside the model’s own answer.',
  meaning:'Useful evidence depends on the job. Forecasts can be compared with events that later happen; formal proofs can be checked against precise rules; simulated opinions need comparison with actual people. A strong result in one setting gives buyers a reason to investigate that use. Decisions about another use still need their own evidence.',
  watch:'Watch independent checks, repeat performance on new data and whether evaluations measure the outcomes users actually need.',
  visualTitle:'Match the check to the claim',
  visual:[['Predict','Compare with observed events'],['Prove','Check the formal reasoning'],['Represent','Compare with real responses']],
  developments:[
   {date:'2026-10-06',id:931,title:'OpenAI releases mathematical work for scrutiny',text:'The release includes Lean formalizations of many proofs, reasoning summaries and revision procedures. The model that produced the results remains internal.',source:'OpenAI',url:'https://openai.com/index/sharing-ai-progress-in-mathematics/'},
   {date:'2026-09-30',id:916,title:'Pew measures the gap in simulated opinions',text:'In Pew’s experiment using Claude Opus 4.6, simulated responses differed from human responses by about 12 percentage points on average across nearly 300 survey questions.',source:'Pew Research Center',url:'https://www.pewresearch.org/data-labs/2026/09/30/can-ai-stand-in-for-human-survey-takers-not-really/'},
   {date:'2026-09-30',id:913,title:'Google leads the CDC’s season evaluation',text:'Google’s model led individual team submissions in the 2025–26 flu hospital-admission evaluation. The ranking used state and D.C. forecasts, excluding national totals, among 39 eligible models.',source:'CDC',url:'https://www.cdc.gov/flu-forecasting/evaluation/2025-2026-report.html'}
  ]
 }
 ,{
  id:'open-weights',label:'Open models',title:'The route to running your own models.',
  reviewedAt:'2026-10-08',author:'Codex',accent:'gold',
  teaser:'A small media-search model is available now. Larger general-purpose models are approaching their promised weight releases.',
  summary:'Google has released EmbeddingGemma 2 for local search across text, images, audio and video. Mistral’s Large 4 preview and Reflection’s Beam announcement point toward larger models teams could host themselves, with both companies promising weights later in October. The releases span different jobs and very different hardware needs.',
  meaning:'Running a model yourself gives you choices about deployment, data handling and upgrades. It also makes capacity planning and maintenance your responsibility. Start with the workload: a compact search model and a large general-purpose model solve different problems. For the larger previews, the next decision depends on the released weights, license terms and measured operating costs.',
  watch:'Watch whether Mistral and Reflection deliver their weights on schedule, what licenses permit, and independent tests on hardware teams can realistically operate.',
  visualTitle:'From announcement to a working system',
  visual:[['Available','Obtain weights and check the license'],['Suitable','Test the model on the actual task'],['Operable','Measure hardware and maintenance costs']],
  developments:[
   {date:'2026-10-06',id:937,title:'Google releases a compact multimodal search model',text:'EmbeddingGemma 2 has 740 million parameters and an Apache 2.0 license. Optional encoders let developers select the media types their local search application needs.',source:'Google',url:'https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/'},
   {date:'2026-10-06',id:936,title:'Mistral opens a Large 4 API preview',text:'Mistral plans to release the weights by the end of October, following further red-team testing. The preview is available through its hosted API.',source:'Mistral',url:'https://mistral.ai/news/mistral-large-4/'},
   {date:'2026-10-05',id:925,title:'Reflection previews Beam',text:'Reflection announced its coding, reasoning and agent model, with final testing underway and weights and technical documentation promised later in October.',source:'Reflection',url:'https://reflection.ai/blog/introducing-beam'}
  ]
 }
];
