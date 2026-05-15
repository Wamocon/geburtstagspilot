# Anforderungsdokument Geburtstagspilot (Kindergeburtstag-Planungs-App)
## Softwareprojekt Welle 10

---

| | |
|---|---|
| **Projekt** | Geburtstagspilot. Dein kompletter Kindergeburtstag in 5 Minuten |
| **Unternehmen** | WAMOCON GmbH |
| **App Version** | 1 |
| **Erstellt von** | Daniel Moretz |
| **Eingereicht an** | Waleri Moretz (Geschäftsführung) |
| **Datum** | 6. Mai 2026 |
| **Vertraulichkeit** | Intern vertraulich |
| **Status** | Zur Freigabe eingereicht |

---

## 1. Zusammenfassung

### 1.1 Die Idee

**Geburtstagspilot** ist eine browserbasierte Web-App, die Eltern in unter 5 Minuten einen kompletten Kindergeburtstag plant von der Einladung über den Zeitablauf, Spiele mit Anleitung, Kuchen- und Essensideen bis zur Einkaufsliste und den Goodie-Bags. Kein Account nötig, sofort Ergebnis, PDF-Export, WhatsApp-teilbar.

Das Produkt löst ein universelles Elternproblem: Jedes Jahr, jedes Kind, derselbe Stress. Was ist das Motto? Welche Spiele passen zum Alter? Wie viele Würstchen für 12 Kinder? Was kommt in die Mitgebsel-Tüten? Wie strukturiere ich 3 Stunden, damit kein Chaos ausbricht? Bisher: Pinterest-Spirale, Mama-Blogs, WhatsApp-Gruppen, improvisierte Excel-Listen.

**V1** liefert einen personalisierten Komplettplan per Wizard: Alter des Kindes (3–12), Gästezahl, Indoor/Outdoor, Motto-Wahl → automatischer Zeitablauf (3 Stunden), 5 altersgerechte Spiele mit Schritt-für-Schritt-Anleitung, Kuchen-Rezept, Essens-/Getränke-Vorschläge, Einkaufsliste (berechnet auf Gästezahl), Einladungs-Template (PDF + WhatsApp-Bild), Goodie-Bag-Ideen.

**V2** ergänzt KI: Spieleempfehlungen nach Wetterlage und Platzverhältnissen, ein visueller Einladungs-Designer, Kosten-Kalkulation, KI-Motto-Generator aus Interessen des Kindes und eine Community-Funktion für Eltern-Bewertungen und eigene Spielideen.

### 1.2 Warum jetzt?

Drei konvergierende Trends machen dieses Produkt gerade jetzt relevant:

**Eltern-Burnout und Perfektionsdruck.** Social Media (Instagram, Pinterest) hat die Erwartungshaltung an Kindergeburtstage massiv erhöht. 67 % der Eltern empfinden die Planung als stressig, 43 % beginnen erst eine Woche vorher (Forsa Familienstudie 2025). Gleichzeitig steigt der Anteil berufstätiger Elternpaare (beide Partner erwerbstätig: 72 % in DE, Destatis Mikrozensus 2025), weniger Zeit für Planung.

**Steigende Kosten, sinkende Budgets.** Die durchschnittlichen Ausgaben für einen Kindergeburtstag in DE liegen bei €150–350 (Statista Consumer Insights 2025). Inflation und Energiekosten drücken auf Budgets. Eltern suchen nach kosteneffizienten, aber trotzdem besonderen Feiern, genau das leistet ein strukturierter Plan.

**Mobile-First-Eltern.** 89 % der Eltern mit Kindern unter 12 nutzen Smartphones als primäres Planungsinstrument (Bitkom Familien-Digital-Index 2025). Browser-basierte Tools, die ohne App-Download funktionieren, haben minimale Einstiegshürden.

**Kein dominanter Anbieter in DACH.** Bestehende Angebote sind fragmentiert: Mama-Blogs (nicht interaktiv), Pinterest-Boards (unstrukturiert), einzelne Spiele-Sammlungen ohne Planungsfunktion. Es gibt kein Tool, das den gesamten Planungs-Workflow aus einem Guss liefert.

Quellen: Forsa Familienstudie 2025, Destatis Mikrozensus 2025, Statista Consumer Insights. Kindergeburtstage DE 2025, Bitkom Familien-Digital-Index 2025

---

## 2. Marktanalyse: Fokus DACH

### 2.1 Zielmarkt und Segmentierung

Der adressierbare Markt umfasst Haushalte mit Kindern im feierrelevanten Alter (3–12 Jahre):

- **Deutschland:** 6,4 Mio. Kinder im Alter 3–12 (Destatis Bevölkerungsstatistik 2025)
- **Österreich:** 720.000 Kinder im Alter 3–12 (Statistik Austria 2025)
- **Schweiz:** 680.000 Kinder im Alter 3–12 (BFS Bevölkerung 2025)
- **Gesamt DACH:** ~7,8 Mio. Kinder → ~7,8 Mio. potenzielle Kindergeburtstage pro Jahr

Nicht jeder Geburtstag wird als Party gefeiert. Realistisch schätzen Branchenexperten, dass 60–70 % der Kinder eine Feier mit Gästen haben (Spielen-und-Feiern.de Branchenreport 2025), also **~4,5–5,5 Mio. Kindergeburtstagsfeiern pro Jahr** im DACH-Raum.

