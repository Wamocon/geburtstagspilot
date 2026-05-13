# Konzept: Free vs. Pro Plan - KinderPartyPlaner

Version: 1.0 | Stand: Mai 2026 | Status: Planungsphase

---

## 1. Strategische Grundlage - Was ist ein guter Paywall?

### 1.1 Anti-Bypass-Prinzip

Der entscheidende Filter bei der Feature-Auswahl: **Kann der Nutzer dieses Feature mit einem Screenshot, Browser-DevTools oder einem anderen kostenlosen Tool umgehen?**

| Feature-Typ | Bypass moglich? | Fazit |
|---|---|---|
| PDF-Export / Druck | Ja - window.print() jederzeit | Schlechter Paywall |
| Screenshot der Einladung | Ja - jedes Smartphone | Schlechter Paywall |
| Statische Inhalte (Spiele, Rezepte) | Ja - einfach kopieren | Schlechter Paywall |
| Einkaufsliste exportieren | Ja - Copy/Paste | Schlechter Paywall |
| **Zusammenarbeit mit anderen Eltern** | Nein - benotigt Server-Backend | Starker Paywall |
| **RSVP-Tracking via E-Mail** | Nein - erfordert Server + E-Mail-Service | Starker Paywall |
| **KI-Personalisierung** | Nein - erfordert API-Call mit Kosten | Starker Paywall |
| **Aufgaben-Manager mit Erinnerungen** | Nein - erfordert persistente Datenbankjobs | Starker Paywall |
| **Kinderprofil uber Jahre hinweg** | Nein - erfordert persistente Datenhaltung | Starker Paywall |
| **Unbegrenzte gespeicherte Plane** | Nein - per RLS serverseitig erzwungen | Solider Paywall |
| **Live-Teilen mit Bearbeitungsrechten** | Nein - erfordert Realtime-Backend | Starker Paywall |

### 1.2 Kernprinzip: Wert, nicht Restriktion

Der Free-Tier muss wertvoll genug sein, dass Nutzer registrieren. Der Pro-Tier muss so wertvoll sein, dass soziale und organisatorische Probleme gelost werden - nicht nur Convenience-Features.

**Free = "Ich plane alleine"**
**Pro = "Ich plane gemeinsam und organisiert"**

---

## 2. Feature-Matrix: Free vs. Pro

### 2.1 Vollstandige Ubersicht

| Feature | Anonym | Free | Pro | Begruendung |
|---|:---:|:---:|:---:|---|
| **Party-Wizard (7 Schritte)** | Vollstandig | Vollstandig | Vollstandig | Kern-Conversion-Tool, muss immer frei sein |
| **Ergebnis-Tabs (alle 7)** | Session | Session | Dauerhaft | Free hat Session-Zugriff, Pro persistent |
| **Plane speichern** | 0 | 3 | Unbegrenzt | Naturliche Upgrade-Schwelle |
| **Gespeicherte Plane laden** | - | Ja | Ja | Grundfunktion Pro |
| **Plane loschen** | - | Ja | Ja | Grundfunktion |
| **Basis-Sharing (Link lesen)** | 24h | 7 Tage | Dauerhaft | Zeitlimit erzeugt Upgrade-Druck |
| **--- PRO FEATURES ---** | | | | |
| **Eltern-Kollaboration** | Nein | Nein | Ja | Kern-Pro-Feature |
| **RSVP-Tracking + E-Mail-Einladung** | Nein | Nein | Ja | Kern-Pro-Feature |
| **KI-Personalisierung (Kinderwunsche)** | Nein | Nein | Ja | Hochwertig, kostenintensiv |
| **KI-Chat-Assistent** | Nein | Nein | Ja | Hochwertig, kostenintensiv |
| **Aufgaben-Manager + Erinnerungen** | Nein | Nein | Ja | Benotigt Backend-Jobs |
| **Kindprofile (jahresubergreifend)** | Nein | Nein | Ja | Benotigt persistente Datenhaltung |
| **Budget-Tracker (real)** | Nein | Nein | Ja | Benotigt persistente Datenhaltung |
| **Plan-Versionsgeschichte** | Nein | Nein | Ja | Benotigt Backend-Storage |
| **Exklusive Premium-Themen** | Nein | Nein | Ja | Content-Differenzierung |
| **WhatsApp/E-Mail-Versand (direkt)** | Nein | Nein | Ja | Benotigt E-Mail-Service-API |
| **Mehrere Kinder (Geschwister)** | Nein | Nein | Ja | Benotigt persistente Profile |

