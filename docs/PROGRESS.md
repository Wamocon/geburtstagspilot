# Geburtstagspilot - Implementierungsfortschritt

## Status: V1 Implementierung abgeschlossen + Auth/Pro Features

Stand: Mai 2026

---

## Umgesetzte Module (V1 + Erweiterungen)

### 1. Party Wizard (7 Schritte)
- Name und Alter (3-12 Jahre)
- Gaestezahl (3-20) mit optionalen Gaestenamen
- Ort (drinnen/draussen/beides)
- Motto (Themen aus Supabase geladen)
- Dauer (1.5-5 Stunden)
- Allergien/Diaeten (Glutenfrei, Vegan etc.) mit Freitextnotizen
- Budget (optional)
- Daten werden in sessionStorage gespeichert

### 2. Ergebnis-Ansicht (8 Tabs)
- **Aufgaben (TodoTab):** Checkliste fuer die Party-Vorbereitung
- **Zeitablauf (ScheduleTab):** Automatischer Minutenplan, farbcodiert, Startzeit anpassbar
- **Spiele (GamesTab):** 80+ Spiele, altersgerecht, aufklappbar, austauschbar
- **Essen & Kuchen (FoodTab):** Rezepte + Essensvorschlaege mit Mengenberechnung
- **Einkaufsliste (ShoppingTab):** Automatisch generiert, kategorisiert, abhakbar
- **Einladung (InvitationTab):** Thematische Vorlagen, Live-Vorschau, PDF/WhatsApp
- **Mitgebsel (GoodiesTab):** Budget-Stufen, Preis- und Mengenberechnung
- **Gaesteliste (GuestListTab):** Gaesteverwaltung

### 3. Authentifizierung & Benutzerverwaltung
- Supabase Auth (E-Mail/Passwort)
- Login/Registrierung/Callback Seiten
- AuthProvider mit Session-Management
- UserMenu mit Logout
- Profiltabelle mit Rollen (user/admin) und Tier (free/pro)

### 4. Dashboard & Planverwaltung
- Gespeicherte Plaene laden und anzeigen (PlanCard)
- Plaene speichern mit Tier-Limits (3 Free, 50 Pro)
- Plan-Sharing mit oeffentlichen Links (ShareToken)

### 5. Free/Pro Modell
- Feature-Gates fuer Pro-Features (feature-gates.ts)
- FeatureGate-Komponente, UpgradeBanner, UpgradeModal
- Pro-Anfrage Workflow (Admin-Genehmigung)
- Upgrade-Seite

### 6. KI-Features (Pro)
- AI Chat-Assistent (AiChatPanel)
- KI-Spielgenerierung (/api/ai/generate-game)
- KI-Einladungstexte (/api/ai/generate-invitation)
- OpenAI API Integration (provider.ts, prompts.ts)

### 7. Admin-Dashboard
- Benutzerstatistiken (Gesamt, Pro, Plaene)
- Pro-Anfragen verwalten (genehmigen/ablehnen)
- Navigation zu Benutzer-, Plan- und Anfragen-Listen

---

## Infrastruktur

### Datenbank (Supabase)
- PostgreSQL mit RLS auf allen Tabellen
- Tabellen: themes, games, recipes, food_items, goodie_bag_items, invitation_templates, profiles, saved_plans, pro_requests
- Custom enums: location_type, activity_level, food_category, budget_tier
- Seed-Daten: 14 Themen, 80+ Spiele, 14 Rezepte, 17 Essens-Artikel, 36+ Mitgebsel, 14 Einladungsvorlagen
- Migrationen in supabase/migrations/

### Internationalisierung (next-intl)
- Deutsch (Standardsprache) und Englisch
- Middleware-basierte Locale-Erkennung
- Alle Texte ueber useTranslations-Hook
- Sprachumschalter im Header

### Theming
- Light/Dark Mode mit localStorage-Persistenz
- Tailwind CSS v4 mit Custom Party-Farben
- Nunito als Schriftart