### 2.2 Marktvolumen

Der Kindergeburtstags-Markt ist ein Teilsegment des Kinderevents- und Partybedarfs-Marktes:

- **Durchschnittliche Ausgaben pro Feier:** €150–350 (Statista 2025)
- **Gesamtmarktvolumen DACH:** ~€750 Mio. – €1,9 Mrd./Jahr (Partybedarf + Gastronomie + Eventlocations + Dekoration)
- **Digitales Segment (Tools, Templates, Content):** Noch weitgehend unmonetarisiert, geschätztes Potenzial €15–30 Mio./Jahr bei 1–2 % Penetration mit digitalem Planungstool

Der Markt ist stark saisonal (Peaks: September–November und März–Juni, Tief: Juli/August Ferien und Dezember/Weihnachten).

### 2.3 Das Kernproblem: Fragmentierte Information, kein Workflow

Eltern stehen vor einem wiederkehrenden Planungsproblem, das sie jedes Jahr von Null lösen:

**Informationsquelle-Chaos.** Spiele auf Pinterest, Rezepte auf Chefkoch, Einladungen auf Canva, Einkaufsliste in der Notizen-App, Mengenberechnung im Kopf, 5+ Tools für eine 3-Stunden-Feier.

**Altersgerechte Auswahl.** Was funktioniert mit 4-Jährigen ist für 9-Jährige peinlich. Eltern googeln "Spiele Kindergeburtstag 7 Jahre" und bekommen 200 Ergebnisse ohne Filterung.

**Mengenplanung.** 8 Kinder, 3 Stunden, wie viele Würstchen, Brötchen, Saft, Kuchen? Zu wenig = Chaos, zu viel = Verschwendung. Keine schnelle Berechnung.

**Zeitstruktur fehlt.** Ohne Ablaufplan: Kinder kommen an, 20 Minuten Chaos, dann fällt den Eltern kein Spiel ein, dann essen, dann Geschenke, dann warten auf Abholung. Mit Ablaufplan: strukturierte 3 Stunden mit Ankommen, 3 Spielrunden, Essen, Kuchen, Geschenke, Abschluss.

**Wiederholung ohne Lernen.** Jedes Jahr dasselbe von vorn, weil nichts gespeichert, nichts wiederverwendet wird.

### 2.4 Regulatorischer Kontext

Kein regulatorischer Overhead. Keine personenbezogenen Daten von Kindern in V1 erforderlich (kein Account, kein Upload von Kinderfotos). DSGVO-Anforderungen minimal: Cookie-freies Hosting, keine Tracking-Pixel, kein Drittanbieter-Analytics außer Plausible (EU, cookiefrei).

Quellen: Destatis Bevölkerungsstatistik 2025, Statistik Austria Bevölkerung 2025, BFS Schweiz 2025, Statista Consumer Insights 2025, Forsa Familienstudie 2025, Bitkom Familien-Digital-Index 2025

---

## 3. Wettbewerb

### 3.1 Direkte und indirekte Anbieter

| Anbieter | Art | Stärke | Schwäche / Chance für Geburtstagspilot |
|---|---|---|---|
| **Pinterest** | Plattform | Riesige Inspirationsquelle, visuell | Keine Struktur, kein Workflow, keine Mengenberechnung, Zeitfresser |
| **Mama-Blogs** (z.B. Hallo-Eltern, Familie.de) | Content | Gute Spielideen, SEO-stark | Keine Interaktivität, keine Personalisierung nach Alter/Gästezahl, Werbung |
| **Canva** | Design-Tool | Einladungen gestalten | Nur Einladungen, kein Planungstool, Overkill für einen DIN-A5-Zettel |
| **Kindergeburtstag-Planen.de** | Blog + PDFs | Strukturierte Checklisten | Keine personalisierte Berechnung, PDFs statisch, kein Wizard |
| **Amazon / Partybedarfs-Shops** | E-Commerce | Produkte kaufen | Keine Planung, nur Verkauf |
| **Geburtstagsfee.de** | E-Commerce + Content | Dekoration + Spielideen | Fokus auf Produktverkauf, keine Ablaufplanung |
| **ChatGPT / KI-Assistenten** | Generative AI | Flexible Antworten | Kein strukturierter Workflow, keine Mengenberechnung, kein PDF-Export, Halluzinationen bei Spielregeln |

**Marktlücke:** Kein Anbieter kombiniert **altersgerechte Personalisierung**, **Mengenberechnung**, **Zeitablauf-Generator**, **Einladungs-Template**, **Einkaufsliste** und **PDF-Export** in einem schnellen, mobil-optimierten Wizard ohne Account.

### 3.2 Warum Blog-Content nicht reicht

| Problem mit Blog-Ansatz | Lösung Geburtstagspilot |
|---|---|
| Statische Listen (nicht personalisiert) | Wizard mit Alter × Gästezahl × Motto × Indoor/Outdoor |
| Mengen unklar ("etwas Saft, ein paar Würstchen") | Exakte Berechnung: 12 Kinder × 2 Würstchen = 24 Würstchen |
| Kein Zeitablauf | Automatischer 3-Stunden-Plan mit Minutenangaben |
| Keine Einkaufsliste | 1-Klick-Einkaufsliste nach Kategorie |
| Keine Einladung | Druckfertige Einladung mit allen Infos |
| Werbung, Cookie-Banner, Ablenkung | Clean UI, keine Werbung in Free-Tier, fokussiert |

