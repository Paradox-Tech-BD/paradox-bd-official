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
- `.hover-lift` — `translateY(-4px)` on hover with spring cubic-bezier
- `.noise-overlay` — subtle SVG noise texture overlay via `::after`
- `.animate-fade-in` — opacity 0→1 animation (0.7s ease-out)
- `.animate-fade-in-up` — opacity + translateY(16px→0) animation (0.7s ease-out)
- `.pattern-bg` / `.pattern-bg--2` — dark background fills
- `.play-icon` — CSS clip-path triangle for video play buttons

## Animation System
- **Scroll-triggered**: `useInView` hook (`src/hooks/use-in-view.ts`) uses IntersectionObserver to trigger fade-in/translate transitions when elements enter viewport
- **Entrance animations**: Hero/header blocks use `useState(false)` → `useEffect(() => setIsVisible(true))` for page-load entrance
- **Staggered delays**: Card grids use `animationDelay: ${index * 80}ms` for cascading reveal
- **Hover lift**: Cards use `.hover-lift` class with spring easing + `group-hover:scale-105` on images
- **Decorative glows**: Subtle `bg-white/[0.02] blur-[100-150px]` radial gradient orbs on hero/header sections

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
  hooks/          — Custom hooks (useInView, useSearch, etc.)
  sanity/         — Sanity schemas, queries, client
```

## LMS (Courses System)
- **Sanity schemas**: `course`, `courseCategory`, `courseTestimonial`, `courseSection`, `courseLecture`, `instructor`, `coursesPage` (singleton)
- **GROQ queries**: `src/sanity/lib/queries/documents/course.ts` — all courses, featured, by category, by slug, instructors (with avgRating/totalStudents), categories, recent testimonials
- **Frontend routes**:
  - `/courses` — marketing landing page (hero, about/pitch section, featured courses, featured instructors, testimonials carousel)
  - `/courses/all` — full course listing with category filter + search + pagination (9 per page)
  - `/courses/category/[slug]` — category-filtered listing
  - `/courses/[slug]` — Udemy-style course detail (curriculum accordion, instructor cards, testimonials, sticky pricing sidebar)
  - `/courses/instructor/[slug]` — instructor profile with ratings/stats (courses, avg rating, total students) and their courses
- **Studio structure**: Courses section with All Courses, Sections, Lectures, Categories, Instructors, Testimonials (orderable)
- **Nav integration**: `coursesPage` added to `pageReferenceTypes`; `resolveHref` handles `course`, `instructor`, `coursesPage`
- **Course R2 Storage**: Per-course R2 credentials stored in Sanity (admin-only field group with readOnly/hidden for non-admin users): r2BucketName, r2AccountId, r2AccessKeyId, r2SecretAccessKey, r2PublicUrl. These fields are NEVER selected in any public GROQ query — only accessed server-side for video delivery.
- **Course fields**: title, slug, excerpt, description (portable text), thumbnail, category, instructors, level, duration, price, rating, enrolledCount, curriculum (inline sections → lectures), sections (referenced courseSection docs → courseLecture docs), whatYoullLearn, prerequisites, testimonials, paymentInstructions
- **Types**: Manually added to `sanity.types.ts` (typegen broken due to jsdom dependency issue)

## LMS Authentication & User System
- **Auth**: Clerk (`@clerk/nextjs` + `@clerk/themes`) with dark theme
- **Roles**: `admin`, `instructor`, `learner` (default) — stored in Clerk `publicMetadata.role`
- **Auth utilities**: `src/lib/auth.ts` (server-side `getUserRole`, `requireRole`), `src/hooks/use-user-role.ts` (client-side `useUserRole`)
- **Middleware** (`middleware.ts`): Authentication-only — ensures users are signed in for protected routes (`/courses/dashboard`, `/courses/instructor-panel`, `/api/admin/*`, `/admin/*`). Authorization (role checking) is handled by API routes via `requireRole()` and by pages via server/client-side role checks.
- **Auth pages**: `/courses/sign-in`, `/courses/sign-up` (Clerk components with dark theme)
- **Dashboard pages**: `/courses/dashboard` (learner), `/courses/instructor-panel` (instructor/admin)
- **Admin panel**: `/admin/users` — user list with role badges, assigned courses column, assign-instructor action
- **Sanity Studio tool**: "Users" tab in Studio (iframe plugin → `/admin/users`)
- **API routes**: `/api/admin/users` (GET — list users + assigned courses), `/api/admin/courses` (GET — list courses for dropdown), `/api/admin/assign-instructor` (POST — assign user as instructor to course), `/api/webhooks/clerk` (POST — Clerk webhook, sets default role on user.created)
- **Database** (Postgres):
  - `course_instructors` (id, clerk_user_id, course_id, created_at) — UNIQUE(clerk_user_id, course_id)
  - `enrollments` (id, clerk_user_id, course_id, status, payment_proof_url, approved_at, created_at) — UNIQUE(clerk_user_id, course_id)
- **Env vars**: `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_WEBHOOK_SECRET` (for Svix signature verification), `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/courses/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/courses/sign-up`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/courses/dashboard`, `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/courses/dashboard`
- **SQL setup**: `scripts/setup-db.sql` — run against DATABASE_URL to create tables

## Notes
- npm install requires `--legacy-peer-deps` (React 19 peer conflict)
- Testimonial block intentionally inverts to white bg + dark text
- Logo images use `brightness-0 invert` for white logos on dark bg
- Pre-existing hydration warning: button-inside-button in PlayVideo component
- Hero entrance animation causes expected hydration mismatch (client-side `isVisible` state)