### Branding
- Party-Purple (#7C3AED) als Primaerfarbe
- SVG Favicon mit Ballon-Emoji
- Professionelle Homepage mit Hero, Features, How-It-Works, Testimonials

### Rechtliche Seiten
- Impressum (WAMOCON GmbH)
- Datenschutzerklaerung
- Allgemeine Geschaeftsbedingungen
- Links im Footer

---

## Verifikation

| Pruefung | Status |
|---|---|
| TypeScript (tsc --noEmit) | Bestanden |
| ESLint | Bestanden |
| Next.js Build | Bestanden |

---

## Bekannte Einschraenkungen / Hindernisse

1. **Middleware-Deprecation**: Next.js 16 zeigt eine Warnung, dass `middleware.ts` zugunsten von `proxy` veraltet ist. next-intl nutzt noch die Middleware-API. Funktioniert weiterhin, sollte aber bei einer next-intl-Aktualisierung migriert werden.

2. **PDF-Export**: Aktuell ueber `window.print()` implementiert. Eine dedizierte PDF-Bibliothek (z.B. pdf-lib) koennte fuer bessere Formatierung integriert werden.

3. **Keine Authentifizierung**: V1 ist ohne Login. Alle Daten sind lokal im Browser (sessionStorage). Fuer V2 koennte Supabase Auth hinzugefuegt werden.

4. **Keine persistente Speicherung**: Party-Plaene werden nicht serverseitig gespeichert. Beim Schliessen des Browsers gehen die Daten verloren.

5. **Supabase Docker muss laufen**: Die App benoetigt eine laufende lokale Supabase-Instanz fuer die Datenbankabfragen. Fuer Produktion muss auf eine gehostete Supabase-Instanz umgestellt werden.

---

## Dateistruktur

```
src/
  app/
    globals.css                    # Tailwind v4 mit Party-Theme
    layout.tsx                     # Root Layout
    page.tsx                       # Root Redirect
    [locale]/
      layout.tsx                   # Locale Layout mit Fonts, Dark Mode
      page.tsx                     # Homepage
      wizard/page.tsx              # Wizard-Seite
      result/page.tsx              # Ergebnis-Seite
      imprint/page.tsx             # Impressum
      privacy/page.tsx             # Datenschutz
      terms/page.tsx               # AGB
  components/
    layout/
      Header.tsx                   # Sticky Header mit Navigation
      Footer.tsx                   # Footer mit Legal-Links
    ui/
      LanguageSwitcher.tsx         # DE/EN Umschalter
      ThemeToggle.tsx              # Light/Dark Umschalter
    wizard/
      PartyWizard.tsx              # 6-Schritt Wizard
    result/
      ResultView.tsx               # Haupt-Ergebnis mit 6 Tabs
      tabs/
        ScheduleTab.tsx            # Zeitplan
        GamesTab.tsx               # Spiele
        FoodTab.tsx                # Essen & Kuchen
        ShoppingTab.tsx            # Einkaufsliste
        InvitationTab.tsx          # Einladung
        GoodiesTab.tsx             # Mitgebsel
  lib/
    supabase.ts                    # Client-seitiger Supabase-Client
    supabase-server.ts             # Server-seitiger Supabase-Client
    data.ts                        # Datenabruf-Funktionen
    plan-generator.ts              # Zeitplan- und Mengenberechnung
  types/
    index.ts                       # Alle TypeScript-Interfaces
  i18n/
    routing.ts                     # next-intl Routing-Konfiguration
    request.ts                     # Server-seitige Locale-Konfiguration
    navigation.ts                  # Navigations-Helfer
  messages/
    de.json                        # Deutsche Uebersetzungen
    en.json                        # Englische Uebersetzungen
  middleware.ts                    # next-intl Locale-Middleware
supabase/
  config.toml                      # Lokale Supabase-Konfiguration
  migrations/
    20260512120000_initial_schema.sql  # Datenbank-Schema
  seed.sql                         # Testdaten (80+ Spiele, etc.)
```
