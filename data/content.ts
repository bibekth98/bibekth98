import { Sparkles } from "lucide-react";

export type FeatureIcon = "resume" | "cover" | "jobs" | "internships" | "guides" | "templates";
export type PlatformModuleIcon = "discounts" | "accommodation" | "marketplace" | "budget" | "guides";

export const features: Array<{ title: string; description: string; icon: FeatureIcon }> = [
  {
    title: "Resume Builder",
    description: "Create ATS-friendly resumes tailored for Australian employers.",
    icon: "resume",
  },
  {
    title: "Cover Letter Builder",
    description: "Draft convincing cover letters with guided writing prompts.",
    icon: "cover",
  },
  {
    title: "Student Jobs",
    description: "Discover part-time and casual roles that fit your class schedule.",
    icon: "jobs",
  },
  {
    title: "Internships",
    description: "Find internships that build local experience in your field.",
    icon: "internships",
  },
  {
    title: "Career Guides",
    description: "Read practical guides for applications and interviews in Australia.",
    icon: "guides",
  },
  {
    title: "Australian Resume Templates",
    description: "Pick polished templates optimized for hiring managers.",
    icon: "templates",
  },
];

export const jobs = [
  { role: "Retail Assistant", company: "Woolworths", location: "Sydney, NSW", type: "Part-time" },
  { role: "Cafe All Rounder", company: "Bean & Co.", location: "Melbourne, VIC", type: "Casual" },
  { role: "IT Support Intern", company: "BlueTech Systems", location: "Brisbane, QLD", type: "Internship" },
  { role: "Marketing Intern", company: "Growthlane Digital", location: "Perth, WA", type: "Internship" },
];

export const internships = [
  {
    role: "Finance Internship",
    company: "Harbour Advisory",
    location: "Sydney, NSW",
    duration: "12 weeks · Paid",
  },
  {
    role: "Data Analyst Intern",
    company: "Insights Lab",
    location: "Melbourne, VIC",
    duration: "10 weeks · Hybrid",
  },
  {
    role: "UX Design Intern",
    company: "Pixel North",
    location: "Brisbane, QLD",
    duration: "8 weeks · On-site",
  },
];

export const guides = [
  {
    title: "Resume tips for Australia",
    excerpt: "Learn what Australian recruiters expect and how to tailor your resume format.",
    readTime: "6 min read",
  },
  {
    title: "How to get internships",
    excerpt: "A step-by-step strategy to source and secure internships while studying.",
    readTime: "7 min read",
  },
  {
    title: "Best student jobs",
    excerpt: "Explore high-demand part-time roles suitable for international students.",
    readTime: "5 min read",
  },
  {
    title: "Interview preparation tips",
    excerpt: "Practice frameworks and confidence boosters for your next interview.",
    readTime: "8 min read",
  },
];

export const platformModules: Array<{
  title: string;
  description: string;
  icon: PlatformModuleIcon;
  href: string;
  cta: string;
}> = [
  {
    title: "Discounts",
    description: "Save on groceries, transport, and essential services with student-first deals.",
    icon: "discounts",
    href: "/discounts",
    cta: "Explore Discounts",
  },
  {
    title: "Accommodation",
    description: "Find shared rentals and student housing options with practical move-in insights.",
    icon: "accommodation",
    href: "/accommodation",
    cta: "Explore Accommodation",
  },
  {
    title: "Marketplace",
    description: "Buy and sell furniture, books, bikes, and electronics within the student community.",
    icon: "marketplace",
    href: "/marketplace",
    cta: "Explore Marketplace",
  },
  {
    title: "Budget Tracker",
    description: "Track weekly spend, recurring costs, and savings goals in one simple overview.",
    icon: "budget",
    href: "/budget",
    cta: "Explore Budget",
  },
  {
    title: "Guides",
    description: "Read practical tips for settling in, finding work, and thriving in Australia.",
    icon: "guides",
    href: "/guides",
    cta: "Explore Guides",
  },
];

export const dashboardStats = [
  { label: "Applications Sent", value: "24" },
  { label: "Interviews", value: "5" },
  { label: "Saved Jobs", value: "18" },
  { label: "Resume Score", value: "89" },
];

export const templates = ["Professional Mono", "Modern Blocks", "Minimal Contrast", "Classic Clean"];

export const savedJobs = [
  {
    role: "Customer Service Assistant",
    company: "City Retail Group",
    location: "Sydney, NSW",
    type: "Part-time",
  },
  {
    role: "Junior Web Support",
    company: "Koala Digital",
    location: "Adelaide, SA",
    type: "Casual",
  },
  {
    role: "Social Media Assistant",
    company: "Growthlane Digital",
    location: "Melbourne, VIC",
    type: "Part-time",
  },
];

export const resumePreviewSections = [
  "Professional Summary",
  "Skills: Customer Service, MS Office, Communication",
  "Experience: Retail Assistant · 2024–Present",
  "Education: Bachelor of IT · UNSW",
  "Projects: Campus Job Board Web App",
  "References available upon request",
];

export const authHighlights = [
  "Create ATS-ready resumes in minutes",
  "Track applications and interview progress",
  "Access Australia-specific career resources",
  "Save jobs and internships in one dashboard",
  "AI-assisted cover letter drafting",
  "Smart resume score insights",
  "One profile, multiple applications",
  "Student-friendly opportunities only",
  "Tips for local hiring expectations",
  "Personalized career action plan",
  "Templates for different industries",
  "Alerts for new roles matching your profile",
].map((value) => ({ value, icon: Sparkles }));
