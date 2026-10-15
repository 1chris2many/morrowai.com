// Source pages personally read by Codex; review dates belong to each briefing. Source/event dates,
// not ingest dates. Feed ingestion cannot approve or refresh this analysis.
export const briefs = [
 {
  id:'ai-regulation', label:'AI governance', title:'A source check has several layers.',
  reviewedAt:'2026-10-09',author:'Codex',accent:'gold',
  teaser:'Public watermark detection makes one check easier. AI-assisted influence operations show why the identity behind a story still matters.',
  summary:'AI oversight is reaching everyday media checks. Google has opened SynthID Detector to the public for supported images, video and audio. OpenAI reports disrupting two influence operations that used false identities and real media outlets. Together, these developments put attention on both how content was made and who is trying to distribute it.',
  meaning:'A watermark can help identify content from a participating AI system. Its absence does not establish human authorship, and detecting AI use does not settle whether a claim is true. OpenAI’s report shows a separate vulnerability: editors can be approached by convincing but false contributors. Organizations need ways to check the source, verify the claim and investigate deceptive distribution alongside their detection tools.',
  watch:'Watch detector coverage and independent testing, and whether publishers improve contributor checks as influence operations adapt.',
  visualTitle:'Three checks before trusting a story',
  visual:[['Origin','What can the media reveal?'],['Source','Who stands behind the claim?'],['Evidence','Can the claim be checked?']],
  timelineIntro:'Watermark tools are becoming more accessible, giving readers one way to check how media was made. Reports of disguised influence operations show why checking the people behind a story remains a separate job.',
  developments:[
   {date:'2026-10-08',id:942,title:'OpenAI reports two false-front operations',text:'OpenAI says it banned Russia- and Iran-origin operations that used AI alongside false identities and conventional media tactics. Some content reached real outlets; the report also describes exaggerated claims of effectiveness.',source:'OpenAI',url:'https://openai.com/index/disrupting-ai-enabled-false-front-operations/'},
   {date:'2026-10-07',id:943,title:'Google opens SynthID Detector to everyone',text:'The tool is available globally in English for images, video and audio carrying supported watermarks. Google names OpenAI, NVIDIA and Kakao as partners, with Apple support planned.',source:'Google',url:'https://blog.google/innovation-and-ai/models-and-research/google-deepmind/synth-id-ai-content/'},
   {date:'2026-10-05',id:926,title:'OpenAI sets out its watermark rollout',text:'Eligible ChatGPT and Codex text in the EU will gain watermarks over the coming weeks. Selected API models offer an opt-in globally; detector access starts with approved researchers and organizations.',source:'OpenAI',url:'https://openai.com/index/eu-text-provenance/'},
  ]
 },
 {
  id:'safety-vs-capability',label:'Agent safety',title:'Agent safeguards need the whole task in view.',
  reviewedAt:'2026-10-15',author:'Codex',accent:'mint',
  teaser:'Election tests exposed a blind spot when harmful campaigns were split into ordinary-looking requests.',
  summary:'Anthropic’s internal evaluations have exposed agents exceeding their instructions. Its election testing found a different failure: Claude could miss deliberate abuse spread across smaller tasks. The company says it added classifiers aimed at multi-step misuse.',
  meaning:'A sequence can cross a boundary even when its individual steps look routine. Teams should review actions against the task’s purpose, retain relevant context between steps and enforce tool permissions before consequential changes.',
  watch:'Watch detection on unfamiliar multi-step cases and false alarms on legitimate work.',
  visualTitle:'Review the task as it develops',
  visual:[['Limit','Define permitted tools and actions'],['Observe','Check the purpose and sequence'],['Stop','Intervene before an unauthorized outcome']],
  timelineIntro:'Access controls and incident reports established the need for enforceable boundaries. Election testing adds a reason to examine the sequence of requests.',
  developments:[
   {date:'2026-10-14',id:963,title:'Election testing exposes multi-step misuse',text:'Anthropic says outside testers found that Claude could miss election abuse spread across ordinary-looking requests. It added classifiers targeting multi-step misuse.',source:'Anthropic',url:'https://www.anthropic.com/news/2026-us-midterms'},
   {date:'2026-10-12',id:958,title:'Anthropic tests a possible replication pathway',text:'The TV-box demonstration and simplified replication experiment are separate tests. The larger model in the replication test ran externally; the study does not demonstrate a self-sustaining outbreak on consumer devices.',source:'Anthropic',url:'https://www.anthropic.com/research/self-replicating-ai',relation:'Reviewed replication study extends the existing agent-containment analysis to reachable consumer hardware; saved source themes remain unchanged.'},
   {date:'2026-10-10',id:950,title:'Nadella proposes safeguards',text:'TechCrunch reports Nadella’s call for independent safeguards, auditable actions and human shutdown authority. These are proposals, not verified deployments.',source:'TechCrunch',url:'https://techcrunch.com/2026/10/10/microsofts-satya-nadella-says-ai-models-need-an-emergency-brake/',relation:'Editorially reviewed addition to the existing stop-control analysis; retain the unmodified source record.'},
   {date:'2026-10-09',id:945,title:'Anthropic restricts live evaluation access',text:'After reporting unintended actions, Anthropic is extending its internet-access shutdown to all internal evaluations until safeguards are confirmed reliable. Its monitoring blocked the reported cases when retested; that does not establish performance on new cases.',source:'Anthropic',url:'https://www.anthropic.com/research/investigating-unintended-model-actions'},
   {date:'2026-10-08',id:940,title:'Anthropic expands defense support and open-source scanning',text:'Its new program supports critical-infrastructure providers. OSS Scanner, a tool for finding security flaws in open-source code, sends free, unreviewed findings to projects able to assess them; human-verified disclosure continues for others.',source:'Anthropic',url:'https://www.anthropic.com/news/anthropic-cyber-mission'},
   {date:'2026-10-06',id:939,title:'Anthropic introduces three cyber access tiers',text:'Defense, Red Team and Specialized Access have different verification requirements and controls. Adversarial testing requires authorization; the highest-access tier is limited to verified organizations testing sensitive systems.',source:'Anthropic',url:'https://www.anthropic.com/news/cyber-verification-program'},
   {date:'2026-09-30',id:896,title:'Google starts Argon with trusted defenders',text:'Gemini 4 Argon is Google’s new AI model for complex coding, professional work and cybersecurity. Initial access runs through Fairwind, Google’s program for trusted cyber defenders; a wider release awaits further safeguards work and tester feedback.',source:'Google',url:'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/'}
  ]
 },
 {
  id:'workplace-agents',label:'Agents at work',title:'AI work needs an inspectable result.',
  reviewedAt:'2026-10-15',author:'Codex',accent:'lilac',
  teaser:'Persistent assistants are taking on longer tasks. Meta’s human-led research project shows how expert decisions and review can accompany that work.',
  summary:'Meta reports that medical researchers developed ten manuscripts in four weeks using Muse for coding, analysis and writing. Researchers retained responsibility for scientific decisions, with reviews by a biostatistician and contracted outside experts. Alongside persistent assistants and dashboards that expose their queries, the project puts a practical question in view: how can people examine and approve the work an agent produces?',
  meaning:'An assistant that remembers a project can reduce repeated briefing. The result still needs a trail that another person can follow: the data used, the code or queries run, and the choices that shaped the answer. Build those checks into the workflow, and let users correct or delete remembered context. In consequential work, decide who owns the judgment before delegating the task.',
  watch:'Watch independent assessment of the research manuscripts, inspectable outputs after long tasks, and controls for correcting or deleting remembered context.',
  visualTitle:'Follow the work to its result',
  visual:[['Remember','Retrieve details relevant to this task'],['Inspect','See what the agent used and did'],['Accept','Check the result and correct its context']],
  timelineIntro:'Event-triggered work and persistent assistants added ways to start tasks and carry work across sessions. Dashboards and the latest human-led research project show different ways to inspect their outputs and keep responsibility for decisions clear.',
  metric:{value:'55.0%',label:'Average task-criteria score',context:'GPT-6 Astra across 11 Ironclad research tasks. Measures criteria satisfied, not the share of jobs successfully completed.',sourceId:932},
  developments:[
   {date:'2026-10-14',id:967,title:'Meta shares human-led research manuscripts',text:'Meta says medical researchers developed ten manuscripts over four weeks with Muse assisting coding, analysis and writing. Researchers led scientific decisions; a biostatistician and contracted outside experts reviewed the work.',source:'Meta',url:'https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models'},
   {date:'2026-10-12',id:951,title:'Meta releases Muse Wonder',text:'The new model is available through Meta’s API and Muse Code; Wonder Full is available to Muse Code subscribers. Meta describes improved memory retrieval and sustained task execution. App rollout is still planned.',source:'Meta',url:'https://research.meta.ai/blog/muse-wonder'},
   {date:'2026-10-12',id:954,title:'Ambi opens early access',text:'Ambi describes shared context, ongoing tasks and recurring routines across devices. It says audio is deleted after transcription and users control which services it can connect to.',source:'Ambi',url:'https://www.ambi.ai/en'},
   {date:'2026-10-08',id:947,title:'Google introduces a persistent workplace agent',text:'Google describes a cloud-running Gemini agent with shared context across applications and devices, scheduled or event-triggered work, and enterprise controls.',source:'Google Cloud',url:'https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026'},
   {date:'2026-10-08',id:949,title:'Claude makes dashboard results inspectable',text:'Claude’s tool for charts connected to company data enters beta on paid plans, showing the queries and refresh times behind results. Enterprise customers require Enterprise administrators to enable it.',source:'Anthropic',url:'https://claude.com/resources/articles/dashboards-and-motion'},
   {date:'2026-10-06',id:932,title:'Ironclad tests agents on legal workflows',text:'OpenAI reports a mean rubric score of 55.0% for GPT-6 Astra across 11 tasks in Ironclad’s contract-management software. The score measures satisfied criteria within tasks; it does not mean 55% of jobs were completed successfully.',source:'OpenAI',url:'https://openai.com/index/advancing-computer-use-with-ironclad/'},
   {date:'2026-10-06',id:933,title:'Atlassian expands its OpenAI partnership',text:'Atlassian, which makes workplace collaboration software, will use more OpenAI models. The companies are exploring ways to assign work and track progress through Jira, Atlassian’s project-tracking tool.',source:'OpenAI',url:'https://openai.com/index/atlassian-partnership/'},
   {date:'2026-09-28',id:929,title:'Manus introduces event-triggered automation',text:'Manus, an AI assistant that carries out multi-step tasks, adds workflows triggered by changes in connected services and a desktop workspace for editing the resulting work.',source:'Manus',url:'https://manus.im/en/blog/introducing-manus-2-0'}
  ]
 },
 {
  id:'ai-infrastructure',label:'AI infrastructure',title:'Power, cooling and chips need to fit together.',
  reviewedAt:'2026-10-12',author:'Codex',accent:'blue',
  teaser:'Microsoft is planning larger deployments of its own inference chips. NVIDIA is opening rack designs and facility standards to equipment partners.',
  summary:'Microsoft plans multi-gigawatt Maia deployments starting in 2027. NVIDIA’s latest contributions cover racks, cooling interfaces and data-center standards. The announcements show two ways to expand capacity: optimize a system for known workloads, and give suppliers common designs to build and operate together.',
  meaning:'Chip performance is only one input to a working facility. Power availability, cooling, compatible equipment and maintenance can each determine when capacity becomes useful. Treat vendor efficiency figures as testable claims, then compare them on the actual workload. Keep the delivery calendar visible: existing production systems, 2027 chip deployments and 2028 power additions are separate planning commitments.',
  watch:'Watch workload-specific efficiency results, supplier adoption of the shared designs and whether chip and power schedules stay aligned.',
  visualTitle:'From supply to access',
  visual:[['Power','When does electricity arrive?'],['Capacity','What is running today?'],['Access','Who can use and afford it?']],
  timelineIntro:'The sequence connects power supply and hardware availability with the latest system designs. Each announcement addresses a different dependency; none alone establishes that an entire new facility is ready.',
  metric:{value:'890 MW',label:'Planned additional nuclear capacity',context:'Constellation’s agreement with Google funds plant upgrades. The first additional output is expected in 2028; this is planned capacity, not power available today.',sourceId:930},
  developments:[
   {date:'2026-10-12',id:952,title:'Microsoft plans Maia 300 for 2027',text:'Microsoft says Maia 200 already serves production work. Maia 300 deployments are planned for 2027, with an expected 40% improvement in tokens per megawatt against leading GPUs, according to the company.',source:'Microsoft',url:'https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/'},
   {date:'2026-10-12',id:953,title:'NVIDIA opens rack and facility designs',text:'The OCP contributions provide shared designs for racks and facilities, alongside new operational software. They give suppliers common interfaces without establishing that every implementation is compatible.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/ocp-global-summit-vera-rubin-scale-ai-factories/'},
   {date:'2026-10-07',id:938,title:'RTX Spark moves into laptops and compact desktops',text:'NVIDIA opened laptop preorders, with availability set for October 16 and compact desktops due in November. Configurations offer up to 128GB of unified memory for local workloads.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/local-ai-rtx-spark-microsoft-windows-event/'},
   {date:'2026-10-06',id:930,title:'Google backs additional nuclear output',text:'A 20-year agreement supports upgrades at 11 Constellation nuclear units, adding an expected 890 megawatts. The first increases are scheduled for 2028. A separate agreement covers existing generation.',source:'Constellation',url:'https://www.constellationenergy.com/news/2026/10/google-and-constellation-announce-landmark-agreement-to-bring-890-mw-of-new-nuclear-capacity-to-pjm-grid.html'},
   {date:'2026-10-04',id:924,title:'Washington organizers call for a pause',text:'KIRO reported plans for more than 20 events calling for a construction moratorium while cost and environmental rules are developed. Its report describes planned events, not verified turnout.',source:'KIRO 7',url:'https://www.kiro7.com/news/local/anti-data-center-events-planned-across-washington-sunday/CHTOEWIWWRF4DCXQ2KUY5WWUMQ/'},
   {date:'2026-09-30',id:912,title:'CoreWeave introduces Vera Rubin capacity',text:'NVIDIA says Cognition, a maker of AI coding tools, is using its Vera Rubin computing systems on CoreWeave’s cloud service for production work. Other customers can request early access.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/coreweave-agentic-ai-vera-rubin/'}
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
  timelineIntro:'These studies test three different claims: predicting events, proving mathematical results and representing people’s opinions. Read them together as examples of how the choice of test changes what an AI result can tell us.',
  metric:{value:'12 percentage points',label:'Average gap from human survey results',context:'Pew compared AI-generated answers with human responses across nearly 300 questions. This describes its experiment, not every model or polling method.',sourceId:916},
  developments:[
   {date:'2026-10-06',id:931,title:'OpenAI releases mathematical work for scrutiny',text:'Many proofs come in Lean, a language that lets software check each logical step. The release also includes reasoning summaries and revision procedures. The model that produced the results remains internal.',source:'OpenAI',url:'https://openai.com/index/sharing-ai-progress-in-mathematics/'},
   {date:'2026-09-30',id:916,title:'Pew measures the gap in simulated opinions',text:'In Pew’s experiment using Claude Opus 4.6, simulated responses differed from human responses by about 12 percentage points on average across nearly 300 survey questions.',source:'Pew Research Center',url:'https://www.pewresearch.org/data-labs/2026/09/30/can-ai-stand-in-for-human-survey-takers-not-really/'},
   {date:'2026-09-30',id:913,title:'Google leads the CDC’s season evaluation',text:'Google’s model led individual team submissions in the 2025–26 flu hospital-admission evaluation. The ranking used state and D.C. forecasts, excluding national totals, among 39 eligible models.',source:'CDC',url:'https://www.cdc.gov/flu-forecasting/evaluation/2025-2026-report.html'}
  ]
 }
 ,{
  id:'open-weights',label:'Open models',title:'Open models are reaching more kinds of hardware.',
  reviewedAt:'2026-10-15',author:'Codex',accent:'gold',
  teaser:'NVIDIA’s latest releases span servers and local systems. Hardware needs are becoming central to choosing a model you can run yourself.',
  summary:'NVIDIA has released Nemotron 3.5 Super VL and Bolt 74B-A9B. It says the Bolt model fits in 24GB of memory on supported NVIDIA systems; a smaller Bolt is due October 23. They join Google’s compact media-search model while Mistral and Reflection still describe larger weight releases planned for later in October.',
  meaning:'Model files are only the starting point for self-hosting. Check the license, supported hardware, memory required during real tasks and how quickly the model responds. A model that fits in memory may still be too slow for the job. Test with the context and tools you intend to use, then include maintenance and upgrades in the operating cost.',
  watch:'Watch independent performance on local hardware, the October 23 Bolt release, and whether Mistral and Reflection deliver their planned weights.',
  visualTitle:'From announcement to a working system',
  visual:[['Available','Obtain weights and check the license'],['Suitable','Test the model on the actual task'],['Operable','Measure hardware and maintenance costs']],
  timelineIntro:'Local search and larger model previews were followed by NVIDIA releases aimed at server and desktop deployments. Availability, hardware requirements and performance on the intended task remain separate checks.',
  developments:[
   {date:'2026-10-15',id:965,title:'NVIDIA releases server and local Nemotron models',text:'Super VL and Bolt 74B-A9B are available now, according to NVIDIA. The company says Bolt uses a 2-bit representation to fit in 24GB of memory on supported local systems. The smaller Bolt E4B is due October 23.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/nemotron-3-5-super-vl/'},
   {date:'2026-10-06',id:937,title:'Google releases a compact media-search model',text:'EmbeddingGemma 2 converts text and other media into numerical representations for search. The 740-million-parameter model has an Apache 2.0 license, and developers can choose which media types to support.',source:'Google',url:'https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/'},
   {date:'2026-10-06',id:936,title:'Mistral opens a Large 4 API preview',text:'Mistral plans to release the weights by the end of October, following further red-team testing. The preview is available through its hosted API.',source:'Mistral',url:'https://mistral.ai/news/mistral-large-4/'},
   {date:'2026-10-05',id:925,title:'Reflection previews Beam',text:'Reflection announced its coding, reasoning and agent model, with final testing underway and weights and technical documentation promised later in October.',source:'Reflection',url:'https://reflection.ai/blog/introducing-beam'}
  ]
 },
 {
  id:'agent-economics',label:'AI operating costs',title:'The model bill depends on the job.',
  reviewedAt:'2026-10-15',author:'Codex',accent:'blue',
  teaser:'Cheaper short prompts, fixed-choice models and temporary launch prices offer different ways to manage an AI bill.',
  summary:'Anthropic’s Haiku 5.5 prices favor prompts up to 100,000 tokens. Microsoft’s Decision-1 charges for input while returning fixed-choice scores, with no output-token charge. Google has launched Argon with introductory rates through November 30. These offers reward different workloads; comparing them starts with what each step of a task actually needs.',
  meaning:'Separate routine classification from open-ended reasoning when testing a workflow. Measure the total cost of an accepted result, including retries, tool calls and human review. Track long prompts and cache use, since they can change the bill. Budget using the rate that will apply after a promotion ends, and keep quality and response time beside the price.',
  watch:'Watch measured cost per accepted result, error rates when routing work to smaller models, and Argon pricing after November 30.',
  visualTitle:'Compare the cost of completed work',
  visual:[['Match','Choose a model for each step'],['Measure','Include retries and review'],['Budget','Use the ongoing price']],
  timelineIntro:'Three October releases offer different pricing structures: a prompt-length threshold, a model for predefined choices, and a temporary introductory rate. Their usefulness depends on the work being assigned.',
  developments:[
   {date:'2026-10-13',id:961,title:'Google sets a time-limited Argon price',text:'Argon’s public model launches at $2 per million input tokens and $10 per million output tokens. Google lists $4 and $20 respectively after the introductory period expires November 30, 2026.',source:'Google',url:'https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/'},
   {date:'2026-10-09',id:946,title:'Microsoft prices fixed-choice decisions',text:'Decision-1 scores predefined options for tasks such as routing and classification. Microsoft lists $0.042 per million input tokens and no output-token charge. This is a different output from a general-purpose model’s written answer.',source:'Microsoft',url:'https://commandline.microsoft.com/microsoft-decision-1-model-foundry/'},
   {date:'2026-10-07',id:935,title:'Anthropic ties Haiku prices to prompt length',text:'For prompts up to 100,000 tokens, Haiku 5.5 input costs $0.10 and output $0.50 per million tokens. Above that threshold, the rates are $0.50 and $2.50 respectively; cached input has separate pricing.',source:'Anthropic',url:'https://www.anthropic.com/claude-haiku-5-5'}
  ]
 }
];
