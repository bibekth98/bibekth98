"use client";

import { motion } from "framer-motion";
import { CalendarClock, MapPin } from "lucide-react";

type InternshipCardProps = {
  role: string;
  company: string;
  location: string;
  duration: string;
};

export function InternshipCard({ role, company, location, duration }: InternshipCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-white/15 dark:bg-zinc-900"
    >
      <h3 className="text-lg font-semibold text-black dark:text-white">{role}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{company}</p>
      <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
        <p className="inline-flex items-center gap-2">
          <MapPin className="size-4" aria-hidden="true" />
          {location}
        </p>
        <p className="inline-flex items-center gap-2">
          <CalendarClock className="size-4" aria-hidden="true" />
          {duration}
        </p>
      </div>
      <button className="mt-5 rounded-xl border border-black/15 px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:text-white dark:hover:bg-white dark:hover:text-black">
        View Internship
      </button>
    </motion.article>
  );
}
