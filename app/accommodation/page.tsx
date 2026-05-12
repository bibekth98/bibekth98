import type { Metadata } from "next";
import { PlatformModulePage } from "@/components/platform-module-page";

export const metadata: Metadata = {
  title: "Accommodation",
  description: "Find accommodation options and practical housing guidance for international students.",
};

const accommodationItems = [
  { title: "Shared Rooms", description: "Discover budget-friendly shared rentals near universities.", meta: "Listings" },
  { title: "Student Housing", description: "Compare private and university-linked accommodation options.", meta: "Compare" },
  { title: "Move-in Checklist", description: "Prepare documents, bond payments, and utility setup steps.", meta: "Guide" },
];

export default function AccommodationPage() {
  return (
    <PlatformModulePage
      title="Accommodation Hub"
      description="Explore housing pathways, compare options, and get ready for your next move with confidence."
      items={accommodationItems}
    />
  );
}
