import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbientMotion from "@/components/AmbientMotion";
import MotionBlueprint from "@/components/MotionBlueprint";
import MotionProcess from "@/components/MotionProcess";
import OperationsPreview from "@/components/OperationsPreview";
import SystemFlowMap from "@/components/SystemFlowMap";
import VerificationRail from "@/components/VerificationRail";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";

const services = [
  {
    number: "01",
    title: "Custom web applications",
    description:
      "Purpose-built products for workflows, customer experiences, and business models that standard software cannot support.",
    examples: "Operations platforms / SaaS products / Workflow systems",
    tone: "blue",
  },
  {
    number: "02",
    title: "Internal tools",
    description:
      "Focused software that gives your team one place to manage approvals, reporting, records, and daily decisions.",
    examples: "Admin panels / Dashboards / Planning tools",
    tone: "paper",
  },
  {
    number: "03",
    title: "Client portals",
    description:
      "Secure, branded spaces where customers and partners can share information, track work, and take action.",
    examples: "Self-service / Collaboration / Account experiences",
    tone: "ink",
  },
  {
    number: "04",
    title: "Integrations and data flows",
    description:
      "Connect the systems you already depend on so information moves cleanly and your team works from the same facts.",
    examples: "APIs / Data pipelines / System connections",
    tone: "paper",
  },
  {
    number: "05",
    title: "Software modernization",
    description:
      "Repair, extend, or replace software that has become slow to change, difficult to trust, or expensive to maintain.",
    examples: "Rebuilds / Migrations / Product extensions",
    tone: "signal",
  },
];

const process = [
  {
    number: "01",
    title: "Define the real problem",
    description:
      "We map the workflow, constraints, users, and success measure before choosing technology.",
    output: "Requirements + build plan",
  },
  {
    number: "02",
    title: "Design the system",
    description:
      "We turn the messy process into a clear product model and test the important interactions early.",
    output: "Prototype + technical direction",
  },
  {
    number: "03",
    title: "Build in working pieces",
    description:
      "You see the software take shape in usable increments, with decisions made while they are still cheap to change.",
    output: "Testable releases",
  },
  {
    number: "04",
    title: "Launch with a clear next step",
    description:
      "We prepare the production release, document the system, and define what support or iteration comes next.",
    output: "Production software + handoff",
  },
];

