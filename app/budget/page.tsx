import type { Metadata } from "next";
import { PlatformModulePage } from "@/components/platform-module-page";

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Track expenses, recurring bills, and savings goals with a student-focused budget view.",
};

const budgetItems = [
  { title: "Weekly Budget Plan", description: "Set spending limits for food, transport, and essentials.", meta: "Planner" },
  { title: "Recurring Costs", description: "Monitor rent, subscriptions, and utility payments in one feed.", meta: "Tracker" },
  { title: "Savings Goals", description: "Create milestone goals for emergency funds and semester expenses.", meta: "Goals" },
];

export default function BudgetPage() {
  return (
    <PlatformModulePage
      title="Budget Tracker"
      description="Stay on top of your finances with clear monthly snapshots and practical spending controls."
      items={budgetItems}
    />
  );
}
