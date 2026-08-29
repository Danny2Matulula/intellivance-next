"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BrandMark() {
  return (
    <svg className="brand-mark" viewBox="145 90 110 340" aria-hidden="true">
      <polygon points="200,110 232,165 168,165" fill="currentColor" />
      <rect x="173" y="225" width="54" height="30" rx="4" fill="currentColor" opacity=".48" />
      <rect x="176" y="265" width="48" height="30" rx="4" fill="currentColor" opacity=".62" />
      <rect x="179" y="305" width="42" height="30" rx="4" fill="currentColor" opacity=".74" />
      <rect x="182" y="345" width="36" height="30" rx="4" fill="currentColor" opacity=".86" />
      <rect x="185" y="385" width="30" height="30" rx="4" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/practices", label: "Practices" },
    { href: "/approach", label: "How we work" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link href="/" className="brand-link" aria-label="Intellivance home">
          <BrandMark />
          <span>INTELLIVANCE</span>
        </Link>
        <div className="nav-links nav-tabs">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link className="nav-cta" href="/contact" aria-label="Start a conversation">
          <span className="nav-cta-label">Start a conversation</span>
          <span className="nav-cta-short" aria-hidden="true">Start</span>
          <span className="nav-cta-icon" aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
