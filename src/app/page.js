import Link from "next/link";
import Navbar from "@/components/Navbar";
import ClientResults from "@/components/ClientResults";
import Footer from "@/components/Footer";

const verticals = [
  "AUTO DEALERS", "MED SPAS", "FIELD SERVICES", "DTC BRANDS", "LAW FIRMS",
  "HVAC / PLUMBING", "REAL ESTATE", "INSURANCE", "CONSULTING", "E-COMMERCE",
  "DENTAL PRACTICES", "FITNESS STUDIOS", "RESTAURANTS", "HOME SERVICES", "LOGISTICS",
];

// FAQ Schema for AEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does Intellivance actually do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our clients get back 11.2 hours per week on average. We do that by building AI systems that handle the work your team shouldn't be doing manually — follow-ups that fall through the cracks, reports that take all Friday afternoon, data that gets typed into three different tools. We diagnose the biggest time drains, build the automations, and train your team to use them. You keep your existing tools. We just make them talk to each other.",
      },
    },
    {
      "@type": "Question",
      name: "How much does this cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most clients see ROI within the first 30 days — not the second. We start with a free assessment that maps your specific bottlenecks and shows you exactly what to fix, in what order, and what it saves you. No call, no credit card, no 90-page proposal. Just an honest diagnostic you can act on whether you hire us or not.",
      },
    },
    {
      "@type": "Question",
      name: "What tools and platforms do you integrate with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Whatever you're already using. HubSpot, Salesforce, GHL, Google Workspace, Outlook, QuickBooks, Stripe, Calendly, Jobber — we've connected them all. We don't rip out your stack and replace it. We wire your existing tools together so data stops getting manually copy-pasted between systems.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to see results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The first automation is usually live within 1-2 weeks. We start with the single highest-impact bottleneck — the one that's costing you the most time or money right now — and build that first. You see the win, your team trusts the process, then we stack the next one. Most 8-week engagements deliver 3-4 fully operational systems.",
      },
    },
    {
      "@type": "Question",
      name: "What industries do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any business doing $1M+ with a team that spends too much time on work that should be automated. We've done 30+ engagements across 14 states — auto dealerships, med spas, HVAC contractors, law firms, e-commerce brands, cleaning companies, dental practices, and more. The industry matters less than the bottleneck. If your team is drowning in admin, we can help.",
      },
    },
  ],
};

// HowTo Schema for process section
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Streamline Your Business Operations with AI",
  description: "A three-step process to identify, prioritize, and implement AI-powered systems that recover lost hours and protect revenue.",
  step: [
    {
      "@type": "HowToStep",
      name: "Free Up Your Day",
      text: "Your inbox, your calendar, your team's questions — handled before you open your laptop. You make the decisions. AI handles the rest.",
    },
    {
      "@type": "HowToStep",
      name: "Stop Losing Money",
      text: "Every missed follow-up, forgotten quote, or late restock is money walking out the door. We put AI behind the revenue-protecting tasks you keep meaning to get to.",
    },
    {
      "@type": "HowToStep",
      name: "Grow Without Hiring",
      text: "Proposals, pricing, vendor outreach — the stuff that used to take a full-time hire now runs on AI. Scale your output without scaling your payroll.",
    },
  ],
};

