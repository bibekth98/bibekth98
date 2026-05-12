import type { Metadata } from "next";
import { PlatformModulePage } from "@/components/platform-module-page";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Buy and sell student essentials in a trusted campus-focused marketplace.",
};

const marketplaceItems = [
  { title: "Furniture", description: "Browse affordable desks, chairs, and room essentials.", meta: "Buy & Sell" },
  { title: "Books & Study Tools", description: "Find second-hand textbooks and accessories from peers.", meta: "Campus" },
  { title: "Electronics", description: "Shop verified listings for laptops, monitors, and accessories.", meta: "Tech" },
];

export default function MarketplacePage() {
  return (
    <PlatformModulePage
      title="Student Marketplace"
      description="Trade useful items within the student community and lower your setup costs."
      items={marketplaceItems}
    />
  );
}
