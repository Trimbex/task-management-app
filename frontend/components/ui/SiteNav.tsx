"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/tasks", label: "Tasks" },
  { href: "/activity", label: "Activity" },
  { href: "/reports", label: "Reports" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main">
        <Link href="/" className="brand">
          Task Manager
        </Link>
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "nav-link active" : "nav-link"}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