export default function Home() {
  // Client results for the hero panel
  const clientResults = [
    { industry: "Medical Practice", result: "11.2 hrs/week recovered", detail: "Automated patient follow-ups, intake forms, and appointment reminders", tag: "HEALTHCARE" },
    { industry: "DTC E-commerce Brand", result: "Cart recovery: 3% → 22%", detail: "AI-powered abandoned cart sequences and post-purchase nurture", tag: "E-COMMERCE" },
    { industry: "Auto Dealership", result: "$250K+ in annual time savings", detail: "Eliminated 15 hrs/wk of admin across fleet outreach, email triage, and reporting", tag: "AUTOMOTIVE" },
    { industry: "HVAC Contractor", result: "4.5 hrs/day saved on dispatch", detail: "AI route optimization and automated customer notifications", tag: "FIELD SERVICES" },
    { industry: "Law Firm", result: "Zero intake leads lost", detail: "Instant client intake processing and conflict-check automation", tag: "LEGAL" },
  ];

  return (
    <div className="selection:bg-neutral-900 selection:text-white">
      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Navbar />

      <main className="pt-16">
        {/* ═══════════════  HERO  ═══════════════ */}
        <section className="relative min-h-0 lg:min-h-[85vh] w-full border-b border-theme flex flex-col lg:flex-row">
          {/* Left — Headline */}
          <div className="w-full lg:w-2/3 p-6 lg:p-12 flex flex-col justify-center gap-10 border-r border-theme relative overflow-hidden bg-theme">
            <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

            <div className="relative z-10 pt-6 sm:pt-12">
              <div className="mono text-xs mb-6 text-neutral-500 flex items-center gap-2">
                <span>[ INTELLIGENT_OPERATIONS ]</span>
                <div className="h-px w-12 bg-neutral-400"></div>
                <span>AI-POWERED SYSTEMS</span>
              </div>
              <h1
                className="display-text text-neutral-900 reveal-up"
                style={{ animationDelay: "0.1s" }}
              >
                YOUR
                <br />
                COMPETITORS
                <br />
                AREN&apos;T WORKING
                <br />
                HARDER. THEY
                <br />
                BUILT SMARTER.
              </h1>
            </div>

            <div
              className="relative z-10 max-w-lg reveal-up"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed mb-6 sm:mb-8">
                The businesses pulling ahead aren&apos;t adding headcount — they&apos;re
                running AI systems that handle the work no one should be doing
                by hand. We build those systems. Get a free operations roadmap
                in 48 hours.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/assessment"
                  className="bg-neutral-900 text-[#EAEAE5] px-6 py-3 mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  Start Assessment
                </Link>
                <a
                  href="#proof"
                  className="border border-neutral-900 text-neutral-900 px-6 py-3 mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  See the Proof
                </a>
              </div>
              <p className="text-[11px] text-neutral-500 mt-3 leading-relaxed max-w-md">
                If we can&apos;t identify at least $50K/yr in recoverable waste, the consultation is on us.
              </p>
            </div>
          </div>

          {/* Right — Stats Panel */}
          <div className="w-full lg:w-1/3 bg-[#F2F2F0] relative min-h-[400px] lg:min-h-auto flex flex-col">
            <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full">
              {/* Top stat */}
              <div className="bg-white/80 backdrop-blur border-b border-theme p-4 flex items-center justify-between cursor-default select-none">
                <div>
                  <div className="mono text-[10px] text-neutral-500 mb-1">
                    TOTAL VALUE CREATED
                  </div>
                  <div className="text-2xl font-medium tracking-tight">
                    $4.2M+
                  </div>
                </div>
                <div className="text-xs text-green-600 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1L9 5L5 9M5 1L1 5" stroke="currentColor" />
                  </svg>
                  Across all engagements
                </div>
              </div>

              {/* Client results — before/after snapshots */}
              <div className="bg-white/80 backdrop-blur border-b border-theme p-4 overflow-hidden">
                <div className="mono text-[10px] text-neutral-500 mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  CLIENT_RESULTS
                </div>
                <div className="space-y-3">
                  {clientResults.map((item, i) => (
                    <div key={i} className="group">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-neutral-900">
                            {item.industry}
                          </div>
                          <div className="text-[13px] text-neutral-800 font-medium mt-0.5">
                            {item.result}
                          </div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed">
                            {item.detail}
                          </div>
                        </div>
                      </div>
                      {i < clientResults.length - 1 && <div className="border-b border-theme mt-3"></div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours by vertical */}
              <div className="bg-white/80 backdrop-blur border-b border-theme p-4 cursor-default select-none">
                <div className="mono text-[10px] text-neutral-500 mb-3">
                  HRS/WK RECOVERED BY VERTICAL
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                  {[
                    { label: "AUTOMOTIVE", hrs: "14.2" },
                    { label: "MEDICAL", hrs: "11.8" },
                    { label: "FIELD SVC", hrs: "9.5" },
                    { label: "E-COMM", hrs: "12.1" },
                    { label: "LEGAL", hrs: "7.3" },
                    { label: "HVAC", hrs: "10.6" },
                  ].map((v, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="mono text-[9px] text-neutral-400">
                        {v.label}
                      </span>
                      <span className="mono text-xs font-medium text-neutral-800">
                        {v.hrs}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-2 cursor-default select-none">
                <div className="bg-white/80 backdrop-blur border-r border-theme p-3">
                  <div className="mono text-[10px] text-neutral-500 mb-1">
                    ENGAGEMENTS
                  </div>
                  <div className="text-xl font-medium">30+</div>
                </div>
                <div className="bg-white/80 backdrop-blur p-3">
                  <div className="mono text-[10px] text-neutral-500 mb-1">
                    WORKFLOWS
                  </div>
                  <div className="text-xl font-medium">50+</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════  TICKER  ═══════════════ */}
        <div
          className="border-b border-theme overflow-hidden"
          style={{
            background: "var(--text-main)",
            color: "var(--bg-main)",
            padding: "0.75rem 0",
            whiteSpace: "nowrap",
          }}
        >
          <div
            className="mono text-sm tracking-widest"
            style={{
              display: "inline-block",
              animation: "tickerScroll 40s linear infinite",
            }}
          >
            $4.2M+ VALUE CREATED &nbsp;&nbsp;&nbsp;&nbsp; ///
            &nbsp;&nbsp;&nbsp;&nbsp; 100% CLIENT RETENTION
            &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp; 50+ WORKFLOWS
            &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp; 30+
            ENGAGEMENTS &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp;
            12+ VERTICALS &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp;
            OPERATORS IN 14 STATES &nbsp;&nbsp;&nbsp;&nbsp; ///
            &nbsp;&nbsp;&nbsp;&nbsp; $4.2M+ VALUE CREATED
            &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp; 100% CLIENT
            RETENTION &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp; 50+
            WORKFLOWS &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp; 30+
            ENGAGEMENTS &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp;
            12+ VERTICALS &nbsp;&nbsp;&nbsp;&nbsp; /// &nbsp;&nbsp;&nbsp;&nbsp;
            OPERATORS IN 14 STATES &nbsp;&nbsp;&nbsp;&nbsp; ///
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>

        {/* ═══════════════  METHOD (FEATURES)  ═══════════════ */}
        <section
          id="method"
          className="grid grid-cols-1 md:grid-cols-3 w-full border-b border-theme"
        >
          {[
            {
              num: "01",
              title: "Free Up Your Day",
              desc: "Your inbox, your calendar, your team's questions — handled before you open your laptop. You make the decisions. AI handles the rest.",
            },
            {
              num: "02",
              title: "Stop Losing Money",
              desc: "Every missed follow-up, forgotten quote, or late restock is money walking out the door. We put AI behind the revenue-protecting tasks you keep meaning to get to.",
            },
            {
              num: "03",
              title: "Grow Without Hiring",
              desc: "Proposals, pricing, vendor outreach — the stuff that used to take a full-time hire now runs on AI. Scale your output without scaling your payroll.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className={`p-8 lg:p-10 group hover:bg-[#F9F9F7] transition-colors ${i < 2 ? "border-r border-theme" : ""
                }`}
            >
              <div className="mono text-xs text-neutral-500 mb-4">
                [ {step.num} ]
              </div>
              <h3 className="text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {step.desc}
              </p>
              <Link
                href="/assessment"
                className="mt-6 inline-flex items-center gap-2 mono text-[10px] uppercase tracking-wider text-neutral-500 group-hover:text-neutral-900 transition-colors"
              >
                <span>Start Assessment</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 11L11 1M11 1H3M11 1V9"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </section>

        {/* ═══════════════  PROOF / CLIENT RESULTS  ═══════════════ */}
        <ClientResults />

        {/* ═══════════════  INFRASTRUCTURE  ═══════════════ */}
        <section id="about" className="w-full py-24 bg-neutral-900 text-[#EAEAE5]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <div className="mono text-xs text-neutral-500 flex items-center gap-2 mb-6">
                  <span>[ HOW_IT_WORKS ]</span>
                  <div className="h-px w-12 bg-neutral-600"></div>
                </div>
                <h2 className="text-4xl lg:text-5xl font-normal tracking-tight leading-[1.1] mb-12">
                  Smart systems built for
                  <br />
                  how you actually run.
                </h2>
                <div className="space-y-8">
                  {[
                    {
                      num: "01",
                      title: "Intelligent Triage",
                      desc: "AI reads, routes, and draft-replies to every incoming email, ticket, and inquiry. You review only what matters.",
                    },
                    {
                      num: "02",
                      title: "Revenue Protection",
                      desc: "Cart recovery, follow-up sequences, restock alerts, and quote reminders — all handled before revenue walks out the door.",
                    },
                    {
                      num: "03",
                      title: "Unified Data Layer",
                      desc: "Your CRM, billing software, and project management tools all talking. One source of truth, updated in real-time, zero manual syncing.",
                    },
                    {
                      num: "04",
                      title: "Quality & Compliance Check",
                      desc: "AI-powered auditing of outgoing communications, contract generation, and data entry against your operational SOPs. Errors catch themselves.",
                    },
                    {
                      num: "05",
                      title: "Scale Without Headcount",
                      desc: "Proposal drafting, vendor outreach, and client onboarding run on AI. The output of 3 hires, zero payroll.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="mono text-xs text-neutral-500 border border-neutral-600 w-8 h-8 flex items-center justify-center shrink-0">
                        {item.num}
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Testimonial */}
              <div className="flex items-center justify-center">
                <div className="border border-neutral-700 p-8 lg:p-10 max-w-md">
                  <div className="mono text-[10px] text-neutral-500 mb-6 tracking-wider">
                    CLIENT_TESTIMONIAL
                  </div>
                  <p className="text-lg text-neutral-300 leading-relaxed italic mb-8">
                    &quot;The actual admin work I had a list of things I was
                    supposed to do — I didn&apos;t do it. Now the system handles
                    it. I just focus on growing the business.&quot;
                  </p>
                  <div className="flex items-center gap-3 pt-6 border-t border-neutral-700">
                    <div className="w-8 h-8 bg-neutral-700 flex items-center justify-center text-[11px] font-bold">
                      O
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Owner, 4-Location Operator
                      </div>
                      <div className="text-xs text-neutral-500 mono">
                        Multi-vertical service business
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════  TRUST SIGNALS  ═══════════════ */}
        <section className="w-full py-10 bg-white border-b border-theme">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                { value: "100%", label: "Client Retention" },
                { value: "14", label: "States Served" },
                { value: "11.2 hrs", label: "Avg. Weekly Recovery" },
                { value: "40+ yrs", label: "Combined Team Experience" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl lg:text-3xl font-medium tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mono text-[10px] text-neutral-500 mt-1 tracking-wider uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════  INTEGRATIONS  ═══════════════ */}
        <section className="w-full py-14 px-6 lg:px-12 bg-[#F2F2F0] border-b border-theme">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mono text-[11px] text-neutral-600 tracking-widest uppercase mb-8">
              [ STACK_AGNOSTIC ] — WE PLUG INTO YOUR EXISTING TOOLS
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 lg:gap-x-10">
              {[
                "YOUR CRM",
                "YOUR CALENDAR",
                "YOUR EMAIL",
                "YOUR INVOICING",
                "YOUR AD PLATFORM",
                "YOUR PHONE SYSTEM",
                "YOUR BOOKING SOFTWARE",
                "YOUR REVIEW PLATFORM",
                "YOUR ACCOUNTING",
                "YOUR PAYMENT PROCESSOR",
              ].map((tool, i) => (
                <div key={i} className="flex items-center gap-2 cursor-default select-none">
                  <div className="w-2 h-2 border border-neutral-400 bg-neutral-400"></div>
                  <span className="mono text-xs text-neutral-600 tracking-wider">
                    {tool}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-neutral-500 mt-6 leading-relaxed max-w-xl mx-auto">
              We don&apos;t rip out your tools — we wire them together. Whatever
              you&apos;re already using, we layer AI on top of it.
            </p>
          </div>
        </section>

        {/* ═══════════════  FAQ  ═══════════════ */}
        <section className="w-full py-20 px-6 lg:px-12 bg-[#EAEAE5]">
          <div className="max-w-3xl mx-auto">
            <div className="mono text-xs text-neutral-500 mb-6 tracking-widest">
              [ FAQ ]
            </div>
            <h2 className="text-3xl font-normal tracking-tight mb-12">
              Common questions
            </h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, i) => (
                <details
                  key={i}
                  className="group border border-theme bg-white p-6 cursor-pointer"
                >
                  <summary className="font-medium text-neutral-900 list-none flex items-center justify-between">
                    {faq.name}
                    <span className="mono text-xs text-neutral-400 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-neutral-600 leading-relaxed mt-4 pt-4 border-t border-theme">
                    {faq.acceptedAnswer.text}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════  CTA  ═══════════════ */}
        <section className="w-full py-24 px-6 lg:px-12 bg-[#F2F2F0]">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mono text-xs text-neutral-500 mb-6 tracking-widest">
              [ FREE_DIAGNOSTIC ]
            </div>
            <h2 className="text-4xl lg:text-5xl font-normal tracking-tight mb-6 leading-[1.1]">
              Find out where you&apos;re
              <br />
              bleeding time.
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              No call. No credit card. No sales pitch. Answer a few open-ended
              questions, and we&apos;ll deliver a custom 48-hour roadmap showing
              exactly where AI can recover your lost hours.
            </p>
            <Link
              href="/assessment"
              className="bg-neutral-900 text-[#EAEAE5] px-8 py-4 mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors inline-flex items-center gap-3"
            >
              Start Your Free Assessment
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </Link>
            <p className="text-[11px] text-neutral-500 mt-4 leading-relaxed max-w-sm mx-auto">
              If we can&apos;t identify at least $50K/yr in recoverable waste, the consultation is on us.
            </p>
            <p className="mono text-[10px] text-neutral-400 mt-2 tracking-wider">
              TAKES ~3 MINUTES &bull; RESULTS IN 48 HOURS
            </p>
          </div>
        </section>

        {/* ═══════════════  VERTICALS CAROUSEL  ═══════════════ */}
        <section className="border-t border-theme py-12 bg-[#F2F2F0] overflow-hidden">
          <div className="mono text-xs text-center text-neutral-400 mb-8 tracking-widest uppercase">
            Trusted by operators in every vertical
          </div>
          <div className="relative w-full overflow-hidden">
            <div
              className="flex gap-16 whitespace-nowrap"
              style={{ animation: "tickerScroll 40s linear infinite" }}
            >
              {[...verticals, ...verticals].map((name, i) => (
                <span
                  key={i}
                  className="mono text-sm font-medium tracking-wider text-neutral-900/40 hover:text-neutral-900 transition-colors shrink-0 cursor-default"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
