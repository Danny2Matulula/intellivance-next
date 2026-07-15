import Link from "next/link";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3 3h11v11H3zM18 3h11v11H18zM3 18h11v11H3z" fill="currentColor" />
      <path d="M18 18h11v11H18z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-link" aria-label="Intellivance home">
          <BrandMark />
          <span>Intellivance</span>
        </Link>
        <div className="nav-links">
          <Link href="/#solutions">Solutions</Link>
          <Link href="/#system-example">Example system</Link>
          <Link href="/#approach">Approach</Link>
        </div>
        <Link className="nav-cta" href="/#contact">
          Discuss a project <span aria-hidden="true">↓</span>
        </Link>
      </nav>
    </header>
  );
}
