import type { Metadata } from "next";
import { templates } from "@/data/content";

export const metadata: Metadata = {
  title: "Resume Builder",
  description: "Resume builder UI preview with editable sections and template selector.",
};

export default function ResumeBuilderPage() {
  return (
    <main className="min-h-screen px-6 py-8 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
          <h1 className="text-2xl font-semibold tracking-tight">Resume Builder</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Choose a template and update your details live.</p>
          <div className="mt-6 space-y-3">
            {templates.map((template, index) => (
              <button
                key={template}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  index === 1
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/15 hover:bg-zinc-100 dark:border-white/20 dark:hover:bg-zinc-800"
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-zinc-900">
          <h2 className="text-xl font-semibold">Preview editor</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Full Name</span>
              <input className="w-full rounded-xl border border-black/15 px-3 py-2.5 outline-none ring-black/20 focus:ring-2 dark:border-white/20" defaultValue="Anish Karki" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block font-medium">Headline</span>
              <input className="w-full rounded-xl border border-black/15 px-3 py-2.5 outline-none ring-black/20 focus:ring-2 dark:border-white/20" defaultValue="Business Analytics Student" />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block font-medium">Professional Summary</span>
              <textarea className="h-28 w-full rounded-xl border border-black/15 px-3 py-2.5 outline-none ring-black/20 focus:ring-2 dark:border-white/20" defaultValue="Detail-oriented international student with customer support and internship experience, seeking part-time and graduate opportunities in Australia." />
            </label>
          </div>
          <button className="mt-6 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black">
            Save Resume Draft
          </button>
        </section>
      </div>
    </main>
  );
}