### 2.2 Free Tier - Detailbeschreibung

**Ziel:** Nutzer erleben den vollen Wert, werden aber an naturliche Grenzen der "Solo-Planung" stossen.

**Was Free-Nutzer konnen:**
- Den kompletten 7-Schritt-Wizard durchfuhren (keine versteckten Premium-Steps)
- Alle 7 Ergebnis-Tabs in der aktuellen Session sehen und nutzen
- Bis zu **3 Plane dauerhaft speichern** (klar kommuniziert, nicht versteckt)
- Gespeicherte Plane jederzeit laden und bearbeiten
- Gaste zur Liste hinzufugen (nur lokal, kein E-Mail-Versand)
- Einkaufsliste mit Checkboxen nutzen
- Einfache Read-Only-Links teilen (ablaufend nach 7 Tagen)
- Browser-Druck-Funktion (window.print) bleibt immer aktiv - wir verstecken das nicht
- Sprache wechseln (DE/EN)
- Dark/Light Mode

**Was Free-Nutzer nicht konnen:**
- Einen 4. Plan speichern (Upgrade-Prompt erscheint)
- Den Plan mit einem anderen Elternteil zur gemeinsamen Bearbeitung teilen
- E-Mail-Einladungen versenden und RSVP verfolgen
- KI fur personalisierte Empfehlungen nutzen
- Aufgaben und Erinnerungen setzen
- Kindprofile fur nachste Jahr speichern

### 2.3 Pro Tier - Detailbeschreibung

**Ziel:** Pro lost die echten Organisationsprobleme bei einer Kinderparty - Koordination, Kommunikation, Personalisierung.

**Preis:** 4,99 EUR/Monat oder 39,99 EUR/Jahr (sparen 33%)

**Was Pro-Nutzer konnen - jedes Feature einzeln erklart:**

#### Feature A: Eltern-Kollaboration (Bearbeitungs-Sharing)
- Plan mit beliebig vielen Personen teilen (per E-Mail-Einladung)
- Mitbearbeiter konnen Gaste hinzufugen, Spiele andern, Zeitplan anpassen
- Rollenmodell: Host (Vollzugriff), Mithelfer (eingeschrankt), Leser (nur lesen)
- Anderungen werden in Echtzeit synchronisiert (Supabase Realtime)
- **Warum nicht bypassed:** Erfordert serverseitige Authentifizierung, Datenbankoperationen, Realtime-Verbindungen

#### Feature B: RSVP-Tracking mit digitalem Einladungsversand
- Direkt aus der App E-Mail-Einladungen versenden (personalisiert pro Kind)
- Jede Einladung hat einen eindeutigen RSVP-Link
- Eltern klicken "Zusagen" / "Absagen" direkt in der E-Mail
- Dashboard zeigt Live-Status: Wer hat zugesagt, wer noch nicht geantwortet
- Automatische Erinnerungs-E-Mail nach X Tagen ohne Antwort
- Allergie-Informationen der Kinder werden beim RSVP abgefragt und in der App gespeichert
- **Warum nicht bypassed:** Erfordert E-Mail-Service (Resend/SendGrid), persistente Token in der Datenbank, Server-seitige Zustandsverwaltung

#### Feature C: KI-Personalisierung (Kinderwunsche und Interessen)
- Im Wizard: Freitextfeld "Was liebt [Kind] besonders?" (z.B. "Pferdefilme, Zeichnen, Bane Kimi")
- KI generiert personalisierte Spielvorschlage, Dekorationsideen, Kuchendesigns basierend darauf
- Personalisierter Einladungstext der auf das Kind eingeht
- Nicht mehr "Piraten-Standard-Spiel" sondern "Schatzsuche mit Hinweisen die Mias Lieblingsfilme referenzieren"
- **Warum nicht bypassed:** Erfordert LLM-API-Calls (Kosten pro Anfrage), serverseitig verarbeitet

