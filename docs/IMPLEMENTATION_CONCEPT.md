# Geburtstagspilot - Implementation Concept: Roles, Permissions & Persistence

## 1. Overview

Transform Geburtstagspilot from a stateless one-time browser tool into a persistent SaaS application with user accounts, saved plans, role-based access control, and a free/pro tier model.

---

## 2. Roles & Permissions

### 2.1 Role Model

| Role | Description | Capabilities |
|------|------------|--------------|
| **anonymous** | Unauthenticated visitor | Create plans (sessionStorage), view homepage, use wizard |
| **user (free)** | Registered user, free tier | Save up to 3 plans, view/edit own plans, basic features |
| **user (pro)** | Registered user, pro subscription | Unlimited plans, AI enhancements, PDF export, sharing links, priority support |
| **admin** | Platform administrator | Manage users, plans, roles, content (themes/games/recipes), view analytics |

### 2.2 Permission Matrix

| Action | Anonymous | Free User | Pro User | Admin |
|--------|-----------|-----------|----------|-------|
| Use wizard | Yes | Yes | Yes | Yes |
| Save plan | No | 3 max | Unlimited | Unlimited |
| Load saved plans | No | Yes | Yes | Yes (all) |
| PDF export | No | No | Yes | Yes |
| Share link (persistent) | No | No | Yes | Yes |
| AI enhancements | No | No | Yes | Yes |
| Manage own profile | No | Yes | Yes | Yes |
| Admin dashboard | No | No | No | Yes |
| Manage users | No | No | No | Yes |
| Manage content | No | No | No | Yes |

---

## 3. Free vs. Pro Model

### 3.1 Free Tier
- Account creation (optional)
- Save up to 3 plans
- Basic plan generation (wizard)
- Session-based usage without account

### 3.2 Pro Tier (future: subscription)
- Unlimited plan saving
- AI-powered enhancements (theme suggestions, personalized games)
- PDF export with branding
- Persistent shareable links
- Priority support
- Custom themes (future)

### 3.3 Pricing Model (prepared, not yet active)
- Free: 0 EUR/month
- Pro: 4.99 EUR/month or 39.99 EUR/year
- Implementation: `user_tier` column in profiles table, checked via RLS and middleware

---

## 4. Database Schema (New Tables)

### 4.1 profiles
Extends Supabase auth.users with app-specific data.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  plan_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.2 saved_plans
Stores user party plans persistently.

```sql
CREATE TABLE public.saved_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  wizard_data JSONB NOT NULL,
  plan_data JSONB NOT NULL,
  is_shared BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.3 RLS Policies
- profiles: Users can read/update their own profile. Admins can read/update all.
- saved_plans: Users can CRUD their own plans. Admins can read all. Shared plans readable by anyone via share_token.

---

## 5. Authentication Flow

1. Supabase Auth with email/password
2. Profile auto-created via database trigger on auth.users insert
3. Session managed via @supabase/ssr cookies
4. Middleware checks auth state for protected routes
5. Auth context provider wraps the app for client-side auth state

---

## 6. Implementation Plan

### Phase 1: Database & Auth Infrastructure
- Migration: profiles + saved_plans tables with RLS
- Supabase middleware for auth session
- Auth context provider
- Login/Register/Logout UI components

### Phase 2: Plan Persistence
- Save plan action (Server Action)
- My Plans page (list saved plans)
- Load plan into result view
- Plan count enforcement (free tier limit)

### Phase 3: Admin Dashboard
- Admin layout with sidebar
- User management (list, edit role/tier)
- Plan overview (read-only)
- Content management links

### Phase 4: Free/Pro Tier Enforcement
- Tier check middleware
- Upgrade prompt component
- Feature gating in UI

### Phase 5: Translations
- All new UI strings in de.json and en.json

---

## 7. File Structure (New/Modified)

```
src/
  app/[locale]/
    auth/
      login/page.tsx
      register/page.tsx
      callback/route.ts
    dashboard/
      page.tsx          (My Plans)
    admin/
      page.tsx          (Admin Dashboard)
      users/page.tsx
  components/
    auth/
      AuthProvider.tsx
      LoginForm.tsx
      RegisterForm.tsx
      UserMenu.tsx
    dashboard/
      PlanCard.tsx
      SavePlanButton.tsx
    admin/
      AdminLayout.tsx
      UserTable.tsx
  lib/
    auth.ts             (auth helpers)
    middleware.ts        (Next.js middleware)
  types/
    index.ts            (extended types)
