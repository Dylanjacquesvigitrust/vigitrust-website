# VigiTrust Website

Production-ready marketing site for **VigiTrust** / **VigiOne**, rebuilt from the staging flyover with an improved structure and UX — while preserving the brand colour system (navy + crimson).

## Quick start

```bash
cd vigitrust-website
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

Deploy the app on **Vercel**, **Netlify**, **Cloudflare Pages**, or any Node host that supports Next.js. Static export is optional if you later decide you don’t need server features.

## Edit content yourself (no agency required)

Almost all copy lives in one file:

**[`src/content/site.ts`](src/content/site.ts)**

Update:

- Navigation labels / links
- Home hero, stats, industries, pillars
- Platform modules & feature pages
- Training courses (add/remove objects in `training.courses`)
- Blog posts (`blog.posts`)
- Office addresses / phones
- Footer columns

After saving, the dev server hot-reloads. For production, run `npm run build` again.

### Brand colours

Defined as CSS variables in [`src/app/globals.css`](src/app/globals.css):

| Token | Hex | Use |
| --- | --- | --- |
| `--vt-red` | `#be272d` | CTAs, logo accent |
| `--vt-azure` / `--vt-navy` | `#13466c` / `#1a4361` | Hero & dark sections |
| `--vt-cyan` | `#aec9cb` | Soft accents |
| `--vt-mist` | `#eef2f5` | Page background |

Keep these values if you want colour continuity with staging / existing VigiTrust materials.

## Site map

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/platform` | VigiOne overview |
| `/platform/organisations` | Org workflows + SAQ mock |
| `/platform/assessors` | Assessor workflows |
| `/platform/assessment-360` | Assessment 360 |
| `/training` | eLearning catalogue |
| `/training/[slug]` | Course detail |
| `/resources` | Resource hub + 5 Pillars |
| `/blog` · `/blog/[slug]` | Insights |
| `/about` | Company |
| `/advisory-board` | Global Advisory Board |
| `/contact` | Offices + message form |
| `/demo` | Demo request |

## Forms

Contact and demo forms currently capture submissions in the browser and prompt email follow-up. To go live, connect them to:

- Your CRM / ActiveDemand / HubSpot endpoint, or
- A Next.js Route Handler that posts to email (Resend, SES, etc.)

## Accessibility & performance

- Skip link, semantic landmarks, labelled form fields
- Focus-visible styles using brand red
- Respects `prefers-reduced-motion` for scroll reveals
- Next.js font optimisation (Outfit + Source Sans 3)
- Responsive layout from mobile through desktop

## Project layout

```
src/
  app/                 # Routes (App Router)
  components/          # Header, footer, UI primitives
  content/site.ts      # ← edit me
  lib/utils.ts
```