#### Feature D: KI-Chat-Assistent
- Chatfenster in der Ergebnis-Seite: "Frag mich etwas zur Party"
- Beispiele: "Was mache ich wenn es regnet?", "Wie unterhalte ich schuchterne Kinder?", "Ideen fur vegetarische Kuchen zum Dinosaurier-Motto"
- Kontext-bewusst: KI kennt den aktuellen Plan und gibt passende Antworten
- **Warum nicht bypassed:** LLM-API-Kosten, serverseitig

#### Feature E: Aufgaben-Manager mit Erinnerungen
- Automatisch generierte Vorbereitungsaufgaben basierend auf dem Plan (z.B. "8 Wochen vorher: Ort buchen", "2 Wochen vorher: Einladungen verschicken", "3 Tage vorher: Kuchen backen")
- Nutzer kann Aufgaben anpassen, eigene hinzufugen
- E-Mail-Erinnerungen zum konfigurierbaren Zeitpunkt
- Fortschrittsanzeige: wie viel ist erledigt?
- **Warum nicht bypassed:** Erfordert persistente Datenbankjobs (cron), E-Mail-Versand

#### Feature F: Kinderprofile
- Profil fur jedes Kind anlegen (Name, Geburtstag, Interessen, Allergien)
- Beim nachsten Wizard: Kind auswahlen, alle Daten werden automatisch vorausgefullt
- Alter wird automatisch auf das aktuelle Jahr berechnet
- Interessenhistorie: was hat letztes Jahr Spa gemacht?
- **Warum nicht bypassed:** Persistente Datenhaltung uber Sessions hinweg, datenschutzkonform durch Authentifizierung

#### Feature G: Budget-Tracker (reale Ausgaben)
- Neben dem geplanten Budget: tatsachliche Ausgaben erfassen
- Pro Kategorie: geplant vs. ausgegeben
- Belege / Notizen anhangen
- Gesamtubersicht am Ende: "Party hat X EUR gekostet"
- **Warum nicht bypassed:** Persistente Datenhaltung

#### Feature H: Premium-Exklusivthemen
- 5+ zusatzliche Themen, die im Free-Tier nicht erscheinen (z.B. "Barbie", "Minecraft", "Paw Patrol", "Meerjungfrau Deluxe", "Weltraum-Mission")
- Hochwertigere Einladungsvorlagen (animierte CSS-Elemente, professionelles Layout)
- Premium-Rezepte mit detaillierterer Anleitung und Foto-Beschreibungen
- **Warum nicht bypassed:** Serverseitige Content-Filterung per RLS

#### Feature I: Unbegrenzte Shared Links (dauerhaft)
- Free: Links laufen nach 7 Tagen ab
- Pro: Links laufen nie ab, bleiben dauerhaft aktiv
- Planinhalt kann geupdated werden, Link bleibt derselbe
- **Warum nicht bypassed:** Datenbankfeld `expires_at` wird serverseitig gepruft

---

## 3. Pricing-Strategie

### 3.1 Preismodell

```
Free:    0 EUR/Monat    - Fur Eltern die einmal im Jahr planen
Pro:     4,99 EUR/Monat - Fur aktive Eltern / organisierte Familien
Pro:    39,99 EUR/Jahr  - 33% Rabatt, 2 Monate gratis
```

### 3.2 Preispsychologie

- 4,99 EUR ist unter dem "Schmerzpunkt" von 5 EUR - psychologisch wichtig
- Jahresabo preist sich als "Investition fur alle Geburtstage des Jahres"
- Keine Testphase notwendig - Free-Tier ist echte Alternative
- Upgrade-Prompts: kontextuell, nicht aggressiv (erscheinen erst wenn Limit erreicht)

### 3.3 Stripe-Integration

- Zahlungsabwicklung uber Stripe (DSGVO-konform, EU-Server moglich)
- Webhooks: `checkout.session.completed` -> `tier` in `profiles` auf "pro" setzen
- Webhooks: `customer.subscription.deleted` -> `tier` zuruck auf "free"
- Keine eigene Zahlungsverarbeitung - alles uber Stripe Hosted Checkout

