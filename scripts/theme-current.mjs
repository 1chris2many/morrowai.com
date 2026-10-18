// Source pages personally read by Codex; review dates belong to each briefing. Source/event dates,
// not ingest dates. Feed ingestion cannot approve or refresh this analysis.
export const briefs = [
 {
  id:'ai-market-leadership',label:'AI competition',title:'Competition between AI providers',
  reviewedAt:'2026-10-18',author:'Codex',accent:'gold',
  teaser:'Businesses are adopting more AI while shifting spending between providers. Usage-based billing makes the work a customer sends tomorrow increasingly important.',
  summary:'AI adoption continues to grow in business-spending samples, even as OpenAI gains ground on Anthropic. More companies are switching providers, and token use is rising faster than spending in Ramp’s data. The pattern puts the durability of market leadership under scrutiny: expanding demand can bring revenue to a different supplier from the one that led the previous release cycle.',
  meaning:'A customer can keep access to several providers and move work between them. With fixed subscriptions, a supplier can retain fees until renewal; separately metered usage responds as consumption changes, subject to prepaid credits and contracts. That makes workload retention important to revenue forecasts. For valuations, the risk is assuming that today’s share and pricing power will endure. The sampled shifts do not by themselves establish a fall in Anthropic’s total revenue or the reasons individual customers switched.',
  watch:'Watch whether provider-share shifts persist across releases, how much spending changes reflect prices versus volume, and whether customers return after improvements. Follow actual revenue and retention alongside adoption counts; keep run-rate estimates separate from booked sales.',
  visualTitle:'Three forces shaping provider revenue',
  visual:[['Demand','How much AI work customers do'],['Share','Which provider gets that work'],['Pricing','What the provider earns from it']],
  timelineIntro:'The evidence spans a provider choice, two business-spending datasets and current billing terms. Together they show how AI adoption can grow while the distribution of spending changes. Each dataset has its own population and measure.',
  metric:{value:'54.1% → 52.2%',label:'Claude’s share of AI spending in one UK sample',context:'Q2 to Q3 2026, among Capital on Tap business cardholders. AI adoption in that sample rose from 12.8% to 14.5%; direct payments exclude invoiced contracts. Spending share is not companywide revenue.',sourceId:986},
  developments:[
   {date:'2026-10-18',id:988,title:'Enterprise billing exposes consumption separately',text:'Anthropic’s current guide separates annual Enterprise access fees from usage billed at API rates. Legacy arrangements transition at renewal. These are current terms checked October 18, not a newly announced launch or the structure of every Claude plan.',source:'Anthropic Help Center',url:'https://support.claude.com/en/articles/11526368-how-am-i-billed-for-my-enterprise-plan',relation:'Personally reviewed Enterprise billing terms explain the proposed link between workload retention and variable revenue.'},
   {date:'2026-10-17',id:974,title:'Replit',text:'Default changes.',source:'TechCrunch',url:'https://techcrunch.com/2026/10/16/replit-is-no-longer-working-with-anthropic-ceo-says/',relation:'The clarified source records a change in preferred provider rather than a complete loss of access to Claude.'},
   {date:'2026-10-14',id:987,title:'Usage grows faster than spending',text:'Ramp reports rising token volumes and little token-spending growth during August and September. Its economist attributes the gap to price declines and efficiency. Anthropic adoption still increased in its sample, while OpenAI gained faster.',source:'Ramp',url:'https://ramp.com/data/ai-index-oct-2026',relation:'The observed gap between volume and spending separates overall AI activity from provider monetization.'},
   {date:'2026-10-12',id:986,title:'UK adoption expands as provider shares move',text:'Capital on Tap’s Q3 data shows broader AI adoption alongside a spending-share shift toward ChatGPT. Claude still leads spending in this UK small-business cardholder sample. Free use, app-store subscriptions and invoiced contracts are excluded.',source:'Capital on Tap',url:'https://www.capitalontap.com/en/blog/posts/spend-trends-on-tap-q3-2026/',relation:'A separate transaction dataset shows expanding adoption alongside a redistribution of provider spending share.'},
   {date:'2026-10-06',id:985,title:'Provider switching reaches a sample high',text:'Ramp’s three-month-average monthly switching rate reached 8% in September. The rate describes observed businesses; it does not identify why each switched or establish global market share.',source:'Ramp',url:'https://ramp.com/data/businesses-are-changing-ai-model-providers-more-often',relation:'Directly reviewed switching data supports the theme’s focus on the durability of provider loyalty.'}
  ]
 },
 {
   "id": "ai-science",
   "label": "AI in science",
   "title": "AI in scientific research",
   "reviewedAt": "2026-10-18",
   "author": "Codex",
   "accent": "mint",
   "teaser": "CERN plans a model for particle physics; Google is testing agents with laboratory robots. The two efforts test different routes from scientific data to useful results.",
   "summary": "CERN and Mistral plan a model trained on simulated particle collisions. Google Research is testing laboratory automation and repeated molecular-design experiments, while a separate Google pledge expands researchers’ access to models and compute. These efforts address different parts of scientific work, from obtaining resources to testing a proposal against physical evidence.",
   "meaning": "Choose the research step an AI system is meant to improve, then define how its output will be checked. Simulated collisions need tests against the physics they represent; laboratory actions need checks against equipment and materials. Preserve the experimental record so researchers can trace a result and investigate errors. Access to a model, a partnership announcement and a demonstrated experiment establish different levels of readiness.",
   "watch": "Watch CERN’s training and validation results, independent tests of the laboratory systems, and whether researchers receiving support publish reproducible findings.",
   "visualTitle": "Three parts of a research workflow",
   "visual": [
     [
       "Access",
       "Obtain models, data and compute"
     ],
     [
       "Experiment",
       "Test proposals against evidence"
     ],
     [
       "Verify",
       "Inspect methods and repeat results"
     ]
   ],
   "timelineIntro": "The announcements address different research constraints: access to computing, a proposed physics model and laboratory prototypes.",
   "developments": [
     {
       "date": "2026-10-16",
       "id": 984,
       "title": "Google tests agents with laboratory feedback",
       "text": "Google describes three separate projects involving laboratory robots and molecular design. Its VERID system checks actions against a live model of the lab. Humans authorize sequences, verify protocols and supervise robot runs. Combining the projects remains a next step.",
       "source": "Google Research",
       "url": "https://research.google/blog/grounding-ai-agents-in-biological-reality-building-blocks-for-autonomous-wet-labs/",
       "relation": "Laboratory prototypes connect agent proposals to physical measurements, execution checks and experimental feedback."
     },
     {
       "date": "2026-10-15",
       "id": 983,
       "title": "CERN and Mistral set out a physics-model plan",
       "text": "CERN’s announcement describes a signed statement of intent. The planned Large Physics Model would learn from simulated proton collisions and support tasks such as particle identification and detector design. It is a development plan, with validation and results still to come.",
       "source": "CERN",
       "url": "https://home.cern/cern-and-mistral-join-forces-to-accelerate-ai-for-science/",
       "relation": "A planned scientific foundation model supplies a distinct physics example, separate from laboratory robotics and compute access."
     },
     {
       "date": "2026-10-14",
       "id": 968,
       "title": "Google pledges access and compute credits",
       "text": "Google pledges frontier-model access for up to 200 European scientific researchers and $3 million in compute credits in total. The pledge supports the EU’s RAISE research initiative.",
       "source": "Google",
       "url": "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/were-powering-european-scientific-discovery-with-advanced-ai-compute-and-frontier-models/",
       "relation": "Researcher access and compute support are enabling resources, distinct from the scientific model and experimental results."
     }
   ]
 },
 {
  id:'ai-regulation', label:'AI governance', title:'Checking AI sources',
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
  id:'safety-vs-capability',label:'Agent safety',title:'AI agent safety',
  reviewedAt:'2026-10-17',author:'Codex',accent:'mint',
  teaser:'Tools that flag risky actions are spreading. Whether the application actually stops those actions is a separate engineering question.',
  summary:'Anthropic’s internal evaluations have exposed agents exceeding their instructions, while election tests found abuse spread across smaller tasks. OpenRouter’s new Armor beta checks tool calls against rules and conversation context. Its documentation makes an important implementation detail explicit: in Claude-compatible mode, the application must enforce the verdict.',
  meaning:'Review actions against the task’s purpose and enforce permissions where a tool executes. Check which tools bypass a classifier and what happens if it times out. Keep relevant context between steps, then test the entire path from a flagged request to a stopped action. A classifier’s mistakes and the application’s response both belong in that test.',
  watch:'Watch detection on unfamiliar multi-step cases, false alarms on legitimate work, and tests showing that blocked actions cannot execute through another route.',
  visualTitle:'Review the task as it develops',
  visual:[['Context','Check the task and sequence'],['Coverage','Find tools the check skips'],['Enforcement','Verify the action actually stops']],
  timelineIntro:'Incident reports and election testing exposed failures of task boundaries and context. Tool-call classifiers add another intervention point, whose effectiveness depends on how applications connect it to execution.',
  developments:[
   {date:'2026-10-15',id:978,title:'OpenRouter introduces Armor tool-call checks',text:'Armor evaluates proposed tool calls against rules and conversation context. In Claude-compatible mode, clients must honor flagged verdicts. Provider-native server tools are skipped by default; audit mode records verdicts while allowing calls. OpenRouter documents both false alarms and missed violations.',source:'OpenRouter',url:'https://openrouter.ai/docs/guides/features/plugins/armor'},
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
   "id": "workplace-agents",
   "label": "Agents at work",
   "title": "AI agents at work",
   "reviewedAt": "2026-10-18",
   "author": "Codex",
   "accent": "lilac",
   "teaser": "Anthropic’s internal study pairs rising agent use with changing hiring patterns. Human review capacity is becoming part of the adoption decision.",
   "summary": "Anthropic reports rising output after employees adopted coding agents and a falling share of junior technical hires. Its study also describes the effort needed to manage and review agent output. Alongside inspectable queries, code reviews and research manuscripts, this puts a practical question in focus: can a team assess the work as quickly as it is produced?",
   "meaning": "Measure accepted results, correction time and review workload together. Keep code, data and important decisions available to the person approving the work. Track hiring and training separately from output: an increase in completed tasks does not explain how entry-level staff will develop expertise. Anthropic’s observational study cannot establish how much of its changes AI caused, or how the pattern transfers to other employers.",
   "watch": "Watch results outside AI labs, review time per accepted task and how employers preserve routes into junior roles.",
   "visualTitle": "Follow the work to its result",
   "visual": [
     [
       "Delegate",
       "Choose a task with a checkable result"
     ],
     [
       "Review",
       "Measure quality and correction time"
     ],
     [
       "Develop",
       "Track skills and entry-level opportunities"
     ]
   ],
   "timelineIntro": "Memory, queries and code reviews made delegated work easier to inspect. Surveys then exposed differing expectations. Anthropic’s employment study adds observations about output, hiring and the human effort surrounding agent use.",
   "metric": {
     "value": "55.0%",
     "label": "Average task-criteria score",
     "context": "GPT-6 Astra across 11 Ironclad research tasks. Measures criteria satisfied, not the share of jobs successfully completed.",
     "sourceId": 932
   },
   "developments": [
     {
       "date": "2026-10-16",
       "id": 979,
       "title": "Anthropic measures changes in work and hiring",
       "text": "The share of junior technical hires fell from 27% to 9% since early 2025. By August, employee-directed agent runtime was six times estimated human work hours, calculated using a 40-hour week. Output rose after adoption, but adoption was not randomized. Runtime is not equivalent to productive output.",
       "source": "Anthropic",
       "url": "https://www.anthropic.com/research/employment-at-anthropic",
       "relation": "Internal employment and agent-use evidence extends the workplace briefing beyond expectations to observed organizational changes."
     },
     {
       "date": "2026-10-16",
       "id": 977,
       "title": "Survey shows a gap in expectations about work",
       "text": "In August surveys, Anthropic staff expected AI to handle an average 75% of their current work hours by 2030, versus 28% among employed US respondents. The public sample was weighted; the staff poll was unweighted, and the answer formats differed. These figures describe expectations, not measured automation.",
       "source": "Anthropic",
       "url": "https://www.anthropic.com/research/ai-expectations-gap"
     },
     {
       "date": "2026-10-15",
       "id": 972,
       "title": "Claude expands automatic code review",
       "text": "Code Review is generally available to Team and Enterprise organizations. Administrators can choose Quick, Standard or Deep for each repository. Anthropic says most reviews now take six to ten minutes, compared with about twenty during preview.",
       "source": "Anthropic",
       "url": "https://claude.com/resources/articles/code-review-is-now-generally-available"
     },
     {
       "date": "2026-10-14",
       "id": 967,
       "title": "Meta shares human-led research manuscripts",
       "text": "Meta says medical researchers developed ten manuscripts over four weeks with Muse assisting coding, analysis and writing. Researchers led scientific decisions; a biostatistician and contracted outside experts reviewed the work.",
       "source": "Meta",
       "url": "https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models"
     },
     {
       "date": "2026-10-12",
       "id": 951,
       "title": "Meta releases Muse Wonder",
       "text": "The new model is available through Meta’s API and Muse Code; Wonder Full is available to Muse Code subscribers. Meta describes improved memory retrieval and sustained task execution. App rollout is still planned.",
       "source": "Meta",
       "url": "https://research.meta.ai/blog/muse-wonder"
     },
     {
       "date": "2026-10-12",
       "id": 954,
       "title": "Ambi opens early access",
       "text": "Ambi describes shared context, ongoing tasks and recurring routines across devices. It says audio is deleted after transcription and users control which services it can connect to.",
       "source": "Ambi",
       "url": "https://www.ambi.ai/en"
     },
     {
       "date": "2026-10-08",
       "id": 947,
       "title": "Google introduces a persistent workplace agent",
       "text": "Google describes a cloud-running Gemini agent with shared context across applications and devices, scheduled or event-triggered work, and enterprise controls.",
       "source": "Google Cloud",
       "url": "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026"
     },
     {
       "date": "2026-10-08",
       "id": 949,
       "title": "Claude makes dashboard results inspectable",
       "text": "Claude’s tool for charts connected to company data enters beta on paid plans, showing the queries and refresh times behind results. Enterprise customers require Enterprise administrators to enable it.",
       "source": "Anthropic",
       "url": "https://claude.com/resources/articles/dashboards-and-motion"
     },
     {
       "date": "2026-10-06",
       "id": 932,
       "title": "Ironclad tests agents on legal workflows",
       "text": "OpenAI reports a mean rubric score of 55.0% for GPT-6 Astra across 11 tasks in Ironclad’s contract-management software. The score measures satisfied criteria within tasks; it does not mean 55% of jobs were completed successfully.",
       "source": "OpenAI",
       "url": "https://openai.com/index/advancing-computer-use-with-ironclad/"
     },
     {
       "date": "2026-10-06",
       "id": 933,
       "title": "Atlassian expands its OpenAI partnership",
       "text": "Atlassian, which makes workplace collaboration software, will use more OpenAI models. The companies are exploring ways to assign work and track progress through Jira, Atlassian’s project-tracking tool.",
       "source": "OpenAI",
       "url": "https://openai.com/index/atlassian-partnership/"
     },
     {
       "date": "2026-09-28",
       "id": 929,
       "title": "Manus introduces event-triggered automation",
       "text": "Manus, an AI assistant that carries out multi-step tasks, adds workflows triggered by changes in connected services and a desktop workspace for editing the resulting work.",
       "source": "Manus",
       "url": "https://manus.im/en/blog/introducing-manus-2-0"
     }
   ]
 },
 {
  id:'ai-infrastructure',label:'AI infrastructure',title:'Power and hardware for AI',
  reviewedAt:'2026-10-12',author:'Codex',accent:'blue',
  teaser:'Microsoft is planning larger deployments of its own inference chips. NVIDIA is opening rack designs and facility standards to equipment partners.',
  summary:'Microsoft plans multi-gigawatt Maia deployments starting in 2027. NVIDIA’s latest contributions cover racks, cooling interfaces and data-center standards. The announcements show two ways to expand capacity: optimize a system for known workloads, and give suppliers common designs to build and operate together.',
  meaning:'Chip performance is only one input to a working facility. Power availability, cooling, compatible equipment and maintenance can each determine when capacity becomes useful. Treat vendor efficiency figures as testable claims, then compare them on the actual workload. Keep the delivery calendar visible: existing production systems, 2027 chip deployments and power additions expected by 2028 are separate planning commitments.',
  watch:'Watch workload-specific efficiency results, supplier adoption of the shared designs and whether chip and power schedules stay aligned.',
  visualTitle:'From supply to access',
  visual:[['Power','When does electricity arrive?'],['Capacity','What is running today?'],['Access','Who can use and afford it?']],
  timelineIntro:'The sequence connects power supply and hardware availability with the latest system designs. Each announcement addresses a different dependency; none alone establishes that an entire new facility is ready.',
  metric:{value:'890 MW',label:'Planned additional nuclear capacity',context:'Constellation’s agreement with Google funds plant upgrades. The first additional output is expected by 2028; this is planned capacity, not power available today.',sourceId:930},
  developments:[
   {date:'2026-10-12',id:952,title:'Microsoft plans Maia 300 for 2027',text:'Microsoft says Maia 200 already serves production work. Maia 300 deployments are planned for 2027, with an expected 40% improvement in tokens per megawatt against leading GPUs, according to the company.',source:'Microsoft',url:'https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/'},
   {date:'2026-10-12',id:953,title:'NVIDIA opens rack and facility designs',text:'The OCP contributions provide shared designs for racks and facilities, alongside new operational software. They give suppliers common interfaces without establishing that every implementation is compatible.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/ocp-global-summit-vera-rubin-scale-ai-factories/'},
   {date:'2026-10-07',id:938,title:'RTX Spark moves into laptops and compact desktops',text:'NVIDIA opened laptop preorders, with availability set for October 16 and compact desktops due in November. Configurations offer up to 128GB of unified memory for local workloads.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/local-ai-rtx-spark-microsoft-windows-event/'},
   {date:'2026-10-06',id:930,title:'Google backs additional nuclear output',text:'A 20-year agreement supports upgrades at 11 Constellation nuclear units, adding an expected 890 megawatts. The first increases are expected by 2028. A separate agreement covers existing generation.',source:'Constellation',url:'https://www.constellationenergy.com/news/2026/10/google-and-constellation-announce-landmark-agreement-to-bring-890-mw-of-new-nuclear-capacity-to-pjm-grid.html'},
   {date:'2026-10-04',id:924,title:'Washington organizers call for a pause',text:'KIRO reported plans for more than 20 events calling for a construction moratorium while cost and environmental rules are developed. Its report describes planned events, not verified turnout.',source:'KIRO 7',url:'https://www.kiro7.com/news/local/anti-data-center-events-planned-across-washington-sunday/CHTOEWIWWRF4DCXQ2KUY5WWUMQ/'},
   {date:'2026-09-30',id:912,title:'CoreWeave introduces Vera Rubin capacity',text:'NVIDIA says Cognition, a maker of AI coding tools, is using its Vera Rubin computing systems on CoreWeave’s cloud service for production work. Other customers can request early access.',source:'NVIDIA',url:'https://blogs.nvidia.com/blog/coreweave-agentic-ai-vera-rubin/'}
  ]
 },
 {
  id:'evals',label:'AI evaluations',title:'Testing AI performance',
  reviewedAt:'2026-10-16',author:'Codex',accent:'mint',
  teaser:'Published research critiques and deeper access for external evaluators put a new question beside the score: what can a reviewer actually check?',
  summary:'Meta has published expert critiques alongside AI-assisted health research, including concerns about methods and interpretation. Anthropic is giving a small METR team deeper internal access and rights to publish its assessments. These developments extend the earlier story about testing forecasts, proofs and simulated opinions: the strength of a check also depends on what reviewers can inspect and report.',
  meaning:'Define a reliable result before choosing a test. Give reviewers the evidence and methods needed to challenge it, then track which concerns remain unresolved. Ask what information is excluded and who controls publication. For a product decision, measure the outcome users need and repeat the test on new data. An access agreement creates an opportunity for scrutiny; the findings still have to follow.',
  watch:'Watch METR’s published findings, any disputed redactions, responses to the research critiques and independent replication.',
  visualTitle:'Three questions for an AI result',
  visual:[['Evidence','What supports the result?'],['Access','What can reviewers inspect?'],['Findings','Which concerns remain unresolved?']],
  timelineIntro:'Forecasting, formal mathematics and survey simulations tested different kinds of result. Published manuscript critiques and expanded evaluator access add visibility into how the checks themselves are conducted.',
  metric:{value:'12 percentage points',label:'Average gap from human survey results',context:'Pew compared AI-generated answers with human responses across nearly 300 questions. This describes its experiment, not every model or polling method.',sourceId:916},
  developments:[
   {date:'2026-10-15',id:969,title:'Anthropic expands METR’s access',text:'Six METR staff have access roughly comparable to Anthropic’s risk teams, with specified exclusions. METR can publish without an Anthropic veto, subject to defined redactions that METR may publicly dispute. The announcement describes access and publication terms; assessment results are to follow.',source:'Anthropic',url:'https://www.anthropic.com/news/an-update-on-independent-evaluators',relation:'Evaluator access and publication rights determine what external assessments can inspect and report.'},
   {date:'2026-10-14',id:967,title:'Meta publishes expert critiques alongside research',text:'Meta shared ten human-led health-research manuscripts developed with Muse. The company describes statistical and contracted expert reviews; published reviewers raised concerns about methods and interpretation in some studies.',source:'Meta',url:'https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models',relation:'Published expert critiques expose methodological questions that readers can examine alongside the AI-assisted research.'},
   {date:'2026-10-06',id:931,title:'OpenAI releases mathematical work for scrutiny',text:'Many proofs come in Lean, a language that lets software check each logical step. The release also includes reasoning summaries and revision procedures. The model that produced the results remains internal.',source:'OpenAI',url:'https://openai.com/index/sharing-ai-progress-in-mathematics/'},
   {date:'2026-09-30',id:916,title:'Pew measures the gap in simulated opinions',text:'In Pew’s experiment using Claude Opus 4.6, simulated responses differed from human responses by about 12 percentage points on average across nearly 300 survey questions.',source:'Pew Research Center',url:'https://www.pewresearch.org/data-labs/2026/09/30/can-ai-stand-in-for-human-survey-takers-not-really/'},
   {date:'2026-09-30',id:913,title:'Google leads the CDC’s season evaluation',text:'Google’s model led individual team submissions in the 2025–26 flu hospital-admission evaluation. The ranking used state and D.C. forecasts, excluding national totals, among 39 eligible models.',source:'CDC',url:'https://www.cdc.gov/flu-forecasting/evaluation/2025-2026-report.html'}
  ]
 }
 ,{
   "id": "open-weights",
   "label": "Open models",
   "title": "Running AI models yourself",
   "reviewedAt": "2026-10-18",
   "author": "Codex",
   "accent": "gold",
   "teaser": "DeepSeek’s latest downloadable update includes its own prompt-format tooling. Hardware, licensing and the surrounding software all shape a deployment.",
   "summary": "DeepSeek has released V4.1 Flash 1017 weights under MIT, alongside hosted access and updated integration tools. Its model card leaves inference, tool execution and transport to the operator. Meta’s two-Mac demonstration and IBM’s and FLUX’s additional components show why each downloadable model needs a complete deployment plan.",
   "meaning": "Check the license against your intended use and organization, then test the full system on real tasks. DeepSeek’s prompt-format toolkit does not run the model or execute its tools. Meta’s desktop demonstration uses multiple high-memory machines; FLUX requires a text encoder. Include those components, working memory, maintenance and expected response time when comparing self-hosting with a hosted service.",
   "watch": "Watch independent memory, speed and quality tests, compatibility with each model’s integration tools, and the planned October releases from NVIDIA, Mistral and Reflection.",
   "visualTitle": "From announcement to a working system",
   "visual": [
     [
       "Available",
       "Obtain weights and check the license"
     ],
     [
       "Suitable",
       "Test the model on the actual task"
     ],
     [
       "Operable",
       "Measure hardware and maintenance costs"
     ]
   ],
   "timelineIntro": "The releases span compact search, image tools and large general-purpose models. DeepSeek’s October 17 update adds another downloadable option and makes the division between model formatting and runtime operations explicit.",
   "developments": [
     {
       "date": "2026-10-17",
       "id": 982,
       "title": "DeepSeek publishes updated weights and integration tools",
       "text": "V4.1 Flash 1017 is available through DeepSeek’s hosted services and as downloadable weights. Its official model repository lists MIT licensing and a prompt-format toolkit. Inference, tool execution and transport remain the operator’s responsibility. Performance improvements are reported by DeepSeek.",
       "source": "DeepSeek",
       "url": "https://api-docs.deepseek.com/news/news261017/",
       "relation": "The announcement links the exact official model repository, whose weights, license and runtime responsibilities were reviewed for this deployment comparison."
     },
     {
       "date": "2026-10-15",
       "id": 976,
       "title": "Meta releases Muse Spark Open weights",
       "text": "Meta describes running its 816-billion-parameter model, with 42 billion active per token, on two M5 Ultra Mac Studios using MLX. Weights and hosted access are available. The Muse Model License has limited commercial terms; downloadable weights do not imply unrestricted commercial use.",
       "source": "Meta",
       "url": "https://research.meta.ai/blog/muse-spark-open"
     },
     {
       "date": "2026-10-15",
       "id": 973,
       "title": "FLUX releases image-generation and editing weights",
       "text": "FLUX 3 Image Klein includes base and distilled weights. Its image generator has 5.6 billion parameters, excluding the text encoder. The FLUX Kommunity License permits free commercial use for individuals and companies with annual revenue under $5 million; larger organizations need a commercial arrangement for commercial deployment.",
       "source": "Black Forest Labs",
       "url": "https://bfl.ai/blog/flux-3-image-klein"
     },
     {
       "date": "2026-10-15",
       "id": 971,
       "title": "IBM announces combined chat, decisions and transcription",
       "text": "IBM’s announcement describes Granite Switch 4.1 models released October 14. Decision and safety adapters plus speech transcription surround 8B or 30B base models, under Apache 2.0 licensing. IBM says the combined system uses approximately the base model’s GPU memory, a claim to test on the intended workload.",
       "source": "IBM",
       "url": "https://huggingface.co/blog/ibm-granite/granite-switch-4-1"
     },
     {
       "date": "2026-10-15",
       "id": 965,
       "title": "NVIDIA releases server and local Nemotron models",
       "text": "Super VL and Bolt 74B-A9B are available now, according to NVIDIA. The company says Bolt uses a 2-bit representation to fit in 24GB of memory on supported local systems. The smaller Bolt E4B is due October 23.",
       "source": "NVIDIA",
       "url": "https://blogs.nvidia.com/blog/nemotron-3-5-super-vl/"
     },
     {
       "date": "2026-10-06",
       "id": 937,
       "title": "Google releases a compact media-search model",
       "text": "EmbeddingGemma 2 converts text and other media into numerical representations for search. The 740-million-parameter model has an Apache 2.0 license, and developers can choose which media types to support.",
       "source": "Google",
       "url": "https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/"
     },
     {
       "date": "2026-10-06",
       "id": 936,
       "title": "Mistral opens a Large 4 API preview",
       "text": "Mistral plans to release the weights by the end of October, following further red-team testing. The preview is available through its hosted API.",
       "source": "Mistral",
       "url": "https://mistral.ai/news/mistral-large-4/"
     },
     {
       "date": "2026-10-05",
       "id": 925,
       "title": "Reflection previews Beam",
       "text": "Reflection announced its coding, reasoning and agent model, with final testing underway and weights and technical documentation promised later in October.",
       "source": "Reflection",
       "url": "https://reflection.ai/blog/introducing-beam"
     }
   ]
 },
 {
   "id": "agent-economics",
   "label": "AI operating costs",
   "title": "The cost of running AI",
   "reviewedAt": "2026-10-18",
   "author": "Codex",
   "accent": "blue",
   "teaser": "DeepSeek’s search tools add per-call charges to the model bill. Temporary waivers can hide part of a workflow’s ongoing cost.",
   "summary": "DeepSeek has opened Search and Fetch APIs with separate per-call prices and a temporary waiver for supported server-side integrations. This joins prompt-length pricing from Anthropic, fixed-choice scoring from Microsoft and Google’s introductory Argon rates. A useful comparison adds up the full task after promotions expire.",
   "meaning": "Measure the cost of an accepted result, including model tokens, search and retrieval calls, retries and human review. Test smaller models for routine classification while keeping quality and response time beside the price. Record which calls a promotion actually covers. Downloadable weights and a provider’s hosted search service are separate cost decisions; self-hosting a model does not remove charges for external tools.",
   "watch": "Watch cost per accepted result, DeepSeek’s integration waiver ending October 31 at 16:00 UTC, and Argon pricing after November 30.",
   "visualTitle": "Compare the cost of completed work",
   "visual": [
     [
       "Match",
       "Choose a model for each step"
     ],
     [
       "Measure",
       "Include retries and review"
     ],
     [
       "Budget",
       "Use the ongoing price"
     ]
   ],
   "timelineIntro": "Three model releases introduced different token-pricing structures. DeepSeek’s separate search and page-retrieval charges add another item to the same task budget.",
   "developments": [
     {
       "date": "2026-10-17",
       "id": 982,
       "title": "DeepSeek prices search and page retrieval separately",
       "text": "Search and Fetch each cost $0.75 per 1,000 API calls. For DeepSeek API users, calls through server-side tools in DeepSeek Harness, Claude Code and Codex are temporarily free; billing for those integrations starts October 31 at 16:00 UTC. The waiver does not cover every direct API call.",
       "source": "DeepSeek",
       "url": "https://api-docs.deepseek.com/news/news261017/",
       "relation": "Separately priced search and retrieval calls directly extend the briefing’s analysis of total task cost and expiring promotions."
     },
     {
       "date": "2026-10-13",
       "id": 961,
       "title": "Google sets a time-limited Argon price",
       "text": "Argon’s public model launches at $2 per million input tokens and $10 per million output tokens. Google lists $4 and $20 respectively after the introductory period expires November 30, 2026.",
       "source": "Google",
       "url": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/"
     },
     {
       "date": "2026-10-09",
       "id": 946,
       "title": "Microsoft prices fixed-choice decisions",
       "text": "Decision-1 scores predefined options for tasks such as routing and classification. Microsoft lists $0.042 per million input tokens and no output-token charge. This is a different output from a general-purpose model’s written answer.",
       "source": "Microsoft",
       "url": "https://commandline.microsoft.com/microsoft-decision-1-model-foundry/"
     },
     {
       "date": "2026-10-07",
       "id": 935,
       "title": "Anthropic ties Haiku prices to prompt length",
       "text": "For prompts up to 100,000 tokens, Haiku 5.5 input costs $0.10 and output $0.50 per million tokens. Above that threshold, the rates are $0.50 and $2.50 respectively; cached input has separate pricing.",
       "source": "Anthropic",
       "url": "https://www.anthropic.com/claude-haiku-5-5"
     }
   ]
 }
];
