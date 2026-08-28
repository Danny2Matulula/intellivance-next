import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "How Intellivance collects and uses information from this website.",
  alternates: { canonical: "https://intellivance.ai/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <Navbar />
      <main className="legal-wrap">
        <Link className="text-link" href="/">← Back home</Link>
        <h1>Privacy policy</h1>
        <div className="legal-date">Last updated August 28, 2026</div>

        <div className="legal-copy">
          <p>
            This policy explains what information Intellivance collects through
            this website and how we use it. If you have a question, email
            {" "}<a href="mailto:hello@intellivance.ai">hello@intellivance.ai</a>.
          </p>

          <section>
            <h2>1. Information you provide</h2>
            <p>
              We may collect your name, email address, company information,
              phone number, and project details when you contact us, schedule a
              conversation, or otherwise send information to Intellivance.
            </p>
          </section>

          <section>
            <h2>2. Website and analytics data</h2>
            <p>
              We may collect device, browser, IP address, referring page, and
              website-interaction data through cookies and analytics tools. We
              use this information to understand site performance and improve
              our marketing and website experience.
            </p>
          </section>

          <section>
            <h2>3. How we use information</h2>
            <ul>
              <li>To respond to questions and project inquiries</li>
              <li>To provide and improve our services</li>
              <li>To understand website usage and marketing performance</li>
              <li>To protect the website and comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>4. Service providers</h2>
            <p>
              We may share information with service providers that support
              scheduling, hosting, analytics, communications, and site
              operations. We do not sell personal information.
            </p>
          </section>

          <section>
            <h2>5. Your choices</h2>
            <p>
              You can limit cookies through your browser settings. You may also
              contact us to ask about information you previously provided.
            </p>
          </section>

          <section>
            <h2>6. Contact</h2>
            <p>
              Email <a href="mailto:hello@intellivance.ai">hello@intellivance.ai</a>
              {" "}with privacy questions or requests.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