---

## 4. Technische Implementierung

### 4.1 Datenbank-Anderungen

#### 4.1.1 Neue Tabellen

```sql
-- Kollaboratoren fur geteilte Plane
CREATE TABLE public.plan_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.saved_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invited_email TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
  accepted_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RSVP-Einladungen
CREATE TABLE public.rsvp_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.saved_plans(id) ON DELETE CASCADE,
  guest_id TEXT NOT NULL,
  child_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  child_allergies TEXT,
  notes TEXT,
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kinderprofile (Pro only)
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  interests TEXT[],
  allergies JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Aufgaben-Manager (Pro only)
CREATE TABLE public.party_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.saved_plans(id) ON DELETE CASCADE,
  title_de TEXT NOT NULL,
  title_en TEXT NOT NULL,
  due_days_before INT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Budget-Tracking (Pro only)
CREATE TABLE public.budget_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.saved_plans(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  planned_amount NUMERIC(8,2),
  actual_amount NUMERIC(8,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stripe-Abos (fur Webhook-Verarbeitung)
CREATE TABLE public.stripe_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 4.1.2 Anderungen an bestehenden Tabellen

```sql
-- saved_plans: Ablaufdatum fur geteilte Links
ALTER TABLE public.saved_plans
  ADD COLUMN share_expires_at TIMESTAMPTZ,
  ADD COLUMN party_date DATE;

-- profiles: Stripe-Referenz
ALTER TABLE public.profiles
  ADD COLUMN stripe_customer_id TEXT UNIQUE;

-- Premium-Themes in themes-Tabelle markieren
ALTER TABLE public.themes
  ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT false;
```

### 4.2 RLS-Policies (Erweiterung)

```sql
-- child_profiles: Nur eigene Profile sichtbar
CREATE POLICY "Users see own child profiles"
  ON public.child_profiles
  FOR ALL USING (auth.uid() = user_id);

-- rsvp_invitations: Planinhaber kann alles, Gaste nur via token
CREATE POLICY "Plan owner manages rsvp"
  ON public.rsvp_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.saved_plans sp
      WHERE sp.id = plan_id AND sp.user_id = auth.uid()
    )
  );

-- Pro-only content: Premium-Themes nur fur Pro sichtbar
CREATE POLICY "Free users see non-premium themes"
  ON public.themes
  FOR SELECT USING (
    is_premium = false
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.tier = 'pro'
    )
  );
```

### 4.3 Feature-Gate: TypeScript-Pattern

```typescript
// src/lib/feature-gates.ts
// Zentrale Feature-Gate-Konfiguration (neutrales File, kein "use client"/"use server")

export const PRO_FEATURES = [
  'collaboration',
  'rsvp_tracking',
  'ai_personalization',
  'ai_chat',
  'task_manager',
  'child_profiles',
  'budget_tracker',
  'premium_themes',
  'unlimited_plans',
  'persistent_share_links',
] as const;

export type ProFeature = typeof PRO_FEATURES[number];

export function isProFeature(feature: ProFeature): true {
  return true; // type guard, used with profile.tier check
}
```

```typescript
// src/hooks/useFeatureGate.ts
"use client";

import { useAuth } from '@/components/auth/AuthProvider';
import type { ProFeature } from '@/lib/feature-gates';

export function useFeatureGate(feature: ProFeature): {
  hasAccess: boolean;
  tier: 'free' | 'pro';
  showUpgrade: () => void;
} {
  const { profile } = useAuth();
  const tier = profile?.tier ?? 'free';
  const hasAccess = tier === 'pro';

  function showUpgrade() {
    // Global event bus oder Router-Navigation zu /upgrade
    window.dispatchEvent(new CustomEvent('show-upgrade-modal', { detail: { feature } }));
  }

  return { hasAccess, tier, showUpgrade };
}
```

### 4.4 API-Routen (neue Server-seitige Endpunkte)

```
src/app/api/
  stripe/
    checkout/route.ts      - Stripe Checkout Session erstellen
    webhook/route.ts       - Stripe Webhooks empfangen + Tier aktualisieren
    portal/route.ts        - Customer Portal (Abo verwalten)
  rsvp/
    send/route.ts          - E-Mail-Einladungen versenden (Resend API)
    respond/[token]/route.ts - RSVP-Antwort verarbeiten
    remind/route.ts        - Erinnerungen versenden
  collaboration/
    invite/route.ts        - Mitbearbeiter einladen
    accept/route.ts        - Einladung annehmen
  tasks/
    generate/route.ts      - KI/Template-basierte Aufgabenliste generieren
    remind/route.ts        - Cron-Job: Erinnerungen senden
