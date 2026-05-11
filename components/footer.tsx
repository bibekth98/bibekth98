import Link from "next/link";
import { Globe, MessageCircle, Send } from "lucide-react";

const footerLinks = ["Privacy", "Terms", "Contact"];

export function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-10 dark:border-white/10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 text-sm text-zinc-600 dark:text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} GradBridge. All rights reserved.</p>
        <nav aria-label="Footer links" className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <Link key={link} href="#" className="hover:text-black dark:hover:text-white">
              {link}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" aria-label="Twitter" className="hover:text-black dark:hover:text-white">
            <Send className="size-4" aria-hidden="true" />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-black dark:hover:text-white">
            <MessageCircle className="size-4" aria-hidden="true" />
          </a>
          <a href="#" aria-label="Website" className="hover:text-black dark:hover:text-white">
            <Globe className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
