import Link from "next/link";
import { Globe, MessageCircle, Send } from "lucide-react";
import { env } from "@/lib/env";

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
  { label: "Bug report", href: env.githubIssuesUrl },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-10 dark:border-white/10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-zinc-600 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} GradBridge. All rights reserved.</p>
        <nav aria-label="Footer links" className="flex flex-wrap items-center gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="hover:text-black dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href={env.githubIssuesUrl} target="_blank" rel="noreferrer" aria-label="Report bug" className="hover:text-black dark:hover:text-white">
            <Send className="size-4" aria-hidden="true" />
          </a>
          <a href={`mailto:${env.supportEmail}`} aria-label="Support email" className="hover:text-black dark:hover:text-white">
            <MessageCircle className="size-4" aria-hidden="true" />
          </a>
          <a href={env.siteUrl} aria-label="Website" className="hover:text-black dark:hover:text-white">
            <Globe className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
