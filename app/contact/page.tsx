import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Contact GradBridge support or submit a bug report.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const bugTitle = encodeURIComponent("Bug report: ");
  const bugBody = encodeURIComponent("## What happened\n\n## Expected behavior\n\n## Steps to reproduce\n");

  return (
    <PageShell>
      <section className="max-w-2xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">Contact & Support</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Email us at <a className="underline" href={`mailto:${env.supportEmail}`}>{env.supportEmail}</a>
        </p>

        <form action="/api/support" method="post" className="grid gap-3 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-900">
          <input required name="name" placeholder="Name" className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          <input required type="email" name="email" placeholder="Email" className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          <textarea required name="message" placeholder="How can we help?" className="min-h-28 rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/10" />
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black">
            Submit support request
          </button>
        </form>
        {status === "received" ? (
          <p className="text-sm text-green-600">Support request captured. We will reply via email.</p>
        ) : null}
        {status === "invalid" ? <p className="text-sm text-red-600">Please complete every field before submitting.</p> : null}

        <a
          href={`${env.githubIssuesUrl}?title=${bugTitle}&body=${bugBody}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-lg border border-black/10 px-4 py-2 text-sm dark:border-white/10"
        >
          Report a bug on GitHub Issues
        </a>
      </section>
    </PageShell>
  );
}
