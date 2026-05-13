import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { env } from "@/lib/env";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
});

const siteUrl = env.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GradBridge | Career Platform for International Students in Australia",
    template: "%s | GradBridge",
  },
  description:
    "Build resumes, craft cover letters, and discover student jobs, accommodation, and marketplace opportunities in Australia with GradBridge.",
  openGraph: {
    title: "GradBridge",
    description:
      "International student life platform for jobs, accommodation, marketplace, and career growth in Australia.",
    type: "website",
    url: siteUrl,
    siteName: "GradBridge",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full`}>
        <body className="min-h-full bg-zinc-50 font-sans text-zinc-900 antialiased transition-colors dark:bg-zinc-950 dark:text-zinc-50">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <CookieConsentBanner />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
