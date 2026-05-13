import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to manage listings, subscriptions, and your GradBridge profile.",
};

export default function SignInPage() {
  return (
    <PageShell>
      <div className="flex justify-center">
        <SignIn forceRedirectUrl="/admin" signUpUrl="/sign-up" />
      </div>
    </PageShell>
  );
}
