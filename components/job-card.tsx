"use client";

import { motion } from "framer-motion";
import { Building2, MapPin } from "lucide-react";

type JobCardProps = {
  role: string;
  company: string;
  location: string;
  type: string;
};

export function JobCard({ role, company, location, type }: JobCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/15 dark:bg-zinc-900"
    >
      <h3 className="text-lg font-semibold text-black dark:text-white">{role}</h3>
      <div className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
        <p className="inline-flex items-center gap-2">
          <Building2 className="size-4" aria-hidden="true" />
          {company}
        </p>
        <p className="inline-flex items-center gap-2">
          <MapPin className="size-4" aria-hidden="true" />
          {location}
        </p>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200">
          {type}
        </span>
        <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200">
          Apply
        </button>
      </div>
    </motion.article>
  );
}
