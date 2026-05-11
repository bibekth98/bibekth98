import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { savedJobs } from "@/data/content";

export const metadata: Metadata = {
  title: "Saved Jobs",
  description: "Saved jobs UI preview for international students.",
};

export default function SavedJobsPage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Saved Jobs</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">Track opportunities and apply when you&apos;re ready.</p>
        </header>
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <article
              key={job.role}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-900"
            >
              <div>
                <p className="text-lg font-semibold">{job.role}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {job.company} · {job.location} · {job.type}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-xl border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20">View</button>
                <button className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black">
                  <Heart className="size-4" />
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
