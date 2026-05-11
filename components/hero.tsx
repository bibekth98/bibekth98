"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Sparkles, Target } from "lucide-react";

export function Hero() {
  return (
    <section className="px-6 pt-16 pb-12 sm:px-8 sm:pt-24" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold tracking-wide text-zinc-700 shadow-sm dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-200">
            Career platform for international students in Australia
          </p>
          <h1 id="hero-heading" className="text-4xl font-semibold tracking-tight text-black dark:text-white sm:text-5xl">
            Build your resume, apply for jobs, and start your career in Australia.
          </h1>
          <p className="mt-5 max-w-xl text-base text-zinc-600 dark:text-zinc-300 sm:text-lg">
            GradBridge helps international students create professional resumes, write cover letters, and discover internships and student-friendly jobs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/resume-builder"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Build Resume
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/saved-jobs"
              className="inline-flex rounded-xl border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/20 dark:text-white dark:hover:bg-zinc-800"
            >
              Explore Jobs
            </Link>
          </div>
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-white/15 dark:bg-zinc-900/70"
          aria-label="Career progress preview"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/15 dark:bg-zinc-800">
              <p className="text-xs text-zinc-500">Resume score</p>
              <p className="mt-1 text-2xl font-semibold">86/100</p>
              <div className="mt-3 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div className="h-full w-[86%] rounded-full bg-black dark:bg-white" />
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/15 dark:bg-zinc-800">
              <p className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Target className="size-3" /> Job activity
              </p>
              <p className="mt-1 text-2xl font-semibold">12</p>
              <p className="text-sm text-zinc-500">Applications sent this month</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/15 dark:bg-zinc-800">
              <p className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <FileText className="size-3" /> Resume preview
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="h-2 w-3/4 rounded bg-zinc-300 dark:bg-zinc-600" />
                <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-2 w-5/6 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4 dark:border-white/15 dark:bg-zinc-800">
              <p className="inline-flex items-center gap-2 text-xs text-zinc-500">
                <Sparkles className="size-3" /> Cover letter
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                “I am excited to bring my customer service and communication skills to your team...”
              </p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
