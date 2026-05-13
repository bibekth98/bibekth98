# GradBridge

Production-ready foundation for an International Student Life Platform built with Next.js App Router, Clerk, Supabase, Plausible, and Stripe.

## Implemented foundation

- Clerk authentication: sign up, sign in, sign out, password reset, email verification support, Google OAuth-ready UI
- Admin posting dashboard (`/admin`) with protected CRUD for:
  - Job vacancies
  - Accommodation listings
  - Marketplace items
- Supabase-backed public listings:
  - `/jobs`
  - `/accommodation`
  - `/marketplace`
- Stripe subscription flows:
  - Checkout (`/api/billing/checkout`)
  - Customer portal for upgrade/downgrade/cancel (`/api/billing/portal`)
  - Webhook lifecycle sync (`/api/stripe/webhook`)
- Plausible tracking foundation:
  - Page tracking script (consent-gated)
  - Custom events for key actions (cookie consent, admin CRUD, billing actions)
- Product/compliance pages:
  - `/privacy`
  - `/terms`
  - `/contact`
  - Cookie consent banner with accept/dismiss preference persistence
- SEO and indexing basics:
  - Metadata/OpenGraph in layout
  - `app/sitemap.ts`
  - `app/robots.ts`
- Security basics:
  - Route protection middleware with Clerk
  - Admin email/role check + verified email enforcement for posting
  - In-memory write-operation rate limiting on admin and billing APIs
- Deployment-ready env scaffolding in `.env.example`
- Supabase schema and RLS policies in `supabase/schema.sql`

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Environment variables

Copy `.env.example` to `.env.local` and fill values.

### Required integrations

#### Clerk

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `ADMIN_EMAILS` (comma-separated allow-list, e.g. `admin@domain.com,founder@domain.com`)

Clerk dashboard setup:

1. Enable **Email + Password** sign-in
2. Enable **Email verification** (mandatory for admin posting)
3. Enable **Password reset**
4. Enable **Google OAuth** provider (add callback URLs for local and production)
5. Optional: set `public_metadata.role = "admin"` for admin users

#### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Apply schema:

1. Open Supabase SQL editor
2. Run `supabase/schema.sql`

#### Stripe

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_MONTHLY_PRICE_ID`
- `STRIPE_PRO_YEARLY_PRICE_ID`

Create two recurring prices in Stripe test mode and paste price IDs.

##### Stripe webhook

Listen for:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Point webhook endpoint to `/api/stripe/webhook`.

#### Plausible

- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (your production domain)

Tracking loads only after cookie consent is accepted.

#### Support and bug reporting

- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_GITHUB_ISSUES_URL`

## Payment flow test checklist (Stripe test mode)

1. Sign in with Clerk
2. Open `/pricing`
3. Click monthly/yearly upgrade
4. Complete checkout with Stripe test card `4242 4242 4242 4242`
5. Confirm redirect back to `/pricing?checkout=success`
6. Verify webhook updates `subscriptions` table in Supabase
7. Open "Manage subscription" button
8. In customer portal, test upgrade/downgrade/cancel
9. Confirm webhook sync updates status/price in `subscriptions`

## Vercel deployment checklist

1. Import repo in Vercel
2. Add all env vars from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to production URL
4. Configure Clerk allowed origins and redirects for production URL
5. Configure Stripe webhook endpoint to production URL
6. Redeploy

## Search indexing checklist (Google + Bing)

1. Verify domain ownership in Google Search Console
2. Submit `${NEXT_PUBLIC_SITE_URL}/sitemap.xml` in Search Console
3. Verify domain in Bing Webmaster Tools
4. Submit `${NEXT_PUBLIC_SITE_URL}/sitemap.xml` in Bing
5. Re-crawl updated legal pages (`/privacy`, `/terms`) and core pages
6. Keep metadata titles/descriptions unique on key routes

## Validation commands

```bash
npm run lint
npm run build
```
