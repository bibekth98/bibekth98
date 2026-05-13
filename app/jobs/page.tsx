import type { Metadata } from "next";
import { ListingGrid } from "@/components/listing-grid";
import { PageShell } from "@/components/page-shell";
import { listPublicListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Student-friendly job vacancies listed on GradBridge.",
};

export default async function JobsPage() {
  const items = await listPublicListings("jobs");

  return (
    <PageShell>
      <ListingGrid
        title="Job vacancies"
        description="Browse student-friendly vacancies published by GradBridge admins."
        emptyMessage="No vacancies available yet."
        items={items}
      />
    </PageShell>
  );
}
