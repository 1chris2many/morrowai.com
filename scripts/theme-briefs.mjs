// Codex-authored synthesis; source pages personally checked 2026-09-25.
// Feed ingestion never edits these briefs or advances their review dates.
export const briefs = [
  {
    id:'ai-regulation', label:'AI governance', title:'Who gets to set the rules?',
    reviewedAt:'2026-09-25', author:'Codex', accent:'gold',
    teaser:'A US proposal, California’s signed safeguards, and a UK hearing put different kinds of power behind AI oversight.',
    summary:'AI oversight is taking shape in several places at once. California has signed child-safety rules for chatbots. US lawmakers have announced a proposal to halt some advanced development. UK MPs have invited four major labs to give evidence. Each approach gives someone different the power to act.',
    meaning:'The practical question is who can demand evidence, require a change, and enforce it. These developments reach different products and carry different kinds of authority. For people building AI products, the details of that authority will matter as much as the headline.',
    watch:'Watch the UK hearing scheduled for October 13, the progress of the US proposal, and how California’s signed rules are implemented.',
    visualTitle:'Three routes to oversight',
    visual:[['Legislation proposed','Limits on development'],['Legislation signed','Product safeguards'],['Hearing planned','Evidence from labs']],
    developments:[
      {date:'2026-09-03',id:674,title:'A proposed limit on advanced development',text:'Sanders and Casar announced forthcoming legislation to ban superintelligence and pause advanced AI development pending federal safety rules.',source:'Senator Sanders’s announcement',url:'https://www.sanders.senate.gov/press-releases/news-sanders-casar-introduce-legislation-to-ban-artificial-superintelligence-and-temporarily-pause-advanced-ai-development/'},
      {date:'2026-09-10',id:753,title:'California signs chatbot protections',text:'The governor signed child-safety measures including chatbot crisis protocols, parental controls and independent child-safety audits.',source:'Governor of California',url:'https://www.gov.ca.gov/2026/09/10/governor-newsom-signs-the-strongest-child-safety-chatbot-and-social-media-laws-in-the-nation/'},
      {date:'2026-09-22',id:828,title:'UK MPs invite four AI labs',text:'A parliamentary committee invited Meta, Google, OpenAI and Anthropic to give evidence on AI security on October 13.',source:'UK Parliament committee',url:'https://committees.parliament.uk/committee/365/business-commerce-energy-and-industrial-strategy-committee/'}
    ]
  },
  {
    id:'safety-vs-capability',label:'Agent safety',title:'Who catches an agent going off course?',
    reviewedAt:'2026-09-25',author:'Codex',accent:'mint',
    teaser:'Behavior codes, incident reports, and access monitoring expose different parts of the safety picture. What happens when something goes wrong?',
    summary:'The major labs are exposing different parts of their safety work. Microsoft has opened a draft behavior code for comment. OpenAI is publishing reports of concerning model behavior. Anthropic is tying life-sciences access to organizational verification and monitoring. Together, they give customers more specific questions to ask.',
    meaning:'Our reading: safety needs a feedback loop. A behavior code sets expectations; incident reports show where expectations fail; monitoring helps identify trouble during use. Customers need to know who receives an alert and what happens next. The effectiveness of these approaches will depend on how they work in practice.',
    watch:'Look for changes after Microsoft’s consultation, follow-up mitigations in OpenAI’s reports, and evidence of how Anthropic’s monitoring handles incidents.',
    visualTitle:'Three parts of the safety picture',
    visual:[['Set expectations','Microsoft’s draft code'],['Expose failures','OpenAI’s reports'],['Monitor use','Anthropic’s access program']],
    developments:[
      {date:'2026-09-14',id:767,title:'Microsoft opens a behavior-code consultation',text:'Microsoft published a draft code for its MAI models and invited six weeks of public feedback on intended behavior and limits.',source:'Microsoft AI',url:'https://microsoft.ai/news/mai-code-of-conduct/'},
      {date:'2026-09-16',id:783,title:'OpenAI publishes a disclosure framework',text:'The company introduced a framework for investigating and sharing model misalignment, alongside six reports of concerning behavior.',source:'OpenAI',url:'https://openai.com/index/model-misalignment-reporting-framework/'},
      {date:'2026-09-17',id:800,title:'Anthropic links access to verified uses',text:'Its life-sciences program vets organizations and monitors activity against approved uses, with administrators responsible for responding to flagged cases.',source:'Anthropic',url:'https://www.anthropic.com/news/life-sciences-verification-program'}
    ]
  },
  {
    id:'workplace-agents',label:'Agents at work',title:'The unit of work is getting bigger.',
    reviewedAt:'2026-09-25',author:'Codex',accent:'lilac',
    teaser:'AI tools are bringing conversations, documents, and parallel tasks together. Teams still have to decide how work changes—and how results are judged.',
    summary:'AI products are bringing more of a task into one place: the conversation, the documents, and the work running in the background. Claude’s new interfaces illustrate that shift. Microsoft’s account of its own rollout adds the organizational piece: teams have to redesign handoffs and decide how results will be judged.',
    meaning:'Our reading: coordinating a whole assignment could reduce the effort of moving work between tools. It also puts more weight on the original brief, access permissions, and final review. A useful measure is the time and effort required to get an acceptable result, including the corrections people still make.',
    watch:'Watch whether teams report repeatable gains across complete workflows, including review time, rework and running costs.',
    visualTitle:'Three changes in how work gets done',
    visual:[['Create together','Chat, documents and slides'],['Coordinate tasks','Parallel coding sessions'],['Redesign handoffs','Shared data and ownership']],
    developments:[
      {date:'2026-09-16',id:798,title:'Claude brings chat and Cowork together',text:'Anthropic announced a combined experience with document and slide creation in conversations, rolling out to Pro and Max users.',source:'Anthropic product announcement',url:'https://claude.com/blog/cowork-is-now-claude'},
      {date:'2026-09-17',id:815,title:'Projects coordinates coding sessions',text:'The Claude Code beta adds a coordinator for parallel cloud sessions, each working in its own repository copy and branch.',source:'Anthropic product announcement',url:'https://claude.com/blog/projects-redesigned'},
      {date:'2026-09-17',id:784,title:'Microsoft describes workflow changes',text:'Microsoft describes simplifying processes and sharing data across agents, with people setting outcomes, permissions and approval thresholds.',source:'Microsoft’s company account',url:'https://blogs.microsoft.com/blog/2026/09/17/what-weve-learned-from-microsofts-own-ai-transformation/'}
    ]
  }
];
