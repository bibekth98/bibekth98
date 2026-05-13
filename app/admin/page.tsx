import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { PageShell } from "@/components/page-shell";
import { env } from "@/lib/env";
import { listAdminListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Admin",
  description: "Admin dashboard for managing vacancies, accommodation, and marketplace listings.",
};

export default async function AdminPage() {
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress.toLowerCase();
  const isVerified = user?.primaryEmailAddress?.verification?.status === "verified";
  const role = typeof user?.publicMetadata?.role === "string" ? user.publicMetadata.role : "";
  const isAdmin = role === "admin" || (email ? env.adminEmails.includes(email) : false);

  if (!isVerified) {
    return (
      <PageShell>
        <p className="text-sm text-red-600">Please verify your email in Clerk before posting listings.</p>
      </PageShell>
    );
  }

  if (!isAdmin) {
    return (
      <PageShell>
        <p className="text-sm text-red-600">You are signed in but not authorized as an admin.</p>
      </PageShell>
    );
  }

  const [jobs, accommodation, marketplace] = await Promise.all([
    listAdminListings("jobs"),
    listAdminListings("accommodation"),
    listAdminListings("marketplace"),
  ]);

  return (
    <PageShell>
      <section className="space-y-5">
        <h1 className="text-3xl font-semibold tracking-tight">Admin posting dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-300">
          Create, edit, and delete vacancies, accommodation listings, and marketplace items.
        </p>
        <AdminDashboard initialData={{ jobs, accommodation, marketplace }} />
      </section>
    </PageShell>
  );
}
