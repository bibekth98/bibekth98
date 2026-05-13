import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your GradBridge account with email verification and OAuth options.",
};

export default function SignUpPage() {
  return (
    <PageShell>
      <div className="flex justify-center">
        <SignUp forceRedirectUrl="/admin" signInUrl="/sign-in" />
      </div>
    </PageShell>
  );
}
