"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/plausible";

async function requestJson(url: string, body?: Record<string, string>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body ?? {}),
  });

  const payload = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error ?? "Unable to continue");
  }

  window.location.href = payload.url;
}

export function BillingActions({
  monthlyPriceId,
  yearlyPriceId,
}: {
  monthlyPriceId?: string;
  yearlyPriceId?: string;
}) {
  const [error, setError] = useState("");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={!monthlyPriceId}
          onClick={async () => {
            setError("");
            try {
              trackEvent("checkout_started", { plan: "monthly" });
              await requestJson("/api/billing/checkout", { priceId: monthlyPriceId ?? "" });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Checkout failed");
            }
          }}
          className="rounded-xl bg-black px-4 py-2 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Upgrade monthly
        </button>
        <button
          type="button"
          disabled={!yearlyPriceId}
          onClick={async () => {
            setError("");
            try {
              trackEvent("checkout_started", { plan: "yearly" });
              await requestJson("/api/billing/checkout", { priceId: yearlyPriceId ?? "" });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Checkout failed");
            }
          }}
          className="rounded-xl border border-black/10 px-4 py-2 text-sm disabled:opacity-50 dark:border-white/10"
        >
          Upgrade yearly
        </button>
      </div>
      <button
        type="button"
        onClick={async () => {
          setError("");
          try {
            trackEvent("billing_portal_opened");
            await requestJson("/api/billing/portal");
          } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to open customer portal");
          }
        }}
        className="rounded-xl border border-black/10 px-4 py-2 text-sm dark:border-white/10"
      >
        Manage subscription (upgrade / downgrade / cancel)
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
