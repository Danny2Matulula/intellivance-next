import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span>Intellivance</span>
        <p>Custom software for work that does not fit in a box.</p>
      </div>
      <div className="footer-links">
        <div>
          <span>Explore</span>
          <Link href="/#solutions">Solutions</Link>
          <Link href="/#approach">Approach</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <div>
          <span>Connect</span>
          <a href="mailto:hello@intellivance.ai">Email</a>
          <a href="https://www.linkedin.com/company/intellivance-ai/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
        <div>
          <span>Legal</span>
          <Link href="/privacy-policy">Privacy</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Intellivance</span>
        <span>Software solutions / United States</span>
      </div>
    </footer>
  );
}
