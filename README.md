# Geburtstagspilot

**Dein kompletter Kindergeburtstag in 5 Minuten.**

Geburtstagspilot ist eine browserbasierte Web-App, die Eltern in unter 5 Minuten einen kompletten Kindergeburtstag plant: Zeitablauf, Spiele mit Anleitung, Kuchen- und Essensideen, Einkaufsliste, Einladung, Mitgebsel und mehr.

## Tech Stack

- **Framework:** Next.js 16 (App Router, `src/app/`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Backend/DB:** Supabase (PostgreSQL, Auth, RLS)
- **I18n:** next-intl (DE + EN)
- **Deployment:** Vercel (via GitHub Actions CI/CD)
- **Package Manager:** npm

## Features (V1)

- **7-Schritt Party-Wizard:** Alter, Gaeste, Ort, Motto, Dauer, Allergien, Budget
- **8 Ergebnis-Tabs:** Aufgaben, Zeitablauf, Spiele (80+), Essen & Kuchen, Einkaufsliste, Einladung, Mitgebsel, Gaesteliste
- **Benutzerkonten:** Registrierung, Login, Profilverwaltung (Supabase Auth)
- **Free/Pro Modell:** 3 gespeicherte Plaene (Free), erweiterte Features (Pro)
- **KI-Features (Pro):** Chat-Assistent, Spielgenerierung, Einladungstexte
- **Admin-Dashboard:** Benutzerverwaltung, Pro-Anfragen, Statistiken
- **Plan-Sharing:** Oeffentliche Links mit Share-Token
- **Dark/Light Mode** mit localStorage-Persistenz
- **Zweisprachig:** Deutsch (Standard) und Englisch

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run verify` | Run typecheck + lint + build |

## Project Structure

```
src/
  app/
    [locale]/           # Locale-based routing (de/en)
      wizard/           # Party planning wizard
      result/           # Plan results with 8 tabs
      dashboard/        # Saved plans overview
      admin/            # Admin dashboard
      auth/             # Login, Register, Callback
      share/            # Public plan sharing
      upgrade/          # Pro upgrade page
  components/
    ai/                 # AI chat, generation features
    auth/               # Auth provider, forms, user menu
    dashboard/          # Plan cards, save button
    layout/             # Header, Footer
    result/             # Result view + tab components
    wizard/             # Party wizard component
    ui/                 # Language switcher, theme toggle
    upgrade/            # Feature gates, upgrade prompts
  lib/                  # Supabase clients, data fetchers, plan generator
  messages/             # Translation files (de.json, en.json)
  types/                # TypeScript type definitions
supabase/
  migrations/           # Database migration files
  seed.sql              # Seed data for development
```

## Documentation

- **[HOWTO.md](HOWTO.md)** - Setup and deployment guide (DE/EN)
- **[AGENTS.md](AGENTS.md)** - GitHub Copilot agents, skills and instructions
- **[docs/PROGRESS.md](docs/PROGRESS.md)** - Implementation progress
- **[docs/MARKETINGKONZEPT.md](docs/MARKETINGKONZEPT.md)** - Marketing concept and UX strategy
- **[docs/KONZEPT_FREE_PRO_PLAN.md](docs/KONZEPT_FREE_PRO_PLAN.md)** - Free vs. Pro plan concept
- **[docs/KONZEPT_KI_ENHANCEMENT.md](docs/KONZEPT_KI_ENHANCEMENT.md)** - AI enhancement concept
- **[legal-docs/](legal-docs/)** - Legal document templates (DE/EN)
