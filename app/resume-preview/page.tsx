import type { Metadata } from "next";
import { resumePreviewSections } from "@/data/content";

export const metadata: Metadata = {
  title: "Resume Preview",
  description: "PDF-style resume preview component UI.",
};

export default function ResumePreviewPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10 dark:bg-zinc-900 sm:px-8">
      <div className="mx-auto max-w-3xl rounded-sm border border-black/10 bg-white p-10 shadow-xl dark:border-white/15 dark:bg-zinc-950">
        <header className="border-b border-black/10 pb-4 dark:border-white/15">
          <h1 className="text-3xl font-semibold tracking-tight">Anish Karki</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Sydney, NSW · anish@student.edu.au · +61 400 000 000</p>
        </header>
        <section className="mt-6 space-y-4 text-sm leading-6">
          {resumePreviewSections.map((section) => (
            <p key={section}>{section}</p>
          ))}
        </section>
      </div>
    </main>
  );
}
