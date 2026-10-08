# Smitri_NER

Smitri is a Next.js + TypeScript web application focused on cognitive support workflows for elderly users and caregivers.

## Tech Stack

- Next.js 16 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Prisma
- Supabase

## Core Product Areas

- Authentication (`/login`, `/register`)
- Dashboard and profile tracking (`/dashboard`, `/profile`, `/progress`)
- Brain games and score results (`/games`, `/results`)
- Daily reminders (`/reminders`)
- Emergency and caregiver support flows (`/emergency`, `/caregiver`)
- Feature overview and multilingual UX support (`/features`, `locales/`)
- Offline experience (`/offline`)

## Project Structure

- `app/` — Routes and pages (App Router)
- `components/` — Reusable UI and feature components
- `lib/` — Client/server utilities, middleware, and alerts integrations
- `prisma/` — Prisma schema and database setup
- `data/` — Static or seed-style data assets
- `locales/` — Translation files
- `public/` — Public static assets
- `scripts/` — Utility scripts (including i18n checks)

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL-compatible database (for Prisma)
- Supabase project credentials

## Environment Variables

Create a `.env` file in the repository root:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
DATABASE_URL=
DIRECT_URL=
```

Optional variables for alert integrations:

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

## Getting Started

```bash
npm install
npm run dev
```

App runs locally at `http://localhost:3000`.

## Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run Next.js lint checks
- `npm run typecheck` — Run TypeScript type checks
- `npm run check-i18n` — Validate translation keys