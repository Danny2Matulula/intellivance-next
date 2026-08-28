import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectInquiryForm from "@/components/ProjectInquiryForm";

export const metadata = {
  title: "Start a Conversation",
  description: "Bring Intellivance the messy version of your growth, operations, or technology problem.",
  alternates: { canonical: "https://intellivance.ai/contact" },
};

export default function ContactPage() {
  return (
    <div className="site-shell"><a className="skip-link" href="#main-content">Skip to content</a><Navbar />
      <main id="main-content" className="contact-page">
        <section className="contact-intro"><div className="eyebrow">Start a conversation</div><h1>Bring us the <span>messy version.</span></h1><p>You do not need a finished strategy, specification, or scope. Start with the outcome that matters and where execution is breaking down.</p><a href="mailto:hello@intellivance.ai">hello@intellivance.ai</a></section>
        <section className="contact-form-wrap"><aside><span className="micro-label">Helpful context</span><ol><li><b>What must change?</b><span>The business outcome, decision, or risk.</span></li><li><b>What is stuck?</b><span>The ownership, workflow, data, team, or technology constraint.</span></li><li><b>What has been tried?</b><span>Enough history to avoid repeating the wrong move.</span></li><li><b>Why now?</b><span>The event, deadline, or opportunity creating urgency.</span></li></ol></aside><ProjectInquiryForm /></section>
      </main><Footer />
    </div>
  );
}