---

## 4. Zielgruppe

### 4.1 Primäre Zielgruppe

**Eltern mit Kindern im Alter 3–12 Jahre** im DACH-Raum, die den Kindergeburtstag zu Hause oder im Garten feiern.

Vier Nutzerprofile:

**Erstgeburtstags-Mutter/Vater (Kind wird 3–4).** Erste "richtige" Party mit Gästen. Unsicher, was altersgerecht ist. Will nichts falsch machen. Braucht: einfache Spiele, kurzer Ablauf (2 Stunden), wenige Gäste, sichere Essensideen.

**Routine-Eltern (Kind wird 5–8).** Jedes Jahr dasselbe Theater. Suchen Inspiration, die sich vom letzten Jahr unterscheidet. Braucht: neues Motto, andere Spiele, effiziente Planung ("Ich will das in 10 Minuten erledigt haben").

**Motto-Perfektionisten (Kind wird 6–10).** Wollen eine Instagram-würdige Party. Piraten, Einhörner, Detektive, Weltraum, alles muss zum Motto passen. Braucht: thematisch abgestimmte Spiele, Deko-Ideen, Einladungs-Design.

**Last-Minute-Eltern (alle Altersgruppen).** Geburtstag ist in 3 Tagen, nichts geplant. Panik. Braucht: sofort einen Komplettplan mit Einkaufsliste, die sie am gleichen Tag abarbeiten können.

### 4.2 Sekundäre Zielgruppe

- **Großeltern**, die den Geburtstag organisieren (zunehmend, wenn beide Eltern arbeiten)
- **Tagesmütter/Kita-Erzieher**, die Geburtstagsfeiern in der Einrichtung planen
- **Kindergeburtstags-Eventanbieter**, die strukturierte Ablaufpläne als Upsell nutzen

### 4.3 Nicht Zielgruppe

- Teenager-Partys (13+), anderer Bedarf, andere Dynamik
- Professionelle Event-Agenturen, brauchen andere Tools
- Geburtstage in kommerziellen Locations (Indoor-Spielplatz, Kletterhalle). Dort plant die Location

---

## 5. Nutzen

### 5.1 Nutzen für die Nutzer (Eltern)

| Problem heute | Lösung durch Geburtstagspilot | Konkreter Vorteil |
|---|---|---|
| Stundenlange Recherche auf Pinterest/Blogs | Wizard generiert Komplettplan in 5 Minuten | 3–5 Stunden Planungszeit gespart |
| Keine altersgerechte Filterung | Spiele und Ablauf angepasst an exaktes Alter | Keine peinlichen Spiel-Fails |
| Mengenplanung im Kopf → zu viel/zu wenig | Automatische Berechnung auf Gästezahl | Kein Überkauf, keine Unterversorgung |
| Kein Zeitablauf → Chaos auf der Feier | 3-Stunden-Minutenplan mit Puffern | Strukturierte, entspannte Feier |
| Einladungen basteln oder Canva-Kampf | 1-Klick-Einladung als PDF + WhatsApp-Bild | In 60 Sekunden versendet |
| Jedes Jahr von Null anfangen | Bewährte, kuratierte Inhalte | Vertrauen statt Unsicherheit |

### 5.2 Nutzen für die WAMOCON GmbH

**Extrem breite Zielgruppe:** 4,5+ Mio. Kindergeburtstage/Jahr in DACH, jedes Elternteil ist potenzieller Nutzer, ohne Branchen- oder Berufsfilter.

**Virales Wachstum:** Eltern teilen Einladungen → Empfänger-Eltern sehen das Tool → planen ihren nächsten Geburtstag damit. Natürlicher Empfehlungskreislauf.

**Wiederkehrende Nutzung:** Pro Kind mindestens 7–10 Jahre Kindergeburtstage. Bei 2+ Kindern: jahrelange Nutzung.

**SEO-Goldmine:** "Kindergeburtstag Spiele 6 Jahre", "Kindergeburtstag Motto Ideen", "Kindergeburtstag Einkaufsliste", hochvolumige, transaktionsnahe Suchanfragen mit geringem Wettbewerb durch spezialisierte Tools.

**Affiliate- und Lead-Potential:** Einkaufsliste → Affiliate-Links zu Amazon/Partybedarf-Shops. Eventlocations → Lead-Gen.

**Ultra-niedrige Infrastrukturkosten:** 100 % client-seitig in V1. Hosting €0 (Cloudflare Pages / Vercel Hobby). Keine API-Kosten, keine Datenbank.

---

## 6. Abhängigkeiten und Machbarkeit

### 6.1 Technische Services

| Service | Funktion | Abhängigkeit | Kosten V1 |
|---|---|---|---|
| **Cloudflare Pages / Vercel Hobby** | Statisches Hosting, CDN | Keine Exklusiv | €0/Monat |
| **pdf-lib (Open Source)** | PDF-Generierung im Browser | MIT-Lizenz | €0 |
| **html2canvas / dom-to-image** | Einladungs-Bild-Export | Open Source | €0 |
| **Plausible Analytics (EU)** | Cookie-freie Nutzungsstatistik | Optional | €9/Monat |
| **Stripe** | Pro-Tier-Zahlung | Zertifiziert | 1,4 % + €0,25/Tx |

