import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { BillingActions } from "@/components/billing-actions";
import { PageShell } from "@/components/page-shell";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Manage subscriptions with Stripe Checkout and customer portal.",
};

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <PageShell>
      <section className="max-w-2xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">GradBridge Pro</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Upgrade with Stripe checkout. Use customer portal for upgrade, downgrade, and cancellation lifecycle.
        </p>
        {userId ? (
          <BillingActions monthlyPriceId={env.stripeProMonthlyPriceId} yearlyPriceId={env.stripeProYearlyPriceId} />
        ) : (
          <p className="text-sm text-zinc-500">Sign in first to start checkout.</p>
        )}
      </section>
    </PageShell>
  );
}
