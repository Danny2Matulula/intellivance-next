import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "How We Work",
  description: "An evidence-led operating method from decision through implementation, adoption, and handoff.",
  alternates: { canonical: "https://intellivance.ai/approach" },
};

const steps = [
  { n: "01", title: "Establish the truth", copy: "Read the underlying evidence, map the current operating reality, and separate facts from assumptions before prescribing the move.", output: "Verified current state" },
  { n: "02", title: "Make the decision explicit", copy: "Define the outcome, owner, constraints, economics, risks, and stop conditions so the team knows what it is actually solving.", output: "Decision and operating brief" },
  { n: "03", title: "Design the operating system", copy: "Connect roles, process, data, controls, technology, and management cadence into one executable model.", output: "Operating design and build plan" },
  { n: "04", title: "Install it in working pieces", copy: "Move from artifact to actual behavior through implementation, real-world tests, clear readback, and visible tradeoffs.", output: "Working system and adoption" },
  { n: "05", title: "Operate, measure, hand off", copy: "Stay close enough to resolve failure states, document the system, and leave the team with clear ownership and a repeatable rhythm.", output: "Durable ownership" },
];

export default function ApproachPage() {
  return (
    <div className="site-shell"><a className="skip-link" href="#main-content">Skip to content</a><Navbar />
      <main id="main-content">
        <header className="page-hero page-hero-dark"><div className="eyebrow">How we work</div><h1>Evidence first. <span>Ownership all the way through.</span></h1><p>The work stays grounded in what is verified, what remains unknown, and what the business has actually authorized. That creates speed without pretending uncertainty does not exist.</p></header>
        <section className="method-section section-pad" aria-labelledby="method-title"><div className="section-label">The operating method</div><h2 id="method-title" className="section-title">From ambiguity to a system the team can run.</h2><div className="method-list">{steps.map((step) => <article key={step.n}><span>{step.n}</span><div><h3>{step.title}</h3><p>{step.copy}</p></div><strong>{step.output}</strong></article>)}</div></section>
        <section className="dark-section section-pad" aria-labelledby="models-title"><div className="section-label section-label-light">Engagement models</div><h2 id="models-title" className="section-title section-title-light">Different situations need different levels of ownership.</h2><div className="model-grid"><article><span>SPRINT</span><h3>Decide the move.</h3><p>Focused diagnosis, decision architecture, and a practical plan for a consequential opportunity or operating constraint.</p></article><article><span>EMBEDDED</span><h3>Own the motion.</h3><p>Fractional or interim operating leadership inside the business, accountable for coordination and forward progress.</p></article><article><span>BUILD + ENABLE</span><h3>Install the system.</h3><p>Process, technology, controls, testing, team enablement, and a verified handoff instead of a black-box build.</p></article></div></section>
        <section className="principle-rail section-pad"><div><span>01</span><h3>No unsupported certainty</h3><p>Facts, inferences, and unknowns remain distinct.</p></div><div><span>02</span><h3>No strategy without ownership</h3><p>Every meaningful move has an owner and a close condition.</p></div><div><span>03</span><h3>No technology theater</h3><p>Tools earn their place through operating value.</p></div><div><span>04</span><h3>No disappearing build</h3><p>The work remains visible, testable, and readable.</p></div></section>
        <section className="closing-cta section-pad"><div><span>Need more than a recommendation?</span><h2>Let&apos;s put an owner on the outcome.</h2></div><Link className="button button-light" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></section>
      </main><Footer />
    </div>
  );
}
