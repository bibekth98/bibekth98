import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const coreLinks = [
  { label: "Features", href: "#features" },
  { label: "Jobs", href: "#jobs" },
  { label: "Internships", href: "#internships" },
  { label: "Career Guides", href: "#guides" },
];

const moduleLinks = [
  { label: "Discounts", href: "/discounts" },
  { label: "Accommodation", href: "/accommodation" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Budget", href: "/budget" },
  { label: "Guides", href: "/guides" },
];

const navLinks = [...coreLinks, ...moduleLinks];
const navAriaLabel = (href: string, label: string) =>
  href.startsWith("#") ? `Jump to ${label} section` : `Go to ${label} page`;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="text-lg font-semibold tracking-tight text-black dark:text-white">
          GradBridge
        </Link>
        <ul className="hidden items-center gap-5 text-sm text-zinc-600 md:flex dark:text-zinc-300">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                aria-label={navAriaLabel(link.href, link.label)}
                className="transition hover:text-black dark:hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <details className="relative md:hidden">
            <summary
              aria-label="Toggle navigation menu"
              className="cursor-pointer rounded-lg border border-black/15 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:border-black hover:text-black dark:border-white/20 dark:text-zinc-300 dark:hover:border-white dark:hover:text-white"
            >
              Menu
            </summary>
            <ul className="absolute right-0 mt-2 w-56 space-y-1 rounded-xl border border-black/10 bg-white p-2 text-sm shadow-lg dark:border-white/15 dark:bg-zinc-900">
              {navLinks.map((link) => (
                <li key={`mobile-${link.label}`}>
                  <Link
                    href={link.href}
                    aria-label={navAriaLabel(link.href, link.label)}
                    className="block rounded-lg px-3 py-2 text-zinc-700 transition hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
          <Link
            href="/auth"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
