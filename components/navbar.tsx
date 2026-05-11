import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Jobs", href: "#jobs" },
  { label: "Internships", href: "#internships" },
  { label: "Career Guides", href: "#guides" },
];

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
        <ul className="hidden items-center gap-7 text-sm text-zinc-600 md:flex dark:text-zinc-300">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="transition hover:text-black dark:hover:text-white">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <ThemeToggle />
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