```

### 4.5 UI-Komponenten (neue Dateien)

```
src/components/
  upgrade/
    UpgradeModal.tsx        - Modaler Upgrade-Dialog mit Feature-Highlight
    UpgradeBanner.tsx       - Inline-Banner fur gesperrte Features
    PricingPage.tsx         - Vollstandige Preisseite
    FeatureGate.tsx         - Wrapper-Komponente fur gesperrte Features
  collaboration/
    CollabButton.tsx        - "Mit Partner teilen" Button
    CollabManager.tsx       - Mitbearbeiter-Verwaltung
  rsvp/
    RsvpDashboard.tsx       - RSVP-Ubersicht fur den Gastgeber
    RsvpLandingPage.tsx     - Landing Page fur Gaste-RSVP (offentlich)
    SendInvitationModal.tsx - Modal zum Versenden von Einladungen
  child-profiles/
    ChildProfileCard.tsx    - Kindprofil-Karte
    ChildProfileForm.tsx    - Kindprofil erstellen/bearbeiten
    ChildSelector.tsx       - Kindprofil im Wizard auswahlen
  budget/
    BudgetTracker.tsx       - Budget-Tracker-Komponente
    BudgetEntry.tsx         - Einzelne Ausgabe erfassen
  tasks/
    TaskManager.tsx         - Aufgaben-Liste mit Checkboxen
    TaskReminder.tsx        - Erinnerungseinstellungen
```

### 4.6 Neue Seiten

```
src/app/[locale]/
  upgrade/
    page.tsx               - Preisseite / Upgrade-Seite
  rsvp/
    [token]/
      page.tsx             - Gast-RSVP-Seite (offentlich, kein Login)
  collaborate/
    [planId]/
      page.tsx             - Kollaborations-Landing fur eingeladene Nutzer
```

---

## 5. Upgrade-Conversion-Strategie

### 5.1 Upgrade-Touchpoints (wo und wann erscheinen Upgrade-Prompts)

| Trigger | Wo | Botschaft |
|---|---|---|
| 4. Plan speichern | Dashboard | "Du hast alle 3 kostenlosen Plane genutzt" |
| Teilen-Button (nach 7 Tagen) | Ergebnis-Seite | "Dein Link ist abgelaufen - mit Pro bleibt er dauerhaft" |
| Gastliste: E-Mail-Feld | GuestListTab | "Versende digitale Einladungen und tracke RSVPs" |
| Ergebnis: KI-Button | ResultView | "Personalisiere den Plan mit KI fur [Kindname]" |
| Wizard: Kindprofil-Option | Wizard Step 1 | "Speichere das Profil fur nachste Jahr" |

### 5.2 Upgrade-Modal-Design

Das Upgrade-Modal muss:
- Das konkrete Feature zeigen, das geblockt wurde (kontextuell)
- Den Wert in 1-2 Satzen erklaren (nicht Feature-Liste, sondern Problem-Losung)
- Preis transparent zeigen
- Klaren CTA: "Pro freischalten - 4,99 EUR/Monat"
- Subtile "Nicht jetzt" Option (kein Dark Pattern)

---

## 6. Implementierungsplan (Phasen)

### Phase 1: Foundation (2-3 Tage)
- Feature-Gate Hook (`useFeatureGate`)
- `FeatureGate.tsx` Wrapper-Komponente mit Upgrade-Banner
- `UpgradeModal.tsx` und globaler Event-Listener
- `UpgradeBanner.tsx` fur inline-Hints
- Neue Datenbank-Tabellen: Migrationen erstellen und anwenden
- `TIER_LIMITS` in `src/types/index.ts` erweitern
- RLS-Policies fur neue Tabellen

### Phase 2: Stripe-Integration (2-3 Tage)
- Stripe-Account einrichten (Testmodus)
- `/api/stripe/checkout` Route
- `/api/stripe/webhook` Route (tier-Update)
- `/api/stripe/portal` Route (Abo verwalten)
- Preisseite `/upgrade` mit Stripe Checkout-Integration
- Umgebungsvariablen: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_MONTHLY`, `STRIPE_PRICE_ID_YEARLY`

