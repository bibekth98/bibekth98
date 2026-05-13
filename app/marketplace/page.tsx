import type { Metadata } from "next";
import { ListingGrid } from "@/components/listing-grid";
import { PageShell } from "@/components/page-shell";
import { listPublicListings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy and sell essentials for student life.",
};

export default async function MarketplacePage() {
  const items = await listPublicListings("marketplace");

  return (
    <PageShell>
      <ListingGrid
        title="Marketplace"
        description="Find and list student essentials such as furniture, books, and electronics."
        emptyMessage="No marketplace items available yet."
        items={items}
      />
    </PageShell>
  );
}
