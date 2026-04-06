# R&D Site Engine

A Next.js 15 + Sanity CMS marketing website template, themed for Research & Development with a refined dark design.

## Stack
- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity v4 (Studio at `/studio`)
- **Styling**: Tailwind CSS v3 + custom dark design system
- **Email**: Resend (contact form → `/api/send`)
- **Typography**: Instrument Sans (body), Instrument Serif (display headings), JetBrains Mono (labels/mono)
- **Port**: 5000 (Replit)

## Design System — Dark Theme
| Token | CSS Variable | RGB | Use |
|---|---|---|---|
| `dark-bg` | `--color-bg` | `12 12 18` | Page background |
| `dark-card` | `--color-card` | `20 20 30` | Card/panel backgrounds |
| `dark-surface` | `--color-surface` | `26 26 40` | Elevated surfaces, inputs |
| borders | — | `white/[0.06–0.15]` | All borders use white opacity |
| text primary | — | `white` | Headings |
| text secondary | — | `white/50–60` | Body/descriptions |
| text muted | — | `white/30–40` | Labels, captions |

## CSS Utilities
- `.section-label` — mono font, `::before` horizontal line, `white/40` text
- `.mono-label` — JetBrains Mono, `white/40` text
- `.pattern-bg` / `.pattern-bg--2` — dark background fills
- `.play-icon` — CSS clip-path triangle for video play buttons

## Font Variables
- `--font-instrument-sans` → `font-sans`
- `--font-instrument-serif` → `font-display`
- `--font-jetbrains-mono` → `font-mono`
- `--font-space-grotesk` → `font-spaceGrotesk`
- `--font-geist-sans` → `font-geistSans`
- `--font-geist-mono` → `font-geistMono`

## Navbar Behavior
- Full-width transparent at top
- On scroll: shrinks, rounded pill with `bg-dark-bg/80 backdrop-blur-xl border border-white/10 rounded-2xl`
- Max-width 1200px when scrolled

## Environment Variables Required
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_READ_TOKEN`
- `RESEND_API_KEY`
- `RESEND_SENDER_EMAIL`
- `RESEND_RECIEVER_EMAIL`
- `NEXT_PUBLIC_SITE_NAME`

## Project Structure
```
src/
  app/
    (frontend)/   — public-facing pages
    (backend)/    — API routes (email, og image)
    studio/       — Sanity Studio
  components/
    global/       — Navbar, Footer, ClientLayout
    page-builder/ — CMS-driven blocks (hero, CTA, features, etc.)
    shared/       — Buttons, Headings, Forms, SiteLogo
    ui/           — Radix-based primitives (dialog, sheet, etc.)
    portable-text/ — Rich text rendering
  sanity/         — Sanity schemas, queries, client
```

## Notes
- npm install requires `--legacy-peer-deps` (React 19 peer conflict)
- Testimonial block intentionally inverts to white bg + dark text
- Logo images use `brightness-0 invert` for white logos on dark bg
- Pre-existing hydration warning: button-inside-button in PlayVideo component
