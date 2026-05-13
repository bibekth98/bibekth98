"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/plausible";

const CONSENT_KEY = "gradbridge-cookie-consent";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

type ConsentStatus = "accepted" | "dismissed" | null;

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<ConsentStatus>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "dismissed") {
      setConsent(stored);
    }
  }, []);

  function saveConsent(next: Exclude<ConsentStatus, null>) {
    window.localStorage.setItem(CONSENT_KEY, next);
    setConsent(next);
    trackEvent("cookie_consent_updated", { status: next });
  }

  return (
    <>
      {consent === "accepted" && plausibleDomain ? (
        <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      ) : null}

      {consent === null ? (
        <div className="fixed inset-x-4 bottom-4 z-[60] rounded-2xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-zinc-900 sm:inset-x-auto sm:right-6 sm:max-w-md">
          <p className="text-sm text-zinc-700 dark:text-zinc-200">
            We use cookies for essential preferences and to enable analytics if you accept.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => saveConsent("dismissed")}
              className="rounded-lg border border-black/10 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => saveConsent("accepted")}
              className="rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Accept
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