### 6.2 Keine externen APIs in V1

V1 arbeitet komplett ohne externe APIs. Alle Daten (Spiele-Datenbank, Rezepte, Mengenformeln, Einladungs-Templates) sind statisch im Frontend eingebettet. Das bedeutet:

- Keine Laufzeitkosten
- Keine API-Rate-Limits
- Keine Downtime-Abhängigkeiten
- Offline-fähig als PWA (nach erstem Laden)

### 6.3 V2-Abhängigkeiten (Vorausschau)

| Service | V2-Funktion | Kosten |
|---|---|---|
| **OpenWeatherMap API** | Wetter-basierte Spieleempfehlung (Indoor/Outdoor) | Free Tier reicht |
| **OpenAI API / Mistral** | KI-Motto-Generator, personalisierte Spielideen | ~€0,01/Anfrage |
| **Supabase (EU)** | Community-Spielideen, Nutzerkonten | Ab €25/Monat |

### 6.4 Gesamtbewertung

V1 ist ohne jede Partnerschaft, ohne Behördengenehmigung und ohne laufende API-Kosten umsetzbar. Das Produkt kann in **2–3 Wochen** von einem Solo-/Duo-Entwicklerteam gelauncht werden. Kein regulatorisches Risiko, kein Datenschutz-Overhead (kein Account, keine Kinderdaten).

---

## 7. Anforderungen Version 1

### 7.1 Hauptprozesse

#### 7.1.1 Party-Wizard (Kernprozess)

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| PW-01 | Wizard-Schritt 1: Alter des Kindes (3–12 Jahre, Dropdown oder Slider) | Muss | Neu |
| PW-02 | Wizard-Schritt 2: Gästezahl (3–20 Kinder, Dropdown) | Muss | Neu |
| PW-03 | Wizard-Schritt 3: Indoor / Outdoor / Beides | Muss | Neu |
| PW-04 | Wizard-Schritt 4: Motto-Wahl aus kuratierter Liste (Piraten, Prinzessin, Dinos, Weltraum, Fußball, Detektiv, Einhorn, Tiere, Superhelden, Zirkus, Ritter, Meerjungfrau, Dschungel, ohne Motto) | Muss | Neu |
| PW-05 | Wizard-Schritt 5: Dauer (2 / 2,5 / 3 / 3,5 Stunden) | Muss | Neu |
| PW-06 | Wizard-Schritt 6: Budget-Rahmen (optional: €50 / €100 / €150 / €200 / egal) | Soll | Neu |
| PW-07 | Wizard generiert Ergebnis sofort nach letztem Schritt (kein Server-Request) | Muss | Neu |
| PW-08 | Ergebnis-Seite zeigt alle Sektionen übersichtlich mit Tabs oder Akkordeon | Muss | Neu |

#### 7.1.2 Zeitablaufplan

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| ZA-01 | Automatischer Zeitablauf basierend auf gewählter Dauer (z.B. 3h: 14:00–17:00) | Muss | Neu |
| ZA-02 | Phasen: Ankommen & Freispiel (20 Min) → Begrüßung (5 Min) → Spiel 1 (15–20 Min) → Spiel 2 (15–20 Min) → Essen/Kuchen (25 Min) → Spiel 3 (15–20 Min) → Geschenke auspacken (15 Min) → Freispiel/Abholung (15–20 Min) | Muss | Neu |
| ZA-03 | Puffer-Zeiten zwischen Phasen automatisch eingeplant | Muss | Neu |
| ZA-04 | Drag-and-Drop-Reihenfolge anpassen (Spiel 2 vor Kuchen) | Soll | Neu |
| ZA-05 | Startzeit anpassbar (Ergebnis rechnet alle Zeiten automatisch um) | Muss | Neu |
| ZA-06 | PDF-Export des Zeitablaufs (1 Seite, druckbar) | Muss | Neu |

#### 7.1.3 Spiele-Empfehlungen

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| SP-01 | Datenbank mit mindestens 80 Spielen, kategorisiert nach Alter (3–4, 5–6, 7–8, 9–10, 11–12), Indoor/Outdoor, Aktivitätslevel (ruhig/aktiv/wild) | Muss | Neu |
| SP-02 | Jedes Spiel: Name, Beschreibung (3–5 Sätze), Schritt-für-Schritt-Anleitung, benötigtes Material, Dauer, Mindestteilnehmerzahl | Muss | Neu |
| SP-03 | Motto-Filter: Spiele passend zum gewählten Motto (z.B. Piraten → Schatzsuche, Einhorn → Regenbogenlauf) | Muss | Neu |
| SP-04 | 5 Spiele pro Plan vorgeschlagen (Mix aus aktiv + ruhig), davon 3 im Zeitablauf fest und 2 als Reserve | Muss | Neu |
| SP-05 | "Dieses Spiel austauschen" → nächster passender Vorschlag | Muss | Neu |
| SP-06 | Benötigtes Material aus Spielen automatisch in Einkaufsliste übernommen | Muss | Neu |

