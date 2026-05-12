import type { Metadata } from "next";
import { PlatformModulePage } from "@/components/platform-module-page";

export const metadata: Metadata = {
  title: "Discounts",
  description: "Discover student discounts on groceries, transport, and everyday essentials.",
};

const discountItems = [
  { title: "Groceries", description: "Weekly specials and student promo bundles at major supermarkets.", meta: "Savings" },
  { title: "Transport", description: "State transport concessions and top-up reminders in one place.", meta: "Mobility" },
  { title: "SIM & Internet", description: "Affordable prepaid plans and referral offers for students.", meta: "Utilities" },
];

export default function DiscountsPage() {
  return (
    <PlatformModulePage
      title="Student Discounts"
      description="Browse curated savings opportunities to reduce everyday costs while studying in Australia."
      items={discountItems}
    />
  );
}
