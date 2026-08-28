import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PracticeTabs from "@/components/PracticeTabs";
import Link from "next/link";

export const metadata = {
  title: "Practices",
  description: "Revenue and growth, operations and transformation, and AI and technology enablement from one operating partner.",
  alternates: { canonical: "https://intellivance.ai/practices" },
};

export default function PracticesPage() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a><Navbar />
      <main id="main-content">
        <header className="page-hero"><div className="eyebrow">Practices</div><h1>Choose the constraint. <span>Not the buzzword.</span></h1><p>Tap between the three practice areas. Each starts with a business outcome and pulls in only the strategy, process, data, automation, or software the work actually requires.</p></header>
        <section className="tabs-section section-pad"><PracticeTabs /></section>
        <section className="capability-stack section-pad">
          <div><div className="section-label">The capability stack</div><h2 className="section-title">Technology supports the operating model. It does not replace one.</h2></div>
          <div className="stack-list">{["Executive and commercial leadership", "Operating design and process ownership", "Research, data, and decision support", "Marketing, creative, and growth execution", "CRM, automation, integrations, and software", "Training, controls, and handoff"].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</div>
        </section>
        <section className="closing-cta section-pad"><div><span>Not sure which practice fits?</span><h2>Start with the outcome.</h2></div><Link className="button button-light" href="/contact">Tell us what is stuck <span aria-hidden="true">↗</span></Link></section>
      </main><Footer />
    </div>
  );
}