#### 7.1.4 Kuchen- und Essensvorschläge

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| KE-01 | 1 Kuchen-Rezept passend zum Motto (z.B. Piraten → Schiffskuchen, Dinos → Vulkan-Kuchen) mit Schritt-für-Schritt-Anleitung und Foto-Beschreibung | Muss | Neu |
| KE-02 | Essensvorschläge: Herzhaft (Würstchen, Pizza, Mini-Burger, Gemüsesticks) + Snacks (Popcorn, Obstspieße, Brezeln) + Getränke (Saft, Wasser, Kinderbowle) | Muss | Neu |
| KE-03 | Mengenberechnung pro Gast (z.B. 2 Würstchen/Kind, 0,5L Getränke/Kind, 1 Stück Kuchen + 1 Reserve) | Muss | Neu |
| KE-04 | Allergiker-Hinweis Toggle (glutenfrei, laktosefrei, nussfrei) → alternative Rezepte | Soll | Neu |
| KE-05 | Rezept-Zutaten automatisch in Einkaufsliste | Muss | Neu |

#### 7.1.5 Einkaufsliste

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| EK-01 | Automatisch generierte Einkaufsliste aus: Essen + Spiel-Material + Deko + Goodie-Bags | Muss | Neu |
| EK-02 | Mengen auf Gästezahl berechnet + 10 % Puffer | Muss | Neu |
| EK-03 | Kategorisiert: Lebensmittel / Getränke / Bastelmaterial / Deko / Goodie-Bag-Inhalt | Muss | Neu |
| EK-04 | Abhak-Funktion (Checkbox pro Artikel) | Muss | Neu |
| EK-05 | PDF-Export der Einkaufsliste | Muss | Neu |
| EK-06 | WhatsApp-Share der Liste (als Text) | Soll | Neu |

#### 7.1.6 Einladungs-Generator

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| EI-01 | Einladungs-Template pro Motto (visuell, kindgerecht, A5/A6) | Muss | Neu |
| EI-02 | Felder: Name des Kindes, Alter wird, Datum, Uhrzeit, Adresse, RSVP-Datum, "Bitte mitbringen" (z.B. Regenhose, Schwimmzeug) | Muss | Neu |
| EI-03 | PDF-Export (2× A5 auf A4 zum Drucken) | Muss | Neu |
| EI-04 | WhatsApp-Bild-Export (1080×1080 PNG/JPG) | Muss | Neu |
| EI-05 | QR-Code zur Party-Seite (optional, für digitale Einladung) | Soll | Neu |

#### 7.1.7 Goodie-Bag-Ideen

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| GB-01 | 5 Goodie-Bag-Vorschläge pro Motto + Budget-Stufe (€2/Kind, €5/Kind, €8/Kind) | Muss | Neu |
| GB-02 | Artikelliste mit Mengenberechnung auf Gästezahl | Muss | Neu |
| GB-03 | Goodie-Bag-Material in Einkaufsliste integriert | Muss | Neu |

### 7.2 Basisfunktionalitäten

| ID | Anforderung | Priorität | Status |
|---|---|---|---|
| BF-01 | Kein Account/Login für V1 nötig. Wizard sofort nutzbar | Muss | Neu |
| BF-02 | Ergebnis als Permalink speicherbar (URL mit Parametern oder Hash-basiert) | Muss | Neu |
| BF-03 | Gesamtplan als PDF-Export (alles auf 3–4 Seiten: Ablauf + Spiele + Einkaufsliste + Einladung) | Muss | Neu |
| BF-04 | Responsive Mobile-First-Design | Muss | Neu |
| BF-05 | Offline-fähig als PWA (Service Worker für Wiederöffnen) | Soll | Neu |
| BF-06 | Ladezeit <2 Sekunden (statisches Hosting, keine API-Calls) | Muss | Neu |
| BF-07 | Cookie-freies Tracking (Plausible) | Muss | Neu |
| BF-08 | DSGVO: Datenschutzerklärung, Impressum, kein Tracking ohne Consent | Muss | Neu |
| BF-09 | Deutsche Sprache als Standard, erweiterbar auf AT/CH-Varianten | Muss | Neu |

### 7.3 Preismodell

| Tier | Preis | Inhalt |
|---|---|---|
| **Free** | €0 | 1 Komplettplan/Monat, Basis-Einladung, PDF-Export (mit Branding) |
| **Party-Paket** | €4,99 einmalig | Unbegrenzte Pläne, Premium-Einladungs-Templates (10+ Designs), Einkaufsliste ohne Branding, alle Mottos |
| **Party-Pro** | €9,99 einmalig | Alles aus Party-Paket + Einladungs-Designer (eigene Farben, Foto-Upload), Kosten-Kalkulator, Spiele-Volldatenbank (80+ Spiele mit Varianten) |

### 7.4 Scope: Was ist Version 1 und was nicht

| In Scope Version 1 | Out of Scope, ab V2 |
|---|---|
| Party-Wizard mit 6 Schritten | KI-Motto-Generator aus Interessen |
| Zeitablaufplan mit Drag-and-Drop | Wetter-basierte Spielanpassung (API) |
| 80+ kuratierte Spiele mit Anleitungen | Community-Spielideen von Eltern |
| Kuchen-Rezepte + Essensvorschläge | Rezept-Video-Integration |
| Mengenberechnung auf Gästezahl | Supermarkt-Preisvergleich |
| Einkaufsliste mit PDF-Export | Affiliate-Integration zu Shops |
| Einladungs-Template (PDF + WhatsApp) | Visueller Einladungs-Designer |
| Goodie-Bag-Ideen | Personalisierte Etiketten-Generator |
| Permalink zum Teilen | Nutzerkonten mit gespeicherten Partys |

