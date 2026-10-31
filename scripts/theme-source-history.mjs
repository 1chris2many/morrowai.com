// Earlier source notes preserved verbatim from 4c3f649 before the reader rewrite.
// feedUrl pins the reviewed news record; a separately checked source may differ (CDC 913).
// History is rendered on the page only; it does not enter current analysis or narration.
export const sourceHistory = {
  "ai-market-leadership": {
    "reviewedAt": "2026-10-31",
    "developments": [
      {
        "date": "2026-10-22",
        "id": 1014,
        "title": "Agent Skills moves to shared stewardship",
        "text": "Anthropic is donating the already-open standard and its project assets to the Linux Foundation’s Agentic AI Foundation. Maintainers from several companies will guide it. This changes governance; it does not mark the start of cross-agent portability.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation",
        "relation": "Shared stewardship of portable procedures extends the briefing’s explanation of what makes daily work easier to move between providers.",
        "feedUrl": "https://www.anthropic.com/news/donating-agent-skills-to-the-agentic-ai-foundation"
      }
    ]
  },
  "ai-science": {
    "reviewedAt": "2026-10-30",
    "developments": [
      {
        "date": "2026-10-15",
        "id": 983,
        "title": "CERN and Mistral set out a physics-model plan",
        "text": "CERN’s announcement describes a signed statement of intent. The planned Large Physics Model would learn from simulated proton collisions and support tasks such as particle identification and detector design. It is a development plan, with validation and results still to come.",
        "source": "CERN",
        "url": "https://home.cern/cern-and-mistral-join-forces-to-accelerate-ai-for-science/",
        "relation": "A planned scientific foundation model supplies a distinct physics example, separate from laboratory robotics and compute access.",
        "feedUrl": "https://home.cern/cern-and-mistral-join-forces-to-accelerate-ai-for-science/"
      }
    ]
  },
  "safety-vs-capability": {
    "reviewedAt": "2026-10-28",
    "developments": [
      {
        "date": "2026-10-21",
        "id": 1009,
        "title": "NVIDIA separates an optional safeguard from the agent host",
        "text": "The OpenShell Reference Architecture combines runtime restrictions with NVIDIA Sentry on BlueField-4 hardware. NVIDIA describes that hardware layer as optional. Its deployment guidance requires identifying every path the safeguard can observe or block and addressing bypass routes.",
        "source": "NVIDIA",
        "url": "https://nvidianews.nvidia.com/news/openshell-reference-architecture",
        "primaryUrl": "https://docs.nvidia.com/enterprise-reference-architectures/secure-agent-workspace-reference-design/latest/reference-architecture.html",
        "feedUrl": "https://nvidianews.nvidia.com/news/openshell-reference-architecture"
      },
      {
        "date": "2026-10-15",
        "id": 978,
        "title": "OpenRouter introduces Armor tool-call checks",
        "text": "Armor evaluates proposed tool calls against rules and conversation context. In Claude-compatible mode, clients must honor flagged verdicts. Provider-native server tools are skipped by default; audit mode records verdicts while allowing calls. OpenRouter documents both false alarms and missed violations.",
        "source": "OpenRouter",
        "url": "https://openrouter.ai/docs/guides/features/plugins/armor",
        "feedUrl": "https://openrouter.ai/docs/guides/features/plugins/armor"
      },
      {
        "date": "2026-10-14",
        "id": 963,
        "title": "Election testing exposes multi-step misuse",
        "text": "Anthropic says outside testers found that Claude could miss election abuse spread across ordinary-looking requests. It added classifiers targeting multi-step misuse.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/news/2026-us-midterms",
        "feedUrl": "https://www.anthropic.com/news/2026-us-midterms"
      },
      {
        "date": "2026-10-12",
        "id": 958,
        "title": "Anthropic tests a possible replication pathway",
        "text": "The TV-box demonstration and simplified replication experiment are separate tests. The larger model in the replication test ran externally; the study does not demonstrate a self-sustaining outbreak on consumer devices.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/research/self-replicating-ai",
        "relation": "Reviewed replication study extends the existing agent-containment analysis to reachable consumer hardware; saved source themes remain unchanged.",
        "feedUrl": "https://www.anthropic.com/research/self-replicating-ai"
      },
      {
        "date": "2026-10-08",
        "id": 940,
        "title": "Anthropic expands defense support and open-source scanning",
        "text": "Its new program supports critical-infrastructure providers. OSS Scanner, a tool for finding security flaws in open-source code, sends free, unreviewed findings to projects able to assess them; human-verified disclosure continues for others.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/news/anthropic-cyber-mission",
        "feedUrl": "https://www.anthropic.com/news/anthropic-cyber-mission"
      },
      {
        "date": "2026-10-06",
        "id": 939,
        "title": "Anthropic introduces three cyber access tiers",
        "text": "Defense, Red Team and Specialized Access have different verification requirements and controls. Adversarial testing requires authorization; the highest-access tier is limited to verified organizations testing sensitive systems.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/news/cyber-verification-program",
        "feedUrl": "https://www.anthropic.com/news/cyber-verification-program"
      },
      {
        "date": "2026-09-30",
        "id": 896,
        "title": "Google starts Argon with trusted defenders",
        "text": "Gemini 4 Argon is Google’s new AI model for complex coding, professional work and cybersecurity. Initial access runs through Fairwind, Google’s program for trusted cyber defenders; a wider release awaits further safeguards work and tester feedback.",
        "source": "Google",
        "url": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/",
        "feedUrl": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon/"
      }
    ]
  },
  "workplace-agents": {
    "reviewedAt": "2026-10-26",
    "developments": [
      {
        "date": "2026-10-22",
        "id": 1010,
        "title": "Duet brings background work back for decisions",
        "text": "Anthropic’s US Pro/Max waitlisted preview can return work and request decisions through messages. Background checks count against the subscriber’s existing allowance. The company acknowledges that the preview can misjudge urgency or miss intervening messages.",
        "source": "TechCrunch",
        "url": "https://techcrunch.com/2026/10/22/claude-duet-app-is-anthropics-bet-on-agents/",
        "primaryUrl": "https://claude.com/product/claude-duet",
        "relation": "Directly checked product terms connect background usage and human interruptions to the attention bottleneck, without claiming measured productivity.",
        "feedUrl": "https://techcrunch.com/2026/10/22/claude-duet-app-is-anthropics-bet-on-agents/"
      },
      {
        "date": "2026-10-22",
        "id": 1015,
        "title": "Flint makes chart exploration reusable",
        "text": "Microsoft Research’s Flint-interactive lets agents specify filtering and linked selections while a compiler handles rendering dependencies. Readers can explore the supported views directly; the announcement does not quantify net time saved.",
        "source": "Microsoft Research",
        "url": "https://www.microsoft.com/en-us/research/blog/flint-interactive-a-language-for-creating-interactive-data-visualizations/",
        "feedUrl": "https://www.microsoft.com/en-us/research/blog/flint-interactive-a-language-for-creating-interactive-data-visualizations/"
      },
      {
        "date": "2026-10-19",
        "id": 996,
        "title": "Google adds an optional review before rendering",
        "text": "Gemini Notebook can show slide outlines or video producer notes for feedback before the final artifact renders. Users can skip the review toggle. Google announced a global rollout over the following week; it did not report measured reductions in review time or rework.",
        "source": "Google",
        "url": "https://blog.google/innovation-and-ai/products/gemini-notebook/co-create-slides-videos/",
        "feedUrl": "https://blog.google/innovation-and-ai/products/gemini-notebook/co-create-slides-videos/"
      },
      {
        "date": "2026-10-16",
        "id": 979,
        "title": "Anthropic measures changes in work and hiring",
        "text": "The share of junior technical hires fell from 27% to 9% since early 2025. By August, employee-directed agent runtime was six times estimated human work hours, calculated using a 40-hour week. Output rose after adoption, but adoption was not randomized. Runtime is not equivalent to productive output.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/research/employment-at-anthropic",
        "relation": "Internal employment and agent-use evidence extends the workplace briefing beyond expectations to observed organizational changes.",
        "feedUrl": "https://www.anthropic.com/research/employment-at-anthropic"
      },
      {
        "date": "2026-10-16",
        "id": 977,
        "title": "Survey shows a gap in expectations about work",
        "text": "In August surveys, Anthropic staff expected AI to handle an average 75% of their current work hours by 2030, versus 28% among employed US respondents. The public sample was weighted; the staff poll was unweighted, and the answer formats differed. These figures describe expectations, not measured automation.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/research/ai-expectations-gap",
        "feedUrl": "https://www.anthropic.com/research/ai-expectations-gap"
      },
      {
        "date": "2026-10-15",
        "id": 972,
        "title": "Claude expands automatic code review",
        "text": "Code Review is generally available to Team and Enterprise organizations. Administrators can choose Quick, Standard or Deep for each repository. Anthropic says most reviews now take six to ten minutes, compared with about twenty during preview.",
        "source": "Anthropic",
        "url": "https://claude.com/resources/articles/code-review-is-now-generally-available",
        "feedUrl": "https://claude.com/resources/articles/code-review-is-now-generally-available"
      },
      {
        "date": "2026-10-14",
        "id": 967,
        "title": "Meta shares human-led research manuscripts",
        "text": "Meta says medical researchers developed ten manuscripts over four weeks with Muse assisting coding, analysis and writing. Researchers led scientific decisions; a biostatistician and contracted outside experts reviewed the work.",
        "source": "Meta",
        "url": "https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models",
        "feedUrl": "https://research.meta.ai/blog/accelerating-scientific-research-in-health-data-science-with-muse-models"
      },
      {
        "date": "2026-10-12",
        "id": 951,
        "title": "Meta releases Muse Wonder",
        "text": "The new model is available through Meta’s API and Muse Code; Wonder Full is available to Muse Code subscribers. Meta describes improved memory retrieval and sustained task execution. App rollout is still planned.",
        "source": "Meta",
        "url": "https://research.meta.ai/blog/muse-wonder",
        "feedUrl": "https://research.meta.ai/blog/muse-wonder"
      },
      {
        "date": "2026-10-12",
        "id": 954,
        "title": "Ambi opens early access",
        "text": "Ambi describes shared context, ongoing tasks and recurring routines across devices. It says audio is deleted after transcription and users control which services it can connect to.",
        "source": "Ambi",
        "url": "https://www.ambi.ai/en",
        "feedUrl": "https://www.ambi.ai/en"
      },
      {
        "date": "2026-10-08",
        "id": 947,
        "title": "Google introduces a persistent workplace agent",
        "text": "Google describes a cloud-running Gemini agent with shared context across applications and devices, scheduled or event-triggered work, and enterprise controls.",
        "source": "Google Cloud",
        "url": "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026",
        "feedUrl": "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026"
      },
      {
        "date": "2026-10-08",
        "id": 949,
        "title": "Claude makes dashboard results inspectable",
        "text": "Claude’s tool for charts connected to company data enters beta on paid plans, showing the queries and refresh times behind results. Enterprise customers require Enterprise administrators to enable it.",
        "source": "Anthropic",
        "url": "https://claude.com/resources/articles/dashboards-and-motion",
        "feedUrl": "https://claude.com/resources/articles/dashboards-and-motion"
      },
      {
        "date": "2026-10-06",
        "id": 932,
        "title": "Ironclad tests agents on legal workflows",
        "text": "OpenAI reports a mean rubric score of 55.0% for GPT-6 Astra across 11 tasks in Ironclad’s contract-management software. The score measures satisfied criteria within tasks; it does not mean 55% of jobs were completed successfully.",
        "source": "OpenAI",
        "url": "https://openai.com/index/advancing-computer-use-with-ironclad/",
        "feedUrl": "https://openai.com/index/advancing-computer-use-with-ironclad/"
      },
      {
        "date": "2026-10-06",
        "id": 933,
        "title": "Atlassian expands its OpenAI partnership",
        "text": "Atlassian, which makes workplace collaboration software, will use more OpenAI models. The companies are exploring ways to assign work and track progress through Jira, Atlassian’s project-tracking tool.",
        "source": "OpenAI",
        "url": "https://openai.com/index/atlassian-partnership/",
        "feedUrl": "https://openai.com/index/atlassian-partnership/"
      },
      {
        "date": "2026-09-28",
        "id": 929,
        "title": "Manus introduces event-triggered automation",
        "text": "Manus, an AI assistant that carries out multi-step tasks, adds workflows triggered by changes in connected services and a desktop workspace for editing the resulting work.",
        "source": "Manus",
        "url": "https://manus.im/en/blog/introducing-manus-2-0",
        "feedUrl": "https://manus.im/en/blog/introducing-manus-2-0"
      }
    ]
  },
  "ai-infrastructure": {
    "reviewedAt": "2026-10-31",
    "developments": [
      {
        "id": 1055,
        "date": "2026-10-29",
        "title": "Samsung plans longer contracts amid tight memory supply",
        "text": "Samsung attributes higher memory prices to server demand and capacity constraints. It expects demand to exceed supply in 2027 and plans multi-year contracts.",
        "source": "Samsung",
        "url": "https://news.samsungsemiconductor.com/global/samsung-electronics-announces-third-quarter-2026-results/",
        "feedUrl": "https://news.samsungsemiconductor.com/global/samsung-electronics-announces-third-quarter-2026-results/"
      },
      {
        "id": 1056,
        "date": "2026-10-29",
        "title": "Sandisk’s sales shift toward data centers",
        "text": "Data-center revenue rose 61% from the preceding quarter while consumer revenue fell 29%, showing different demand patterns within one supplier.",
        "source": "Sandisk (SEC filing via Groowe)",
        "url": "https://groowe.com/newsroom/ojEwz129dq",
        "feedUrl": "https://groowe.com/newsroom/ojEwz129dq"
      },
      {
        "date": "2026-10-28",
        "id": 1039,
        "title": "SK hynix commits future output amid a prolonged shortage forecast",
        "text": "SK hynix expects memory demand to exceed supply through 2030, citing difficult process advances and factory lead times. It reports agreements with 14 customers covering more than half of total 2027–28 production capacity, with prices adjustable within agreed ranges.",
        "source": "SK hynix",
        "url": "https://news.skhynix.com/en/q3-2026-business-results/",
        "relation": "Adds a supplier-reported constraint on expansion to the existing explanation of how recovery turns installed equipment into useful training capacity.",
        "feedUrl": "https://news.skhynix.com/en/q3-2026-business-results/"
      },
      {
        "date": "2026-10-19",
        "id": 995,
        "title": "Meta details Prometheus fault recovery",
        "text": "Meta says Prometheus's completed first phase trained Muse Wonder. It describes spare hardware, isolating failed replicas and restarting from checkpoints, reporting more than 85% pre-training and more than 90% reinforcement-learning goodput on those runs. These are company-reported training results.",
        "source": "Engineering at Meta",
        "url": "https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/",
        "feedUrl": "https://engineering.fb.com/2026/10/19/data-center-engineering/inside-prometheus-meta-gigawatt-scale-supercluster/"
      },
      {
        "date": "2026-10-12",
        "id": 952,
        "title": "Microsoft plans Maia 300 for 2027",
        "text": "Microsoft says Maia 200 already serves production work. Maia 300 deployments are planned for 2027, with an expected 40% improvement in tokens per megawatt against leading GPUs, according to the company.",
        "source": "Microsoft",
        "url": "https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/",
        "feedUrl": "https://blogs.microsoft.com/blog/2026/10/12/microsoft-to-expand-azure-maia-system-to-multi-gigawatt-deployments/"
      },
      {
        "date": "2026-10-12",
        "id": 953,
        "title": "NVIDIA opens rack and facility designs",
        "text": "The OCP contributions provide shared designs for racks and facilities, alongside new operational software. They give suppliers common interfaces without establishing that every implementation is compatible.",
        "source": "NVIDIA",
        "url": "https://blogs.nvidia.com/blog/ocp-global-summit-vera-rubin-scale-ai-factories/",
        "feedUrl": "https://blogs.nvidia.com/blog/ocp-global-summit-vera-rubin-scale-ai-factories/"
      },
      {
        "date": "2026-10-07",
        "id": 938,
        "title": "RTX Spark moves into laptops and compact desktops",
        "text": "NVIDIA opened laptop preorders, with availability set for October 16 and compact desktops due in November. Configurations offer up to 128GB of unified memory for local workloads.",
        "source": "NVIDIA",
        "url": "https://blogs.nvidia.com/blog/local-ai-rtx-spark-microsoft-windows-event/",
        "feedUrl": "https://blogs.nvidia.com/blog/local-ai-rtx-spark-microsoft-windows-event/"
      },
      {
        "date": "2026-10-06",
        "id": 930,
        "title": "Google backs additional nuclear output",
        "text": "A 20-year agreement supports upgrades at 11 Constellation nuclear units, adding an expected 890 megawatts. The first increases are expected by 2028. A separate agreement covers existing generation.",
        "source": "Constellation",
        "url": "https://www.constellationenergy.com/news/2026/10/google-and-constellation-announce-landmark-agreement-to-bring-890-mw-of-new-nuclear-capacity-to-pjm-grid.html",
        "feedUrl": "https://www.constellationenergy.com/news/2026/10/google-and-constellation-announce-landmark-agreement-to-bring-890-mw-of-new-nuclear-capacity-to-pjm-grid.html"
      },
      {
        "date": "2026-10-04",
        "id": 924,
        "title": "Washington organizers call for a pause",
        "text": "KIRO reported plans for more than 20 events calling for a construction moratorium while cost and environmental rules are developed. Its report describes planned events, not verified turnout.",
        "source": "KIRO 7",
        "url": "https://www.kiro7.com/news/local/anti-data-center-events-planned-across-washington-sunday/CHTOEWIWWRF4DCXQ2KUY5WWUMQ/",
        "feedUrl": "https://www.kiro7.com/news/local/anti-data-center-events-planned-across-washington-sunday/CHTOEWIWWRF4DCXQ2KUY5WWUMQ/"
      },
      {
        "date": "2026-09-30",
        "id": 912,
        "title": "CoreWeave introduces Vera Rubin capacity",
        "text": "NVIDIA says Cognition, a maker of AI coding tools, is using its Vera Rubin computing systems on CoreWeave’s cloud service for production work. Other customers can request early access.",
        "source": "NVIDIA",
        "url": "https://blogs.nvidia.com/blog/coreweave-agentic-ai-vera-rubin/",
        "feedUrl": "https://blogs.nvidia.com/blog/coreweave-agentic-ai-vera-rubin/"
      }
    ]
  },
  "evals": {
    "reviewedAt": "2026-10-24",
    "developments": [
      {
        "date": "2026-09-30",
        "id": 916,
        "title": "Pew measures the gap in simulated opinions",
        "text": "In Pew’s experiment using Claude Opus 4.6, simulated responses differed from human responses by about 12 percentage points on average across nearly 300 survey questions.",
        "source": "Pew Research Center",
        "url": "https://www.pewresearch.org/data-labs/2026/09/30/can-ai-stand-in-for-human-survey-takers-not-really/",
        "feedUrl": "https://www.pewresearch.org/data-labs/2026/09/30/can-ai-stand-in-for-human-survey-takers-not-really/"
      },
      {
        "date": "2026-09-30",
        "id": 913,
        "title": "Google leads the CDC’s season evaluation",
        "text": "Google’s model led individual team submissions in the 2025–26 flu hospital-admission evaluation. The ranking used state and D.C. forecasts, excluding national totals, among 39 eligible models.",
        "source": "CDC",
        "url": "https://www.cdc.gov/flu-forecasting/evaluation/2025-2026-report.html",
        "feedUrl": "https://blog.google/innovation-and-ai/models-and-research/google-research/google-science-ai-flu-forecasts/"
      }
    ]
  },
  "open-weights": {
    "reviewedAt": "2026-10-31",
    "developments": [
      {
        "date": "2026-10-17",
        "id": 982,
        "title": "DeepSeek publishes updated weights and integration tools",
        "text": "V4.1 Flash 1017 is available through DeepSeek’s hosted services and as downloadable weights. Its official model repository lists MIT licensing and a prompt-format toolkit. Inference, tool execution and transport remain the operator’s responsibility. Performance improvements are reported by DeepSeek.",
        "source": "DeepSeek",
        "url": "https://api-docs.deepseek.com/news/news261017/",
        "relation": "The announcement links the exact official model repository, whose weights, license and runtime responsibilities were reviewed for this deployment comparison.",
        "feedUrl": "https://api-docs.deepseek.com/news/news261017/"
      },
      {
        "date": "2026-10-15",
        "id": 976,
        "title": "Meta releases Muse Spark Open weights",
        "text": "Meta describes running its 816-billion-parameter model, with 42 billion active per token, on two M5 Ultra Mac Studios using MLX. Weights and hosted access are available. The Muse Model License has limited commercial terms; downloadable weights do not imply unrestricted commercial use.",
        "source": "Meta",
        "url": "https://research.meta.ai/blog/muse-spark-open",
        "feedUrl": "https://research.meta.ai/blog/muse-spark-open"
      },
      {
        "date": "2026-10-15",
        "id": 973,
        "title": "FLUX releases image-generation and editing weights",
        "text": "FLUX 3 Image Klein includes base and distilled weights. Its image generator has 5.6 billion parameters, excluding the text encoder. The FLUX Kommunity License permits free commercial use for individuals and companies with annual revenue under $5 million; larger organizations need a commercial arrangement for commercial deployment.",
        "source": "Black Forest Labs",
        "url": "https://bfl.ai/blog/flux-3-image-klein",
        "feedUrl": "https://bfl.ai/blog/flux-3-image-klein"
      },
      {
        "date": "2026-10-15",
        "id": 971,
        "title": "IBM announces combined chat, decisions and transcription",
        "text": "IBM’s announcement describes Granite Switch 4.1 models released October 14. Decision and safety adapters plus speech transcription surround 8B or 30B base models, under Apache 2.0 licensing. IBM says the combined system uses approximately the base model’s GPU memory, a claim to test on the intended workload.",
        "source": "IBM",
        "url": "https://huggingface.co/blog/ibm-granite/granite-switch-4-1",
        "feedUrl": "https://huggingface.co/blog/ibm-granite/granite-switch-4-1"
      },
      {
        "date": "2026-10-15",
        "id": 965,
        "title": "NVIDIA releases server and local Nemotron models",
        "text": "Super VL and Bolt 74B-A9B are available now, according to NVIDIA. The company says Bolt uses a 2-bit representation to fit in 24GB of memory on supported local systems. The smaller Bolt E4B is due October 23.",
        "source": "NVIDIA",
        "url": "https://blogs.nvidia.com/blog/nemotron-3-5-super-vl/",
        "feedUrl": "https://blogs.nvidia.com/blog/nemotron-3-5-super-vl/"
      },
      {
        "date": "2026-10-06",
        "id": 937,
        "title": "Google releases a compact media-search model",
        "text": "EmbeddingGemma 2 converts text and other media into numerical representations for search. The 740-million-parameter model has an Apache 2.0 license, and developers can choose which media types to support.",
        "source": "Google",
        "url": "https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/",
        "feedUrl": "https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/"
      },
      {
        "date": "2026-10-05",
        "id": 925,
        "title": "Reflection previews Beam",
        "text": "Reflection announced its coding, reasoning and agent model, with final testing underway and weights and technical documentation promised later in October.",
        "source": "Reflection",
        "url": "https://reflection.ai/blog/introducing-beam",
        "feedUrl": "https://reflection.ai/blog/introducing-beam"
      }
    ]
  },
  "agent-economics": {
    "reviewedAt": "2026-10-29",
    "developments": [
      {
        "date": "2026-10-21",
        "id": 1006,
        "title": "Meta outlines transaction fees; Muse still earns subscriptions only",
        "text": "Meta plans business-paid fees for transactions Muse facilitates. Its follow-up call says charging for transactions needs more users and business partners, and that subscriptions are its only current monetization. The projected tenfold efficiency gain still requires technological advances.",
        "source": "TechCrunch",
        "url": "https://techcrunch.com/2026/10/21/meta-says-muse-has-over-10m-users-with-shopping-a-top-activity/",
        "primaryUrl": "https://s21.q4cdn.com/399680738/files/content_files/META-Q3-2026-Follow-Up-Call-Transcript.pdf",
        "relation": "Directly checked Meta earnings and follow-up transcripts connect planned outcome-linked revenue with the provider-side costs already tracked; saved news tags remain unchanged.",
        "feedUrl": "https://techcrunch.com/2026/10/21/meta-says-muse-has-over-10m-users-with-shopping-a-top-activity/"
      },
      {
        "date": "2026-10-20",
        "id": 1004,
        "title": "A fixed-state model changes the memory constraint",
        "text": "AWS and i14 report 29.5 MB of recurrent state per sequence for Laplace 3B, independent of context length. History is compressed, and retrieval quality needs workload-specific evaluation.",
        "source": "AWS",
        "url": "https://aws.amazon.com/blogs/machine-learning/beyond-the-kv-cache-training-and-serving-i14s-laplace-3b-linear-attention-model-on-aws-trainium2-with-native-pytorch/",
        "relation": "New architecture evidence distinguishes the provider's serving constraints from the customer-facing billing mechanisms already tracked.",
        "feedUrl": "https://aws.amazon.com/blogs/machine-learning/beyond-the-kv-cache-training-and-serving-i14s-laplace-3b-linear-attention-model-on-aws-trainium2-with-native-pytorch/"
      },
      {
        "date": "2026-10-13",
        "id": 961,
        "title": "Google sets a time-limited Argon price",
        "text": "Argon’s public model launches at $2 per million input tokens and $10 per million output tokens. Google lists $4 and $20 respectively after the introductory period expires November 30, 2026.",
        "source": "Google",
        "url": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/",
        "feedUrl": "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-argon/"
      },
      {
        "date": "2026-10-09",
        "id": 946,
        "title": "Microsoft prices fixed-choice decisions",
        "text": "Decision-1 scores predefined options for tasks such as routing and classification. Microsoft lists $0.042 per million input tokens and no output-token charge. This is a different output from a general-purpose model’s written answer.",
        "source": "Microsoft",
        "url": "https://commandline.microsoft.com/microsoft-decision-1-model-foundry/",
        "feedUrl": "https://commandline.microsoft.com/microsoft-decision-1-model-foundry/"
      },
      {
        "date": "2026-10-07",
        "id": 935,
        "title": "Anthropic ties Haiku prices to prompt length",
        "text": "For prompts up to 100,000 tokens, Haiku 5.5 input costs $0.10 and output $0.50 per million tokens. Above that threshold, the rates are $0.50 and $2.50 respectively; cached input has separate pricing.",
        "source": "Anthropic",
        "url": "https://www.anthropic.com/claude-haiku-5-5",
        "feedUrl": "https://www.anthropic.com/claude-haiku-5-5"
      }
    ]
  }
};
