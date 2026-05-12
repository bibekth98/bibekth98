import type { Metadata } from "next";
import { PlatformModulePage } from "@/components/platform-module-page";

export const metadata: Metadata = {
  title: "Guides",
  description: "Read practical guides for settling in, studying, and building your life in Australia.",
};

const guideItems = [
  { title: "Settling In", description: "Essential first-week steps for transport, banking, and SIM setup.", meta: "Getting Started" },
  { title: "Work & Tax Basics", description: "Understand TFN setup, payslips, and casual work expectations.", meta: "Work" },
  { title: "Study-Life Balance", description: "Tips for managing class schedules, part-time work, and wellbeing.", meta: "Lifestyle" },
];

export default function GuidesPage() {
  return (
    <PlatformModulePage
      title="Student Guides"
      description="Access short, practical guides that help international students navigate everyday life with confidence."
      items={guideItems}
    />
  );
}