---

## 8. Anforderungen Version 2 (KI-Erweiterung)

| ID | Anforderung | Priorität | Nutzen |
|---|---|---|---|
| KI-01 | **KI-Motto-Generator:** Kind interessiert sich für X + Y → "Dein Motto: Weltraum-Detektive!" mit passenden Spielen, Deko, Kuchen | Muss | Einzigartige Personalisierung |
| KI-02 | **Wetter-Empfehlung:** PLZ + Datum → Wettervorhersage → "Wahrscheinlich Regen, wir empfehlen Indoor-Spiele" mit automatischem Planswitch | Soll | Weniger Last-Minute-Panik |
| KI-03 | **Einladungs-Designer:** Visueller Editor mit Drag-and-Drop: Hintergrund, Schriftart, Sticker, eigenes Foto-Upload → Export als Print + Digital | Muss | Premium-Feature, hohe Zahlungsbereitschaft |
| KI-04 | **Community-Spiele:** Eltern reichen eigene Spiele ein + bewerten bestehende ("Hat bei 8-Jährigen super funktioniert") | Soll | User-Generated Content, SEO, Bindung |
| KI-05 | **Kosten-Kalkulator:** Alle Einkaufslisten-Artikel mit Durchschnittspreisen hinterlegt → "Dein Geburtstag kostet ca. €120" | Muss | Budget-Transparenz |
| KI-06 | **Mehrere Kinder verwalten:** Nutzer-Account mit gespeicherten Partys pro Kind + "Was haben wir letztes Jahr gemacht?" | Soll | Wiederkehrende Nutzung |
| KI-07 | **Schatzsuche-Generator:** Alter + Motto + Spielort (Wohnung/Garten/Park) → komplett ausformulierte Schnitzeljagd mit Rätseln, Hinweisen und Karte | Muss | Killer-Feature, hoher Wow-Faktor |
| KI-08 | **Foto-Einladung:** KI generiert kindgerechte Illustration aus Motto (z.B. "Ein Piratenschiff mit 8 Kindern") | Kann | Differenzierung, Social-Media-virales Asset |

---

## 9. Zwei Alternativkonzepte in ähnlicher Richtung

### 9.1 Alternative A: SchatzApp (Schatzsuche-/Schnitzeljagd-Generator)

**Kernidee:** Statt gesamter Geburtstagsplanung Fokus auf den beliebtesten Programmpunkt: die Schatzsuche. SchatzApp generiert komplette Schnitzeljagden mit Rätseln, Hinweisen, Karte und Versteck-Anleitung, personalisiert nach Alter, Motto und Spielort.

**V1:** 30 vorgefertigte Schnitzeljagden (thematisch), anpassbar nach Spielort (Wohnung 3 Zimmer / Garten / Park / Wald). Rätsel als druckbare Karten. Schatzkarte als PDF.

**V2:** KI generiert individuelle Rätsel aus Kindernamen und Interessen. GPS-basierte Outdoor-Schnitzeljagd. Augmented Reality (Hinweise per Kamera scannen).

**Pricing:** €3,99 pro Schnitzeljagd oder €9,99/Jahr für unbegrenzt.

**Warum verfolgbar:** Schnitzeljagden sind der Nr.1-Suchanfrage-Treiber bei Kindergeburtstagen (Google Trends DACH 2025). Kann als Standalone oder als Premium-Modul innerhalb von Geburtstagspilot funktionieren.

### 9.2 Alternative B: KinderMenü-Rechner (Party-Essens-Planer)

**Kernidee:** Fokus ausschließlich auf die Mengenberechnung und Essensplanung für Kindergeburtstage und andere Kinderfeste. Keine Spiele, keine Einladungen, nur: "Wie viel von was für wie viele Kinder?"

**V1:** Gästezahl + Essenstyp (Pizza, Würstchen, Buffet, Kuchen) + Dauer → exakte Mengen pro Zutat + Einkaufsliste.

**V2:** Allergie-Manager, Rezept-Vorschläge, Supermarkt-Preisvergleich.

**Pricing:** Free mit Werbung. Pro €1,99 einmalig.

**Warum verfolgbar:** Ultra-schnelle Umsetzung (1 Woche), auch außerhalb von Geburtstagen nutzbar (Kita-Feste, Vereinsfeste), aber limitiertes Monetarisierungspotenzial.

---

## 10. Chancen und Risiken

### 10.1 Chancen

| Chance | Begründung |
|---|---|
| Virales Wachstum über Einladungen | Jede versendete Einladung ist Marketing für die App |
| SEO-Dauerbrenner | "Kindergeburtstag Spiele", "Kindergeburtstag planen" = 150.000+ Suchen/Monat DACH (Sistrix 2025) |
| Saisonales Wiederkehren | Jeden Monat haben Kinder Geburtstag. Nachfrage ganzjährig |
| Affiliate-Potenzial | Einkaufsliste → Amazon/Partybedarf-Links = passive Revenue |
| Erweiterbar auf angrenzende Events | Kita-Feste, Einschulung, Halloween-Party, Osterparty |
| Emotional positive Marke | "Danke, das hat mir den Tag gerettet" → hohe Weiterempfehlung |

### 10.2 Risiken

