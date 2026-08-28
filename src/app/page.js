import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const practices = [
  { number: "01", title: "Revenue & Growth", copy: "Positioning, offers, pipeline, pricing, proposals, account growth, and the operating cadence behind predictable execution." },
  { number: "02", title: "Operations & Transformation", copy: "Ownership, workflows, management visibility, service delivery, transitions, and the systems that keep work from disappearing." },
  { number: "03", title: "AI & Technology Enablement", copy: "Automation, data, integrations, internal tools, and software applied to a defined operating constraint." },
];

const engagements = [
  { title: "Strategic sprint", copy: "A focused decision, a verified current state, and an executable plan when the move matters more than a long study." },
  { title: "Embedded operating partner", copy: "Hands-on leadership inside the work when the business needs ownership, coordination, and sustained forward motion." },
  { title: "Build & enable", copy: "Install the process, technology, controls, and team rhythm—then prove it works and make the handoff clear." },
];

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content">
        <section className="hero operator-hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow">Strategy / systems / execution</div>
            <h1 id="hero-title" className="hero-title">Build the operating system <span>behind growth.</span></h1>
            <p className="hero-intro">Intellivance works with leaders when growth has outpaced the way the business operates. We clarify the decision, redesign the motion, and install the systems that make execution stick.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/practices">Explore our practices <span aria-hidden="true">↗</span></Link>
              <Link className="text-link" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="operator-hero-panel" aria-label="The layers of an operating system">
            <div className="operator-panel-label">Operating system / 001</div>
            {["Decision", "Ownership", "Process", "Data", "Automation", "Software"].map((layer, index) => <div className="operator-layer" key={layer}><span>{String(index + 1).padStart(2, "0")}</span><strong>{layer}</strong></div>)}
            <div className="operator-output"><span>Output</span><strong>Clear execution</strong></div>
          </div>
        </section>

        <div className="capability-strip" role="list" aria-label="Operating capabilities">
          <span role="listitem">Commercial strategy</span><span role="listitem">Operating transformation</span><span role="listitem">AI enablement</span><span role="listitem">Hands-on execution</span>
        </div>

        <section className="statement-section section-pad" aria-labelledby="statement-title">
          <div className="section-label">The model</div>
          <div className="statement-grid">
            <h2 id="statement-title" className="section-title">Strategy is only useful when the business can run it.</h2>
            <div className="statement-copy"><p>Traditional consultants can stop at the recommendation. Builders can stop at launch. Intellivance works across the decision, the operating design, and the implementation required to make the change usable.</p><p>Software is one capability inside that model—not the company category.</p></div>
          </div>
        </section>

        <section className="dark-section section-pad" aria-labelledby="practices-title">
          <div className="section-head-row"><div><div className="section-label section-label-light">Our practices</div><h2 id="practices-title" className="section-title section-title-light">Three ways to create leverage.</h2></div><Link className="text-link text-link-light" href="/practices">Open the practice tabs <span aria-hidden="true">↗</span></Link></div>
          <div className="practice-card-grid">
            {practices.map((practice) => <Link href="/practices" className="practice-card" key={practice.number}><span>{practice.number}</span><h3>{practice.title}</h3><p>{practice.copy}</p><b aria-hidden="true">↗</b></Link>)}
          </div>
        </section>

        <section className="engagement-section section-pad" aria-labelledby="engagement-title">
          <div className="section-label">Ways to engage</div>
          <div className="statement-grid"><h2 id="engagement-title" className="section-title">Use the amount of operating ownership the situation requires.</h2><p className="section-lede">A clear sprint when the decision is the constraint. An embedded partner when execution needs an owner. A build-and-enable engagement when the new system must be installed and adopted.</p></div>
          <div className="engagement-grid">{engagements.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
        </section>

        <section className="context-band" aria-labelledby="context-title">
          <div><span className="section-label section-label-light">Built from operating reality</span><h2 id="context-title">Enterprise commercialization. Agency transformation. Frontline sales operations. Government programs.</h2></div>
          <p>The environments change. The job stays consistent: establish the facts, create ownership, design the system, and move the work forward.</p>
        </section>

        <section className="closing-cta section-pad"><div><span>Have a growth or operating problem that refuses to stay in one department?</span><h2>Bring us the messy version.</h2></div><Link className="button button-light" href="/contact">Start a conversation <span aria-hidden="true">↗</span></Link></section>
      </main>
      <Footer />
    </div>
  );
}
