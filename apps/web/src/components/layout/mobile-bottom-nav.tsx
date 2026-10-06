"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Images, Users, BookOpen } from "lucide-react";
import "./mobile-bottom-nav.css";

const destinations = [
  { label: "Home", href: "/", icon: Home, view: "home" },
  {
    label: "Memories",
    href: "/studio?view=memories",
    icon: Images,
    view: "memories",
  },
  { label: "People", href: "/studio?view=people", icon: Users, view: "people" },
  { label: "Book", href: "/studio?view=book", icon: BookOpen, view: "book" },
] as const;

function NavigationLinks() {
  const pathname = usePathname();
  const params = useSearchParams();
  const selected =
    pathname === "/"
      ? "home"
      : pathname === "/studio"
        ? params.get("view") || "memories"
        : "";
  return destinations.map(({ label, href, icon: Icon, view }) => (
    <Link
      key={view}
      href={href}
      className="dock-item"
      aria-current={selected === view ? "page" : undefined}
    >
      <Icon size={21} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  ));
}

export function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile quick navigation">
      <Suspense
        fallback={destinations.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} className="dock-item">
            <Icon size={21} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      >
        <NavigationLinks />
      </Suspense>
    </nav>
  );
}
