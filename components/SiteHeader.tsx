"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Compass, Github, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/simulator", label: "Simulator" },
  { href: "/engine", label: "Engine" },
  { href: "/open-human-pilots", label: "Pilots" },
  { href: "/researchers", label: "Researchers" },
  { href: "/architecture", label: "Architecture" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="w-full bg-[#0a0f18] border-b border-slate-800/70 text-slate-300">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-brand-teal"
          onClick={() => setMenuOpen(false)}
        >
          <Compass className="h-5 w-5 text-brand-teal" />
          <span className="whitespace-nowrap">Executive Function OS</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com/Executive-Function-OS/percolation-import"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="text-slate-400 transition-colors hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          <Link
            href="/quick-start"
            className="flex items-center gap-2 rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            <Activity className="h-4 w-4" /> Get Your Score
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="rounded p-2 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <div className="border-t border-slate-800/70 px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/Executive-Function-OS/percolation-import"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
            <Link
              href="/quick-start"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <Activity className="h-4 w-4" /> Get Your Score
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
