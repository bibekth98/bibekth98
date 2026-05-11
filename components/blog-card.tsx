"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

type BlogCardProps = {
  title: string;
  excerpt: string;
  readTime: string;
};

export function BlogCard({ title, excerpt, readTime }: BlogCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/15 dark:bg-zinc-900"
    >
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">{readTime}</p>
      <h3 className="mt-3 text-lg font-semibold text-black dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{excerpt}</p>
      <a
        href="#"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-black hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:text-white"
      >
        Read guide
        <ArrowRight className="size-4" aria-hidden="true" />
      </a>
    </motion.article>
  );
}
