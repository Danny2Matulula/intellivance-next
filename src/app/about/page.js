import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About",
  description: "Intellivance is an operating partner built for business problems that cross strategy, operations, growth, and technology.",
  alternates: { canonical: "https://intellivance.ai/about" },
};

export default function AboutPage() {
  return (
    <div className="site-shell"><a className="skip-link" href="#main-content">Skip to content</a><Navbar />
      <main id="main-content">
        <header className="page-hero about-hero"><div className="eyebrow">About Intellivance</div><h1>Built for problems that <span>refuse to stay in one department.</span></h1><p>Growth problems become operations problems. Operations problems become technology problems. Technology problems expose ownership problems. Intellivance exists to work across those boundaries.</p></header>
        <section className="statement-section section-pad"><div className="section-label">What we are</div><div className="statement-grid"><h2 className="section-title">An operating partner—not a report factory or a development shop.</h2><div className="statement-copy"><p>We combine executive-level commercial thinking, practical operating design, modern AI and technology capability, and hands-on execution.</p><p>The goal is not to produce more activity. It is to create a clearer decision, a stronger system, and a business that can keep moving after the engagement.</p></div></div></section>
        <section className="contrast-section"><article><span>Not just advisory</span><h2>Recommendations are connected to ownership, implementation, and a close condition.</h2></article><article><span>Not just software</span><h2>Code, automation, and AI are used only when they improve how the business operates.</h2></article></section>
        <section className="founder-section section-pad"><div><div className="section-label">Founder-led</div><h2 className="section-title">Operator experience, carried into every engagement.</h2></div><div className="founder-copy"><h3>Danny Matulula</h3><p>Danny is a commercial and operating partner working across enterprise commercialization, agency transformation, frontline sales operations, government contracting, and AI-enabled execution.</p><p>That range is the point. The strongest operating moves rarely belong to only sales, only operations, or only technology.</p><Link className="text-link" href="/contact">Work with Intellivance <span aria-hidden="true">↗</span></Link></div></section>
        <section className="context-band"><div><span className="section-label section-label-light">The thesis</span><h2>A business should not have to choose between strategy that understands the problem and execution that can actually change it.</h2></div><p>Intellivance is designed to carry both.</p></section>
      </main><Footer />
    </div>
  );
}