| Risiko | Gegenmaßnahme |
|---|---|
| Geringe Zahlungsbereitschaft bei Eltern für Tools | Einmalkauf statt Abo (€4,99 = Preis einer Packung Luftballons). Wert klar kommunizieren |
| Content-Aufwand (80+ Spiele kuratieren) | Einmalige Investition, danach Asset. Community-Beiträge ab V2 |
| Saisonale Schwankungen (Ferien/Weihnachten = Tief) | SEO-Content für Nebensaison (Indoor-Geburtstage im Winter, Motto "Weihnachtsparty") |
| Pinterest/Blogs als Gewohnheit | Überlegene UX + Workflow (5 Min vs. 3 Stunden) als Differenzierer |
| ChatGPT als Substitut | Strukturierter Output + PDF-Export + kuratierte Qualität > generischer LLM-Output |

---

## 11. Umsetzungsplan Version 1

### 11.1 Technologiestack

- **Frontend:** Next.js 15 (Static Export) oder Astro, Tailwind CSS, TypeScript
- **PDF-Generierung:** pdf-lib + html2canvas (client-seitig)
- **Bild-Export:** dom-to-image (Einladungen als PNG)
- **Hosting:** Cloudflare Pages (kostenlos, CDN, DACH-PoPs)
- **Analytics:** Plausible EU (cookiefrei)
- **Payment (Pro-Tier):** Stripe Checkout (einmalige Zahlung)
- **PWA:** Service Worker für Offline-Fähigkeit

### 11.2 Umsetzungsplan 5 Werktage

| Tag | Fokus | Inhalt |
|---|---|---|
| Tag 1 | Content-Grundlage | Spiele-Datenbank (80 Spiele, JSON-Struktur), Kuchen-Rezepte (14 Mottos), Mengenformeln, Goodie-Bag-Katalog, Einladungs-Templates (Texte) |
| Tag 2 | Wizard + Logik | 6-Schritt-Wizard-UI, Auswahllogik (Alter × Motto × Indoor/Outdoor → Spiele-Matching), Mengenberechnung, Zeitablauf-Generator |
| Tag 3 | Ergebnis-Seite + PDF | Ergebnis-Anzeige (Tabs/Akkordeon), PDF-Export (Ablauf + Spiele + Einkaufsliste), Permalink-Generierung |
| Tag 4 | Einladungen + Einkaufsliste | Einladungs-Templates (14 Mottos, A5-PDF + WhatsApp-PNG), Einkaufsliste mit Checkbox-UI + PDF + WhatsApp-Text-Share |
| Tag 5 | Pro-Tier, QA, Launch | Stripe-Checkout für Pro-Paket, Paywall für Premium-Einladungen/Spiele, Plausible-Integration, Datenschutz/Impressum, manueller Test aller Flows, Deploy |

---

## 12. Marke, Branding und Marketing

### 12.1 Markenname und Bedeutung

**Geburtstagspilot** ist bewusst gewählt: seriös, klar, DACH-tauglich und sofort verständlich. In einem Markt, der von SEO und Google-Suche lebt, ist ein beschreibender Name ein strategischer Vorteil:

- **SEO-Power:** "Kindergeburtstag planen" und "Kinder Party" sind hochvolumige Keywords. Der Markenname enthält die Suchwörter nativ.
- **Sofortverständlich:** Keine Erklärung nötig. Eltern wissen nach dem Namen, was das Tool tut.
- **WhatsApp-teilbar:** "Ich hab den Geburtstag mit dem Geburtstagspilot geplant, mega!", natürliche Weiterempfehlung.

**Alternative Kurzformen:** KiPaPla (für Social Media), PartyPlaner (informell).

### 12.2 Positionierung

| Dimension | Ausprägung |
|---|---|
| **Markenversprechen** | "3 Stunden Spaß. 5 Minuten Planung." |
| **Werte** | Einfach · Fröhlich · Verlässlich · Eltern-freundlich |
| **Tonalität** | Warmherzig, humorvoll, verständnisvoll für Elternstress. Nie herablassend, nie perfektionistisch |
| **Sprachregeln** | Du-Ansprache. Kurze Sätze. Emojis erlaubt (🎂🎈🎁). Keine Erziehungsratschläge. |
| **Was Geburtstagspilot nicht ist** | Kein Erziehungs-Blog. Kein Deko-Shop. Keine "perfekte Instagram-Mama"-Marke. |

**Claim-Vorschläge:**
- **"Geburtstagspilot, 3 Stunden Spaß. 5 Minuten Planung."** (Hauptclaim)
- "Geburtstagspilot. Damit du die Party genießen kannst."
- "Geburtstagspilot. Geburtstag planen ohne Stress."

### 12.3 Visuelle Identität

| Element | Empfehlung | Begründung |
|---|---|---|
| **Primärfarbe** | Fröhliches Konfetti-Lila `#7C3AED` | Festlich, kindgerecht, hebt sich von typischem Rosa/Blau ab |
| **Akzentfarbe** | Sonniges Gelb `#FBBF24` | Freude, Geburtstag, Luftballons |
| **Sekundär** | Mintgrün `#34D399`, Koralle `#F87171` | Party-Palette, farbenfroh ohne kitschig |
| **Hintergrund** | Cremeweiß `#FFFDF7` | Warm, einladend, nicht steril |
| **Typografie** | Rounded Sans-Serif (z.B. *Nunito*, *Quicksand*) | Freundlich, kindgerecht, gut lesbar |
| **Bildwelt** | Illustrationen statt Fotos (Vektor-Stil: Luftballons, Kuchen, Girlanden, spielende Kinder) | Universell, inklusiv, lizenzfrei reproduzierbar |
| **Bewegung** | Konfetti-Animation bei Ergebnis-Generierung, sanftes Bounce auf CTAs | Feier-Stimmung, Dopamin beim Ergebnis |