### Phase 3: Kindprofile (1-2 Tage)
- `child_profiles` Tabelle (Migration bereits in Phase 1)
- `ChildProfileForm.tsx` und `ChildProfileCard.tsx`
- `ChildSelector.tsx` in Wizard Step 1 integrieren
- Pro-Gate: nur sichtbar bei Pro-Tier

### Phase 4: Aufgaben-Manager (1-2 Tage)
- `party_tasks` Tabelle
- Standard-Aufgaben-Templates (statisch, kein KI)
- `TaskManager.tsx` in ResultView integrieren (neuer Tab oder Unterabschnitt)
- Erinnerungslogik: Supabase Edge Function oder externe cron-Job-Losung

### Phase 5: Kollaboration (3-4 Tage)
- `plan_collaborators` Tabelle
- `CollabButton.tsx` und `CollabManager.tsx`
- E-Mail-Einladung versenden (Resend API)
- `/collaborate/[planId]` Landing Page fur neue Mitbearbeiter
- Supabase Realtime: Echtzeit-Updates beim gleichzeitigen Bearbeiten
- RLS anpassen fur Mitbearbeiter-Zugriff

### Phase 6: RSVP-Tracking (3-4 Tage)
- `rsvp_invitations` Tabelle
- `RsvpDashboard.tsx` in ResultView (neuer "RSVPs"-Tab, Pro-only)
- `SendInvitationModal.tsx`
- `/api/rsvp/send` Route (Resend API)
- `/rsvp/[token]` offentliche Seite
- E-Mail-Template fur Gaste-Einladung
- Allergie-Erfassung beim RSVP

### Phase 7: Budget-Tracker (1-2 Tage)
- `budget_entries` Tabelle
- `BudgetTracker.tsx` in ResultView (neuer Abschnitt im Plan)
- Pro-Gate

### Phase 8: Premium-Themen (1 Tag)
- `is_premium` Flag in themes-Tabelle
- 5 Premium-Themen hinzufugen
- RLS-Policy fur Premium-Content
- UI: Premium-Badge auf gesperrten Themen im Wizard

---

## 7. Abgrenzung: Was bewusst NICHT in den Paywall kommt

| Feature | Warum frei bleiben? |
|---|---|
| Einkaufsliste | Kernwert, der App Nutzen zeigt |
| Spielempfehlungen (Standard) | Kernwert, Driver fur Registrierung |
| Einladungsvorlagen (Standard) | Kernwert, zeigt Pro-Potential |
| Browser-Druck/Print | Nicht verhinderbar, wware Dark Pattern |
| Sprache wechseln | Zuganglichkeit, kein sinnvoller Paywall |
| Dark Mode | Zuganglichkeit |
| Wizard (alle Schritte) | Ohne guten Wizard kein Nutzer |

---

## 8. Metriken und Erfolgsmessung

### KPIs

| Metrik | Free-Benchmark | Pro-Ziel |
|---|---|---|
| Registrierungsrate (Wizard-Completion -> Register) | >30% | - |
| Free -> Pro Conversion | - | >5% |
| Pro Monthly Retention | - | >85% |
| RSVP-Feature-Nutzung (Pro) | - | >60% der Pro-Nutzer |
| Churn-Grund #1 | - | Keine (messen via Exit-Survey) |

### Tracking-Events (Privacy-first, Plausible Analytics)
- `wizard_completed`
- `plan_saved`
- `plan_limit_reached` (Free)
- `upgrade_modal_shown` + welches Feature
- `upgrade_completed`
- `rsvp_sent`
- `collaboration_invite_sent`
