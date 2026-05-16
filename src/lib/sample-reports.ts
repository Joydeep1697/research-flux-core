export type SampleSource = {
  index: number;
  title: string;
  url: string;
  publisher: string;
  excerpt: string;
  confidence: "high" | "medium" | "low";
};

export type SampleSection = {
  heading: string;
  /** Markdown allowed. Use [N] inline citations referencing source indices. */
  body: string;
};

export type SampleReport = {
  slug: string;
  industry: string;
  query: string;
  title: string;
  publishedAt: string;
  readMinutes: number;
  summary: string[];
  findings: string[];
  sections: SampleSection[];
  openQuestions: string[];
  sources: SampleSource[];
};

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    slug: "ai-agents-enterprise-2026",
    industry: "AI & Technology",
    query: "How are enterprises actually deploying AI agents in 2026, and what is working?",
    title: "Enterprise AI Agents in 2026: Deployment Patterns, Outcomes, and Hard Constraints",
    publishedAt: "2026-05-12",
    readMinutes: 9,
    summary: [
      "Production AI-agent deployments shifted from chat copilots to narrow, tool-using agents wrapped in deterministic workflows [1][3].",
      "Top measured wins are in customer support deflection (24-38%), sales research, and internal IT helpdesks [2][5].",
      "Cost per resolved task is now the dominant KPI, replacing token-cost benchmarking [4].",
      "Governance, eval pipelines, and human-in-the-loop review are the most common blockers to scaling beyond pilot [6][7].",
    ],
    findings: [
      "Agent frameworks have consolidated around LangGraph, OpenAI Agents SDK, and a long tail of in-house orchestrators [1].",
      "Average enterprise pilot-to-production conversion rate climbed from 11% (2024) to 31% (Q1 2026) [3].",
      "Retrieval quality, not model choice, is the strongest predictor of perceived agent quality [5].",
      "Regulated industries (finance, healthcare) overwhelmingly run agents in 'advisory' mode with human approval gates [6].",
    ],
    sections: [
      {
        heading: "What 'deployed' actually means in 2026",
        body: "Survey data from 1,200 enterprises [3] shows the median production agent is highly bounded: 3-6 tools, a single domain, and a deterministic outer workflow that calls the LLM only at decision points. This is a clear retreat from the 2024 vision of fully autonomous agents [1].\n\nGartner's 2026 agent survey [2] reports that 64% of production agents now run under what it calls 'workflow-bound' architectures, vs. 19% in 2024. The remaining 'open-ended' agents are concentrated in code-generation and research tasks where intermediate steps are cheaply verifiable.",
      },
      {
        heading: "Where the measured wins are",
        body: "Three categories dominate the case-study literature:\n\n- **Customer support deflection**: Klarna, Intercom, and ServiceNow report 24-38% ticket deflection with agents that combine RAG over knowledge bases with structured tool calls [2][5].\n- **Sales & GTM research**: Outreach and Gong report 4-7x speed-ups in account research, with reps spending the saved time on calls [4].\n- **Internal IT and HR helpdesks**: Among the highest ROI because they are bounded, low-risk, and have rich existing data [6].\n\nWhat is conspicuously absent from production case studies: open-ended 'AI employees', autonomous coding agents owning end-to-end PRs, and fully autonomous customer-facing sales [7].",
      },
      {
        heading: "What is blocking scale beyond pilot",
        body: "The most-cited blockers in the McKinsey 2026 State of AI survey [6] are, in order:\n\n1. Lack of reliable evaluation infrastructure (cited by 71%)\n2. Data quality and access in source systems (64%)\n3. Cost and latency at production volume (52%)\n4. Governance, auditability, and regulatory uncertainty (47%)\n5. Talent — specifically agent-system engineers, not ML researchers (39%)\n\nNotably, raw model capability ranks 8th. The 'AI is good enough' framing is now mainstream [7].",
      },
      {
        heading: "Contrasting viewpoints",
        body: "Andreessen Horowitz [4] argues that the workflow-bound pattern is a temporary scaffold and that 2027-2028 will see more open-ended agents as eval tooling matures.\n\nGoogle DeepMind researchers [1] push back, arguing that even with perfect models, organizations will continue to prefer bounded agents for legal and auditability reasons — not capability ones.",
      },
    ],
    openQuestions: [
      "Will the cost-per-resolved-task curve continue falling at the 2025 rate, or plateau as inference demand outpaces hardware?",
      "Do agent platforms (LangChain, OpenAI) become commodities, or do tool-integration moats prove durable?",
      "Will the EU AI Act's 2026 enforcement reshape what 'human-in-the-loop' legally means?",
    ],
    sources: [
      {
        index: 1,
        title: "The State of LLM Agents 2026",
        publisher: "LangChain",
        url: "https://blog.langchain.dev/state-of-agents-2026/",
        excerpt: "Production agents have consolidated around workflow-bound patterns with 3-6 tools and deterministic outer loops.",
        confidence: "high",
      },
      {
        index: 2,
        title: "Gartner 2026 AI Agent Adoption Survey",
        publisher: "Gartner",
        url: "https://www.gartner.com/en/research/ai-agents-2026",
        excerpt: "64% of production agents now run under workflow-bound architectures vs. 19% in 2024.",
        confidence: "high",
      },
      {
        index: 3,
        title: "Enterprise AI Pilot-to-Production Benchmark, Q1 2026",
        publisher: "MIT Sloan Management Review",
        url: "https://sloanreview.mit.edu/ai-pilots-2026",
        excerpt: "Median pilot-to-production conversion climbed from 11% to 31% year-over-year.",
        confidence: "high",
      },
      {
        index: 4,
        title: "Agents in 2026: The Workflow Era",
        publisher: "Andreessen Horowitz",
        url: "https://a16z.com/agents-2026-workflow-era",
        excerpt: "Cost-per-resolved-task replaces token cost as the dominant agent KPI.",
        confidence: "medium",
      },
      {
        index: 5,
        title: "Customer Support AI Deflection Benchmarks",
        publisher: "Intercom Research",
        url: "https://www.intercom.com/research/ai-deflection-2026",
        excerpt: "Top performers achieve 24-38% ticket deflection with bounded agent + RAG.",
        confidence: "high",
      },
      {
        index: 6,
        title: "McKinsey State of AI 2026",
        publisher: "McKinsey & Company",
        url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/state-of-ai-2026",
        excerpt: "Eval infrastructure and data quality outrank model capability as scale blockers.",
        confidence: "high",
      },
      {
        index: 7,
        title: "Why Autonomous Agents Stalled (And What's Next)",
        publisher: "The Information",
        url: "https://www.theinformation.com/articles/why-autonomous-agents-stalled",
        excerpt: "Open-ended autonomous agents remain confined to verifiable domains like coding.",
        confidence: "medium",
      },
    ],
  },
  {
    slug: "glp1-market-outlook-2026",
    industry: "Healthcare & Pharma",
    query: "What does the GLP-1 market look like in 2026, and where is competition heading?",
    title: "GLP-1 Receptor Agonists in 2026: Market Structure, Pipeline, and Pressure Points",
    publishedAt: "2026-05-08",
    readMinutes: 8,
    summary: [
      "Global GLP-1 market is on track for ~$78B in 2026 revenue, dominated by Novo Nordisk and Eli Lilly [1][2].",
      "Oral GLP-1s and combination therapies (GLP-1/GIP, GLP-1/glucagon) are the most-watched 2027-2028 catalysts [3][4].",
      "Compounded GLP-1 supply has receded sharply after FDA enforcement actions in late 2025 [5].",
      "Payer pushback and outcome-based contracts are reshaping list-vs-net pricing dynamics [6].",
    ],
    findings: [
      "Tirzepatide (Mounjaro/Zepbound) overtook semaglutide (Ozempic/Wegovy) in new-to-brand prescriptions in Q4 2025 [2].",
      "At least 14 oral small-molecule GLP-1 candidates are in Phase 2+ as of May 2026 [3].",
      "Medicare's IRA negotiation list for 2027 includes semaglutide, with material price impact expected [6].",
      "Cardiovascular and renal outcome data continue to expand reimbursable indications [7].",
    ],
    sections: [
      {
        heading: "Market structure today",
        body: "Novo Nordisk and Eli Lilly together hold ~92% of branded GLP-1 revenue [1]. Lilly's tirzepatide franchise (Mounjaro for type 2 diabetes, Zepbound for obesity) has been the share-gainer story of 2025-2026, driven by superior weight-loss outcomes in SURMOUNT trials [2].\n\nSupply has largely normalized after the 2023-2024 shortages, which in turn collapsed the compounded-GLP-1 gray market once the FDA removed semaglutide and tirzepatide from the shortage list in late 2024 and pursued enforcement actions [5].",
      },
      {
        heading: "Pipeline pressure",
        body: "The next competitive wave is **oral** and **combination**:\n\n- **Oral small-molecule GLP-1s**: Lilly's orforglipron Phase 3 readouts are the most-watched 2026 catalyst [3]. Pfizer, Roche, and AstraZeneca all have programs in Phase 2.\n- **GLP-1/GIP combinations**: Retatrutide (Lilly) is reporting ~24% mean weight loss in Phase 2 — materially better than tirzepatide [4].\n- **GLP-1/glucagon**: Boehringer/Zealand's survodutide is the leading non-Lilly contender.\n\nIf even a fraction of these readouts succeed, by 2028 the category fragments meaningfully and the Novo/Lilly duopoly weakens [4].",
      },
      {
        heading: "Payer and pricing dynamics",
        body: "Net prices on GLP-1s for obesity have already fallen 15-25% from 2024 levels via rebates, with PBM utilization-management controls (prior auth, BMI thresholds, step therapy) now standard [6].\n\nMedicare's IRA negotiation for 2027 includes semaglutide. CMS's negotiated maximum fair price is expected in summer 2026 [6]. Analyst consensus is a 30-50% reduction off list, though net impact is smaller given existing rebates.",
      },
      {
        heading: "Contrasting viewpoints",
        body: "Bulls (Morgan Stanley [1], BofA) argue the obesity TAM is still vastly under-penetrated and that oral GLP-1s expand the market more than they cannibalize injectables.\n\nBears (Bernstein, ISI [4]) argue that compounded products and Indian generics will exert structural price pressure even before patent expiry, and that the outcome data has plateaued.",
      },
    ],
    openQuestions: [
      "How quickly will oral GLP-1 adherence and tolerability data emerge in real-world settings?",
      "Will US employer plans expand obesity coverage in 2026-2027, or pull back due to budget impact?",
      "Does the IRA negotiation outcome on semaglutide set a precedent for tirzepatide in 2028?",
    ],
    sources: [
      {
        index: 1,
        title: "GLP-1 Market Update — May 2026",
        publisher: "Morgan Stanley Research",
        url: "https://www.morganstanley.com/ideas/glp-1-market-update-2026",
        excerpt: "Global GLP-1 revenue tracking to ~$78B in 2026; Novo and Lilly hold ~92% share.",
        confidence: "high",
      },
      {
        index: 2,
        title: "Q1 2026 GLP-1 Prescription Tracker",
        publisher: "IQVIA",
        url: "https://www.iqvia.com/insights/glp1-tracker-q1-2026",
        excerpt: "Tirzepatide overtook semaglutide in NBRx share in Q4 2025.",
        confidence: "high",
      },
      {
        index: 3,
        title: "Oral GLP-1 Pipeline Review",
        publisher: "Nature Reviews Drug Discovery",
        url: "https://www.nature.com/articles/nrd-oral-glp1-2026",
        excerpt: "14+ oral small-molecule GLP-1 candidates in Phase 2 or later.",
        confidence: "high",
      },
      {
        index: 4,
        title: "Beyond Tirzepatide: Multi-Agonist Pipeline",
        publisher: "Bernstein Research",
        url: "https://www.bernsteinresearch.com/glp1-multi-agonist",
        excerpt: "Retatrutide Phase 2 showing ~24% mean weight loss vs. tirzepatide's ~21%.",
        confidence: "medium",
      },
      {
        index: 5,
        title: "FDA Enforcement Actions on Compounded GLP-1s",
        publisher: "U.S. Food and Drug Administration",
        url: "https://www.fda.gov/drugs/compounded-glp1-update",
        excerpt: "Following removal from shortage list, FDA initiated enforcement against compounders.",
        confidence: "high",
      },
      {
        index: 6,
        title: "IRA Negotiation Round Two: Semaglutide Outlook",
        publisher: "Kaiser Family Foundation",
        url: "https://www.kff.org/medicare/ira-negotiation-semaglutide",
        excerpt: "CMS maximum fair price for semaglutide expected summer 2026.",
        confidence: "high",
      },
      {
        index: 7,
        title: "SELECT and FLOW Trials: CV and Renal Outcomes",
        publisher: "New England Journal of Medicine",
        url: "https://www.nejm.org/select-flow-glp1-outcomes",
        excerpt: "Cardiovascular and renal benefits supporting label expansion.",
        confidence: "high",
      },
    ],
  },
  {
    slug: "stablecoin-regulation-2026",
    industry: "Finance & Policy",
    query: "What is the global regulatory landscape for stablecoins in 2026?",
    title: "Stablecoin Regulation 2026: A Comparative Snapshot of the US, EU, UK, and Asia",
    publishedAt: "2026-05-05",
    readMinutes: 7,
    summary: [
      "The US GENIUS Act framework (signed 2025) is now in implementation, with federal and state pathways for payment-stablecoin issuers [1][2].",
      "EU MiCA has been live for over a year; e-money tokens (EMTs) dominate, and several non-EU issuers have geoblocked [3].",
      "The UK's FCA stablecoin regime took effect in Q1 2026 with a sandboxed payments pilot [4].",
      "Hong Kong and Singapore are the most active Asian jurisdictions; Japan's framework remains conservative [5][6].",
    ],
    findings: [
      "USDC and PYUSD are positioned as the principal GENIUS Act-compliant issuers; Tether's compliance pathway remains unclear [1][7].",
      "MiCA's 1:1 reserve and EMT caps continue to shape stablecoin product design even outside the EU [3].",
      "Cross-border stablecoin payments are growing ~3x year-over-year, concentrated in B2B remittance corridors [2].",
      "Algorithmic and non-fiat-backed stablecoins are de facto banned across all major regulated regimes [3][4].",
    ],
    sections: [
      {
        heading: "United States: GENIUS Act in implementation",
        body: "The GENIUS Act created federal and state pathways for payment-stablecoin issuers, with reserve, redemption, and disclosure requirements broadly aligned with banking standards [1]. As of May 2026, the OCC has begun reviewing federal charter applications, while New York's DFS continues to lead on the state-charter path [2].\n\nFor non-US issuers, the Act establishes a comparability regime — but Tether (USDT), the largest stablecoin globally, has not publicly committed to a compliance pathway, creating uncertainty about its US distribution post-2026 [7].",
      },
      {
        heading: "European Union: MiCA, one year in",
        body: "MiCA has been fully live since mid-2024. The practical result: e-money tokens (EMTs) backed 1:1 by EU-currency reserves dominate, and non-EUR stablecoin issuers have either geoblocked European users (Tether) or pursued local entities and EUR-denominated equivalents (Circle's EURC) [3].\n\nThe EMT issuance caps for non-euro-denominated stablecoins remain a friction point and a frequent subject of lobbying [3].",
      },
      {
        heading: "United Kingdom, Hong Kong, Singapore, Japan",
        body: "- **UK**: The FCA's stablecoin regime took effect Q1 2026 with a sandboxed payments pilot. Issuers must be FCA-authorized, with safeguarding and redemption rules close to EMI standards [4].\n- **Hong Kong**: HKMA stablecoin licensing went live mid-2025; several HKD- and USD-pegged issuers have received conditional approvals [5].\n- **Singapore**: MAS's Single-Currency Stablecoin (SCS) framework continues to be the regional reference standard [5].\n- **Japan**: Stablecoin issuance is restricted to licensed banks, trusts, and fund-transfer agents — the most conservative regime among major markets [6].",
      },
      {
        heading: "Contrasting viewpoints",
        body: "Industry advocates (Circle, Coinbase [1]) argue the GENIUS Act will accelerate USD-stablecoin dominance globally and expand the US Treasury market via reserve demand.\n\nSkeptics (BIS, IMF research [6]) warn that fragmentation across regimes raises systemic risk and that comparability provisions are untested. They also flag that off-shore unregulated issuance could persist regardless of onshore rules.",
      },
    ],
    openQuestions: [
      "Will Tether commit to a US-comparability path, or accept exclusion from regulated US distribution?",
      "Do MiCA EMT caps get revised in the 2027 review, especially for non-euro issuers?",
      "How do CBDCs (digital euro, e-CNY) interact with private stablecoin markets in 2026-2028?",
    ],
    sources: [
      {
        index: 1,
        title: "Implementing the GENIUS Act: Federal and State Pathways",
        publisher: "Federal Reserve Bank of New York",
        url: "https://www.newyorkfed.org/research/genius-act-2026",
        excerpt: "OCC and NYDFS now jointly leading implementation under the GENIUS Act framework.",
        confidence: "high",
      },
      {
        index: 2,
        title: "Stablecoin Payments Volumes Q1 2026",
        publisher: "Chainalysis",
        url: "https://www.chainalysis.com/reports/stablecoin-volumes-q1-2026",
        excerpt: "Cross-border stablecoin payments grew ~3x YoY, concentrated in B2B remittance.",
        confidence: "high",
      },
      {
        index: 3,
        title: "MiCA One Year On: What Worked, What Didn't",
        publisher: "European Securities and Markets Authority (ESMA)",
        url: "https://www.esma.europa.eu/mica-one-year-on",
        excerpt: "EMT caps and 1:1 reserve rules drive product design across the EU market.",
        confidence: "high",
      },
      {
        index: 4,
        title: "FCA Stablecoin Regime — Policy Statement",
        publisher: "UK Financial Conduct Authority",
        url: "https://www.fca.org.uk/publications/stablecoin-regime-2026",
        excerpt: "Stablecoin authorization framework live Q1 2026; sandboxed payments pilot.",
        confidence: "high",
      },
      {
        index: 5,
        title: "Asia Stablecoin Regulatory Tracker",
        publisher: "Hong Kong Monetary Authority",
        url: "https://www.hkma.gov.hk/stablecoin-regulatory-update",
        excerpt: "HKMA licensing live mid-2025 with conditional approvals issued.",
        confidence: "medium",
      },
      {
        index: 6,
        title: "Stablecoins and Cross-Border Financial Stability",
        publisher: "Bank for International Settlements",
        url: "https://www.bis.org/publ/stablecoin-stability-2026",
        excerpt: "Fragmentation across regimes raises systemic risk; comparability provisions untested.",
        confidence: "high",
      },
      {
        index: 7,
        title: "Tether's Uncertain US Future",
        publisher: "Financial Times",
        url: "https://www.ft.com/content/tether-genius-act-pathway",
        excerpt: "Tether has not publicly committed to a GENIUS Act comparability pathway.",
        confidence: "medium",
      },
    ],
  },
];

export function getSampleReport(slug: string): SampleReport | undefined {
  return SAMPLE_REPORTS.find((r) => r.slug === slug);
}
