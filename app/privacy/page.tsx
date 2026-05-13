import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for GradBridge International Student Life Platform.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <article className="prose prose-zinc dark:prose-invert max-w-3xl">
        <h1>Privacy Policy</h1>
        <p>GradBridge collects account details, listing data, and usage analytics to operate the platform.</p>
        <h2>What we collect</h2>
        <p>Account email, profile metadata from Clerk, listing content you publish, and billing references from Stripe.</p>
        <h2>How we use it</h2>
        <p>We use data to authenticate users, publish listings, process subscriptions, and improve product experience.</p>
        <h2>Third-party processors</h2>
        <p>Clerk (auth), Supabase (database), Stripe (payments), and Plausible (analytics).</p>
        <h2>Your rights</h2>
        <p>Request data export/deletion by contacting support.</p>
      </article>
    </PageShell>
  );
}
