"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
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
          <span>Intellivance</span>
        </Link>
        <div className="nav-links nav-tabs">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </div>
        <Link className="nav-cta" href="/contact">
          Let&apos;s talk <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
