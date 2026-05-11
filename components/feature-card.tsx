"use client";

import { motion } from "framer-motion";
import { BookOpen, BriefcaseBusiness, ClipboardList, FileCheck, FileText, GraduationCap } from "lucide-react";

const iconMap = {
  resume: FileText,
  cover: FileCheck,
  jobs: BriefcaseBusiness,
  internships: GraduationCap,
  guides: BookOpen,
  templates: ClipboardList,
} as const;

type FeatureCardProps = {
  title: string;
  description: string;
  icon: keyof typeof iconMap;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/15 dark:bg-zinc-900"
    >
      <div className="mb-4 inline-flex rounded-xl border border-black/10 bg-zinc-50 p-3 dark:border-white/15 dark:bg-zinc-800">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
    </motion.article>
  );
}