const faq = [
  {
    question: "What kind of company is Intellivance?",
    answer:
      "Intellivance is a custom software company. We help businesses define, design, and build software when an off-the-shelf product does not fit the work.",
  },
  {
    question: "Do you only build with AI?",
    answer:
      "No. AI is one possible tool, not the offer. We use it only when it solves a defined product problem better than a simpler approach.",
  },
  {
    question: "Do we need a finished specification?",
    answer:
      "No. A rough workflow, recurring bottleneck, product idea, or aging system is enough to start the conversation. Defining the right build is part of the work.",
  },
  {
    question: "Can you work with our current software?",
    answer:
      "Yes. A new build can sit beside, connect to, or gradually replace the tools you already use. The right path depends on the system and the risk of changing it.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
      <path d="M4 16 16 4M7 4h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <AmbientMotion />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow reveal-in">Custom software / product engineering</div>
            <h1 id="hero-title" className="hero-title reveal-in delay-1">
              Build what&apos;s next.
            </h1>
            <p className="hero-intro reveal-in delay-2">
              Intellivance designs and builds web apps, internal tools, portals,
              and connected systems around the way your team actually works.
            </p>
            <div className="hero-actions reveal-in delay-3">
              <a className="button button-primary" href="#contact">
                Discuss a project <ArrowIcon />
              </a>
              <a className="text-link" href="#solutions">
                See what we build <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <MotionBlueprint />
        </section>

        <div className="capability-strip" role="list" aria-label="Core capabilities">
          <span role="listitem">Product strategy</span>
          <span role="listitem">Experience design</span>
          <span role="listitem">Software engineering</span>
          <span role="listitem">Systems integration</span>
        </div>

        <section className="fit-section section-pad" aria-labelledby="fit-title">
          <div className="section-label">When custom software makes sense</div>
          <div className="fit-layout">
            <h2 id="fit-title" className="section-title section-title-large">
              Off-the-shelf gets you 80% there.
              <span>The last 20% is usually the part that runs the business.</span>
            </h2>
            <p className="section-lede">
              The gap gets filled with duplicate entry, brittle handoffs, and a
              spreadsheet everyone is afraid to touch. Custom software makes
              sense when the workaround has become part of the job.
            </p>
          </div>
          <div className="problem-grid">
            <article>
              <span>01</span>
              <h3>One workflow. Five tabs.</h3>
              <p>Your team moves the same information between tools just to finish one piece of work.</p>
            </article>
            <article>
              <span>02</span>
              <h3>The spreadsheet became the product.</h3>
              <p>A file built for tracking now carries approvals, logic, history, and operational risk.</p>
            </article>
            <article>
              <span>03</span>
              <h3>The system stopped changing.</h3>
              <p>Every new requirement creates another exception because the software no longer matches the business.</p>
            </article>
          </div>
        </section>

        <section id="solutions" className="solutions-section" aria-labelledby="solutions-title">
          <div className="solutions-heading section-pad">
            <div className="section-label section-label-light">What we build</div>
            <h2 id="solutions-title" className="section-title section-title-light">
              Software shaped around the work.
            </h2>
            <p>
              Start with the business problem. Then choose the smallest system
              that solves it well and can keep growing when it needs to.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article key={service.number} className={`service-card tone-${service.tone}`}>
                <div className="service-number">{service.number}</div>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
                <div className="service-examples">{service.examples}</div>
              </article>
            ))}
          </div>
        </section>

        <div id="system-example" className="system-example-wrap">
          <OperationsPreview />
          <div className="system-flow-shell section-pad">
            <SystemFlowMap />
          </div>
          <VerificationRail />
        </div>

        <section id="approach" className="process-section section-pad" aria-labelledby="process-title">
          <div className="process-intro">
            <div className="section-label">How we work</div>
            <h2 id="process-title" className="section-title">
              Make the problem clear. Make the build visible.
            </h2>
            <p>
              Good software starts with shared understanding. Each stage ends
              with something concrete, so the project never disappears into a
              black box.
            </p>
          </div>
          <MotionProcess process={process} />
        </section>

        <section className="principles-section" aria-labelledby="principles-title">
          <div className="principles-statement">
            <div className="section-label section-label-light">The working style</div>
            <h2 id="principles-title">No mystery layer between the problem and the product.</h2>
          </div>
          <div className="principles-grid">
            <article>
              <span>Clarity before code</span>
              <p>We challenge the request, map the edge cases, and agree on what success means first.</p>
            </article>
            <article>
              <span>Show the work</span>
              <p>Working software, plain-language decisions, and visible tradeoffs throughout the build.</p>
            </article>
            <article>
              <span>Technology with a reason</span>
              <p>AI, APIs, and new frameworks earn their place by solving the problem—not by appearing in the pitch.</p>
            </article>
          </div>
        </section>

        <section id="studio" className="faq-section section-pad" aria-labelledby="faq-title">
          <div className="faq-intro">
            <div className="section-label">A few direct answers</div>
            <h2 id="faq-title" className="section-title">Before we talk.</h2>
          </div>
          <div className="faq-list">
            {faq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.question}
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <div className="contact-layout">
            <div className="contact-copy">
              <div className="contact-kicker">Have a workflow, system, or product in mind?</div>
              <h2 id="contact-title">Bring us the messy version.</h2>
              <p>
                A process held together by spreadsheets. A product idea that needs
                shape. A tool that stopped scaling. Start there.
              </p>
              <a className="contact-email" href="mailto:hello@intellivance.ai">
                Or email hello@intellivance.ai
              </a>
            </div>
            <ProjectInquiryForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
