import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for using GradBridge.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <article className="prose prose-zinc dark:prose-invert max-w-3xl">
        <h1>Terms and Conditions</h1>
        <p>By using GradBridge, you agree to these terms.</p>
        <h2>Account usage</h2>
        <p>Users must provide accurate information and maintain account security.</p>
        <h2>Listings</h2>
        <p>Admins are responsible for accuracy and legality of job, accommodation, and marketplace posts.</p>
        <h2>Subscriptions</h2>
        <p>Paid plans renew according to Stripe billing settings. Manage upgrade, downgrade, or cancellation in the customer portal.</p>
        <h2>Limitation of liability</h2>
        <p>GradBridge is provided as-is to the extent permitted by law.</p>
      </article>
    </PageShell>
  );
}
