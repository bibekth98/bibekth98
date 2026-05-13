const splitCsv = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  clerkSecretKey: process.env.CLERK_SECRET_KEY,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  stripeProMonthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  stripeProYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID,
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@example.com",
  githubIssuesUrl:
    process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL ?? "https://github.com/bibekth98/bibekth98/issues/new/choose",
  adminEmails: splitCsv(process.env.ADMIN_EMAILS),
};