```

---

## 8. Current Implementation Status

| Component | Status |
|-----------|--------|
| Database migration (profiles, saved_plans, is_admin function) | Done |
| RLS policies with SECURITY DEFINER helper | Done |
| Auth proxy (proxy.ts with Supabase session) | Done |
| AuthProvider context (client-side) | Done |
| LoginForm + RegisterForm components | Done |
| UserMenu with dropdown | Done |
| Login page (de/en) | Done |
| Register page (de/en) | Done |
| Auth callback route | Done |
| Save plan functionality (SavePlanButton) | Done |
| My Plans dashboard (list/load/delete) | Done |
| PlanCard component | Done |
| Admin dashboard (stats, links) | Done |
| Admin user management (role/tier editing) | Done |
| Free tier limit enforcement (3 plans max) | Done |
| Pro tier UI + badge | Done |
| Translations (auth, dashboard, admin - de/en) | Done |
| Test users created (admin, free, pro) | Done |
| Typecheck + Lint + Build passing | Done |
| Browser testing (login, dashboard, menu) | Done |

---

## 9. Test Users (Local Supabase)

| Email | Password | Role | Tier |
|-------|----------|------|------|
| admin@geburtstagspilot.de | Admin123! | admin | pro |
| user@geburtstagspilot.de | User123! | user | free |
| pro@geburtstagspilot.de | Pro123! | user | pro |

---

## 10. Files Created/Modified

### New Files
- `supabase/migrations/20260512130000_auth_profiles_plans.sql` - DB migration
- `supabase/seed_test_users.sql` - Test user documentation
- `src/lib/supabase-browser.ts` - Browser Supabase client
- `src/components/auth/AuthProvider.tsx` - Auth context
- `src/components/auth/LoginForm.tsx` - Login form
- `src/components/auth/RegisterForm.tsx` - Registration form
- `src/components/auth/UserMenu.tsx` - User dropdown menu
- `src/components/dashboard/SavePlanButton.tsx` - Save plan button
- `src/components/dashboard/PlanCard.tsx` - Saved plan card
- `src/app/[locale]/auth/login/page.tsx` - Login page
- `src/app/[locale]/auth/register/page.tsx` - Register page
- `src/app/[locale]/auth/callback/route.ts` - Auth callback
- `src/app/[locale]/dashboard/page.tsx` - User dashboard
- `src/app/[locale]/admin/page.tsx` - Admin dashboard
- `src/app/[locale]/admin/users/page.tsx` - User management

### Modified Files
- `src/proxy.ts` - Added auth session refresh + route protection
- `src/app/[locale]/layout.tsx` - Added AuthProvider wrapper
- `src/components/layout/Header.tsx` - Added UserMenu
- `src/components/result/ResultView.tsx` - Added SavePlanButton
- `src/types/index.ts` - Added Profile, SavedPlan, TIER_LIMITS
- `src/messages/en.json` - Added auth, dashboard, admin translations
- `src/messages/de.json` - Added auth, dashboard, admin translations

---

## 11. Future Enhancements

1. **AI Enhancement Engine**: GPT-based plan optimization, personalized suggestions
2. **Stripe Integration**: Payment processing for Pro subscriptions
3. **Social Login**: Google, Apple sign-in
4. **Collaborative Planning**: Share edit access with co-hosts
5. **Push Notifications**: RSVP reminders, party day countdown
6. **Template Marketplace**: Community-created themes and templates
