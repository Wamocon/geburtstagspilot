# KinderPartyPlaner - Implementierungsfortschritt

## Status: V1 Implementierung abgeschlossen

Stand: 12. Mai 2025

---

## Umgesetzte Module (V1)

### 1. Party Wizard (6 Schritte)
- Alter (3-12 Jahre)
- Gaestezahl (3-20)
- Ort (drinnen/draussen/beides)
- Motto (13 Themen + kein Motto, aus Supabase geladen)
- Dauer (2-3.5 Stunden)
- Budget (50-200 EUR oder egal)
- Daten werden in sessionStorage gespeichert

### 2. Zeitplan-Generator (ScheduleTab)
- Automatischer Minutenplan basierend auf Dauer und Spielen
- Farbcodierte Eintraege nach Typ (Empfang, Spiel, Essen, Geschenke, Ende)
- Startzeit-Anpassung durch Benutzer
- Pufferzeiten zwischen Aktivitaeten

### 3. Spiele-Modul (GamesTab)
- 80+ Spiele in der Datenbank mit DE/EN Texten
- Altersgerechte Auswahl basierend auf Wizarddaten
- Aufklappbare Spielkarten mit Anleitung, Material, Dauer
- Spiel-Austausch-Funktion mit Reserve-Spielen

### 4. Essen & Kuchen (FoodTab)
- 14 thematische Kuchenrezepte (eines pro Motto)
- JSONB Zutatenlisten mit Mengenangaben
- 17 Essenvorschlaege mit Mengenberechnung pro Kind
- Kategorisierung: herzhaft, snack, getraenk

### 5. Einkaufsliste (ShoppingTab)
- Automatisch generiert aus Essen, Spielmaterial, Mitgebsel
- Nach Kategorien sortiert (Lebensmittel, Getraenke, Material, Deko, Mitgebsel)
- Checkboxen zum Abhaken
- Mengenberechnung basierend auf Gaestezahl

### 6. Einladungs-Generator (InvitationTab)
- 14 thematische Einladungsvorlagen mit Template-Variablen
- Formular zum Ausfuellen (Gastname, Datum, Uhrzeit, Adresse, RSVP)
- Live-Vorschau mit Motto-Styling (Farben, Emojis)
- PDF-Druck und WhatsApp-Teilen-Funktion

### 7. Mitgebsel (GoodiesTab)
- 36+ Mitgebsel-Artikel in der Datenbank
- 3 Budget-Stufen: Sparfuchs (2 EUR), Goldene Mitte (5 EUR), Deluxe (8 EUR)
- Themen-spezifische und universelle Artikel
- Preis- und Mengenberechnung pro Kind und gesamt

---

## Infrastruktur

### Datenbank (Lokale Supabase via Docker)
- PostgreSQL mit RLS auf allen Tabellen
- Custom Ports: API 54421, DB 54422, Studio 54423, Inbucket 54424, Analytics 54427
- Tabellen: themes, games, recipes, food_items, goodie_bag_items, invitation_templates
- Custom enums: location_type, activity_level, food_category, budget_tier
- Seed-Daten: 14 Themen, 80+ Spiele, 14 Rezepte, 17 Essens-Artikel, 36+ Mitgebsel, 14 Einladungsvorlagen

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
- Professionelle Homepage mit Hero, Features, How-It-Works Sektionen

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
| Statische Seiten (16/16) | Generiert |

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
