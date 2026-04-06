# R&D Site Engine

A Next.js 15 + Sanity CMS marketing website template, themed for Research & Development.

## Stack
- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity v4 (Studio at `/studio`)
- **Styling**: Tailwind CSS v3 + custom R&D dark theme
- **Email**: Resend (contact form → `/api/send`)
- **Font**: Space Grotesk (headings/body) + Geist Mono (labels)
- **Port**: 5000 (Replit)

## Design System — Dark Lab Theme
| Token | Value | Use |
|---|---|---|
| `lab-bg` | `#030b18` | Page background |
| `lab-surface` | `#07142a` | Section backgrounds |
| `lab-card` | `#0b1e38` | Card/panel backgrounds |
| `lab-cyan` | `#22d3ee` | Primary accent (buttons, icons, labels) |
| `lab-blue` | `#3b82f6` | Secondary accent |
| `lab-border` | `rgba(34,211,238,0.12)` | All borders |
| `lab-text` | `#e2e8f0` | Primary text |
| `lab-muted` | `#64748b` | Muted / secondary text |

## CSS Utilities
- `.pattern-bg` — dark circuit-grid background pattern
- `.pattern-bg--2` — subtle dark dot grid
- `.mono-label` — uppercase monospace section labels in cyan
- `.glow-cyan` — subtle box shadow glow on cards
- `.glow-text` — text glow for hero elements

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
    page-builder/ — CMS-driven blocks
    shared/       — Buttons, Headings, Forms
    ui/           — Radix-based primitives
  sanity/         — Sanity schemas, queries, client
```
