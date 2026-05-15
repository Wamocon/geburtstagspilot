# Geburtstagspilot - UX/UI Todo List

## Status-Legende
- ✅ Erledigt
- 🔄 In Arbeit
- ⬜ Offen
- 🔴 Dringend
- 🟡 Mittel
- 🟢 Niedrig

---

## Erledigte Korrekturen (diese Session)

| # | Aufgabe | Prioritaet | Status |
|---|---------|-----------|--------|
| 1 | HTML-Entity Icons (&#128228;) durch echte Emojis ersetzen | 🔴 | ✅ |
| 2 | Einheitlicher Pro-Anfrage-Flow (Admin-Genehmigung statt Stripe-Alert) | 🔴 | ✅ |
| 3 | Preise anpassen (1,99 EUR/Monat, 14,99 EUR/Jahr) | 🟡 | ✅ |
| 4 | "Werbung entfernen" Feature entfernen | 🟡 | ✅ |
| 5 | Gaesteliste: Interne Scrollbar entfernen | 🟡 | ✅ |
| 6 | "Ohne Motto" an erste Stelle setzen | 🟡 | ✅ |
| 7 | Partydauer: Mehr Optionen + Freiauswahl (1.5-8h) | 🟡 | ✅ |
| 8 | Zeitablauf: Gesamtdauer + Endzeit anzeigen | 🟡 | ✅ |
| 9 | Umlaut-Fehler in Seed-Daten korrigieren (Migration) | 🟡 | ✅ |
| 10 | Desktop Tab-Leiste: Kein Scroll, flex-wrap | 🔴 | ✅ |
| 11 | Einladung: Kontrastprobleme bei dunklem Hintergrund beheben | 🔴 | ✅ |
| 12 | Sektionen ein-/ausschaltbar (Essen, Einkaufsliste etc.) | 🟡 | ✅ |
| 13 | pro_requests DB-Tabelle fuer Admin-Workflow | 🟡 | ✅ |

---

## Offene UX/UI Verbesserungen

### Dringend (vor Launch)

| # | Aufgabe | Bereich | Status |
|---|---------|---------|--------|
| 14 | Stripe/Payment-Integration fuer Pro-Plan | Upgrade | ⬜ 🔴 |
| 15 | Admin-Dashboard: Pro-Anfragen verwalten (genehmigen/ablehnen) | Admin | ⬜ 🔴 |
| 16 | E-Mail-Benachrichtigung bei Pro-Statusaenderung | Backend | ⬜ 🔴 |
| 17 | Mobile Navigation: Hamburger-Menu fuer kleine Bildschirme | Layout | ⬜ 🔴 |
| 18 | PWA-Support (installierbar, offline-faehig) | Infra | ⬜ 🟡 |

### Mittel (Qualitaet)

| # | Aufgabe | Bereich | Status |
|---|---------|---------|--------|
| 19 | Drag & Drop fuer Zeitablauf-Reihenfolge | Zeitablauf | ⬜ 🟡 |
| 20 | Druckansicht (Print CSS) optimieren | Result | ⬜ 🟡 |
| 21 | Onboarding-Tour fuer Erstbenutzer | UX | ⬜ 🟡 |
| 22 | Dark Mode: Alle Komponenten visuell pruefen | Design | ⬜ 🟡 |
| 23 | Einladung: Mehr Hintergrund-Vorlagen (themenspezifisch) | Einladung | ⬜ 🟡 |
| 24 | Gaestemanagement: CSV-Import/-Export | Gaesteliste | ⬜ 🟡 |
| 25 | Benachrichtigungen/Toast-System fuer Aktionen | UX | ⬜ 🟡 |
| 26 | Lade-Skeleton fuer alle Seiten statt Spinner | UX | ⬜ 🟡 |
| 27 | Tastaturnavigation und Accessibility (WCAG 2.1) | A11y | ⬜ 🟡 |

### Niedrig (Nice-to-have)

| # | Aufgabe | Bereich | Status |
|---|---------|---------|--------|
| 28 | Animationen/Micro-Interactions verbessern | Design | ⬜ 🟢 |
| 29 | Feedback-Widget (In-App Bug-Report) | UX | ⬜ 🟢 |
| 30 | Mehrere Plaene gleichzeitig vergleichen | Dashboard | ⬜ 🟢 |
| 31 | Social-Media-Share (Instagram Story, Facebook) | Share | ⬜ 🟢 |
| 32 | Foto-Upload fuer Party-Nachbericht | Pro | ⬜ 🟢 |
| 33 | Kalender-Export (ICS-Datei) | Result | ⬜ 🟢 |
| 34 | Spiel-Bewertung nach der Party | Result | ⬜ 🟢 |
| 35 | Favoritenspiele speichern | Dashboard | ⬜ 🟢 |

---

## Architektur-Hinweise

- **Pro-Freischaltung**: Aktuell ueber Admin-Genehmigung. Spaeter Stripe-Integration moeglich.
- **KI-Features**: Benoetigen `OPENAI_API_KEY` Umgebungsvariable. Graceful Fallback wenn nicht gesetzt.
- **Section Toggle**: Zeitablauf ist immer sichtbar (Pflichttab). Alle anderen koennen deaktiviert werden.
- **Einladungskontrast**: Automatische Erkennung + manueller Textfarben-Picker verfuegbar.
