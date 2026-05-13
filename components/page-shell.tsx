import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="px-6 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
