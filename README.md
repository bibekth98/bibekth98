# GradBridge

Modern SaaS-style marketing site and UI previews for **GradBridge** — a career platform for international students in Australia.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Routes

- `/` Landing page
- `/auth` Authentication UI (mock)
- `/dashboard` Student dashboard preview
- `/resume-builder` Resume builder preview
- `/saved-jobs` Saved jobs UI
- `/resume-preview` PDF-style resume preview UI
- `/discounts` Student discounts module
- `/accommodation` Student housing module
- `/marketplace` Student marketplace module
- `/budget` Student budget tracker module
- `/guides` Student life guides module

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Environment variable (optional)

Set `NEXT_PUBLIC_SITE_URL` to your deployed URL for correct metadata/open graph URLs.

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Production build

```bash
npm run build
npm run start
```