### 12.4 Marketing-Strategie

#### 12.4.1 SEO-Driven Content (Hauptkanal)

| Keyword-Cluster | Suchvolumen DACH/Monat (est.) | Content-Strategie |
|---|---|---|
| "Kindergeburtstag Spiele [Alter]" | 80.000+ | Landingpages pro Alter (3–12) mit 10 Spielen + CTA zum Wizard |
| "Kindergeburtstag Motto Ideen" | 25.000+ | Motto-Galerie-Seite mit Vorschau + Wizard-Einstieg |
| "Kindergeburtstag planen Checkliste" | 15.000+ | Free Checkliste als PDF-Download → E-Mail-Capture → Upsell |
| "Schnitzeljagd Kindergeburtstag" | 30.000+ | Ausführlicher Guide + CTA auf V2-Feature |
| "Kindergeburtstag Essen Mengen" | 8.000+ | Mengenrechner als eingebettetes Tool → Einstieg in Wizard |
| "Einladung Kindergeburtstag Vorlage" | 20.000+ | Einladungs-Galerie mit Vorschau → Free Download 1, mehr im Pro |

Geschätztes organisches Traffic-Potenzial nach 6 Monaten: **30.000–80.000 Besuche/Monat** (Sistrix Sichtbarkeitsschätzung bei 20+ Landingpages mit Long-Tail-Keywords, basierend auf Vergleichsportalen im Eltern-Segment 2025).

#### 12.4.2 Virales Wachstum über Einladungen

Jede generierte Einladung enthält (im Free-Tier) dezent: "Erstellt mit Geburtstagspilot.de 🎈". Bei WhatsApp-Weiterleitung sehen 8–15 Eltern den Markennamen pro Einladung. Bei 1.000 generierten Einladungen/Monat → 8.000–15.000 Brand-Impressions kostenlos.

#### 12.4.3 Social Media (Instagram + Pinterest)

- **Instagram:** "Motto des Monats" Reels (30 Sek: "So planst du eine Piratenparty in 5 Minuten"). Eltern-UGC: "Zeig uns deine Party!" mit Hashtag #Geburtstagspilot
- **Pinterest:** Pins für jedes Motto (Einladungs-Vorschau, Spielideen-Infografik, Kuchen-Bild). Pinterest ist die Nr.1-Plattform für Kindergeburtstags-Inspiration → natürlicher Fit.

#### 12.4.4 Partnerschaften (ab Monat 3)

- **Eltern-Blogs/Influencer:** Kostenloser Pro-Zugang gegen Review/Erwähnung
- **Partybedarf-Shops:** Affiliate-Partnerschaft (Einkaufsliste → Shop-Links)
- **Kita-/Hort-Verteiler:** "Kostenloser Planer für alle Eltern" als Aushang/Flyer in Kitas

#### 12.4.5 Kennzahlen und Ziele (6-Monats-Plan)

| KPI | Monat 1 | Monat 3 | Monat 6 |
|---|---|---|---|
| Generierte Pläne/Monat | 200 | 2.000 | 8.000 |
| Unique Visitors/Monat | 1.000 | 10.000 | 40.000 |
| Pro-Tier-Käufe/Monat | 10 | 150 | 600 |
| MRR (einmalig → annualisiert) | €50 | €750 | €3.000 |
| SEO-Rankings Top-10 | 3 Keywords | 15 Keywords | 40 Keywords |

---

## Quellenverzeichnis

| Quelle | Inhalt |
|---|---|
| Forsa Familienstudie 2025 | Stressfaktoren bei Familienfeiern, forsa.de |
| Destatis Mikrozensus 2025 | Erwerbstätigkeit beider Elternteile, destatis.de |
| Destatis Bevölkerungsstatistik 2025 | Altersstruktur Kinder 3–12 in DE, destatis.de |
| Statistik Austria. Bevölkerung 2025 | Kinder 3–12 in AT, statistik.at |
| BFS Schweiz. Bevölkerung 2025 | Kinder 3–12 in CH, bfs.admin.ch |
| Statista Consumer Insights. Kindergeburtstage DE 2025 | Durchschnittliche Ausgaben pro Feier, statista.com |
| Bitkom Familien-Digital-Index 2025 | Smartphone-Nutzung von Eltern, bitkom.org |
| Sistrix. Keyword-Analyse Eltern-Segment 2025 | Suchvolumen "Kindergeburtstag" Cluster, sistrix.de |
| Google Trends DACH 2025 | Saisonale Suchtrends "Kindergeburtstag", trends.google.de |
| Spielen-und-Feiern.de Branchenreport 2025 | Feierquoten und Partybedarf-Markt |

---

*Dokument erstellt: 6. Mai 2026 | Version 1.0 | Autor: Daniel Moretz | Status: Zur Freigabe eingereicht*
*Alle Marktdaten basieren auf zum Erstellungszeitpunkt öffentlich verfügbaren Quellen.*
