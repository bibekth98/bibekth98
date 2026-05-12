"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Building2, PiggyBank, ShoppingBag, Tags } from "lucide-react";
import type { ComponentType } from "react";
import type { PlatformModuleIcon } from "@/data/content";

const iconMap: Record<PlatformModuleIcon, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  discounts: Tags,
  accommodation: Building2,
  marketplace: ShoppingBag,
  budget: PiggyBank,
  guides: BookOpen,
};

type PlatformFeatureCardProps = {
  title: string;
  description: string;
  icon: PlatformModuleIcon;
  href: string;
  cta: string;
};

export function PlatformFeatureCard({ title, description, icon, href, cta }: PlatformFeatureCardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-white/15 dark:bg-zinc-900"
    >
      <div className="mb-4 inline-flex rounded-xl border border-black/10 bg-zinc-50 p-3 dark:border-white/15 dark:bg-zinc-800">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
      <Link
        href={href}
        className="mt-5 inline-flex rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {cta}
      </Link>
    </motion.article>
  );
}
