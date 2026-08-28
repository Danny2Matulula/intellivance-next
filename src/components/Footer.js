import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <span className="footer-wordmark">Intellivance</span>
        <p>Operating partner for growth and transformation.</p>
      </div>
      <div className="footer-links">
        <div>
          <span>Explore</span>
          <Link href="/practices">Practices</Link>
          <Link href="/approach">How we work</Link>
          <Link href="/about">About</Link>
        </div>
        <div>
          <span>Connect</span>
          <Link href="/contact">Start a conversation</Link>
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
        <span>Strategy / systems / execution</span>
      </div>
    </footer>
  );
}
