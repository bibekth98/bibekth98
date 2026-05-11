import type { Metadata } from "next";
import { ArrowUpRight, Bell, CalendarCheck, Search } from "lucide-react";
import { dashboardStats, jobs } from "@/data/content";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Student dashboard UI preview with progress and applications.",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Good morning</p>
            <h1 className="text-3xl font-semibold tracking-tight">Student Dashboard</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2 text-sm font-medium shadow-sm dark:border-white/20 dark:bg-zinc-900">
            <Bell className="size-4" aria-hidden="true" />
            Notifications
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/15 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">Recent opportunities</h2>
            <div className="mt-4 space-y-4">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.role} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 p-4 dark:border-white/15">
                  <div>
                    <p className="font-medium">{job.role}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{job.company} · {job.location}</p>
                  </div>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black">
                    View
                    <ArrowUpRight className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
            <h2 className="text-xl font-semibold">This week</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="inline-flex items-center gap-2">
                <CalendarCheck className="size-4" />
                Mock interview prep session
              </li>
              <li className="inline-flex items-center gap-2">
                <Search className="size-4" />
                Apply to 5 new casual jobs
              </li>
              <li className="inline-flex items-center gap-2">
                <CalendarCheck className="size-4" />
                Resume review with mentor
              </li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
