import type { Metadata } from "next";
import { ListingGrid } from "@/components/listing-grid";
import { PageShell } from "@/components/page-shell";
import { listPublicListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Accommodation",
  description: "Student accommodation listings on GradBridge.",
};

export default async function AccommodationPage() {
  const items = await listPublicListings("accommodation");

  return (
    <PageShell>
      <ListingGrid
        title="Accommodation listings"
        description="Explore verified rooms, shared apartments, and housing options."
        emptyMessage="No accommodation listings available yet."
        items={items}
      />
    </PageShell>
  );
}
