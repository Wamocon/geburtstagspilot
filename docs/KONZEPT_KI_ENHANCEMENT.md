# Konzept: KI-Enhancement - Geburtstagspilot

Version: 1.0 | Stand: Mai 2026 | Status: Planungsphase
Perspektive: Software-Architekt + Product Owner

---

## 1. Vision und Anforderungsanalyse

### 1.1 Ausgangslage - Was fehlt heute?

Die aktuelle App generiert Partypplane nach einem starren Template-System:
- Spiele kommen aus einer Datenbank mit Filter (Alter, Ort, Thema)
- Rezepte sind 1:1 an ein Motto gebunden
- Einladungstext ist ein unverandertes Template
- Mengenberechnung ist eine lineare Formel
- Der Plan kennt das Kind nicht - es ist nur ein Alter und eine Gasteranzahl

**Zitat eines typischen Nutzers:** *"Der Plan ist gut, aber Mia liebt halt Pferde UND Basteln, und der Piraten-Plan hat nichts davon. Wie passe ich das an?"*

### 1.2 Was KI leisten kann und was nicht

**KI kann:**
- Naturlichsprachliche Eingaben in strukturierte Daten umwandeln
- Kreative und personalisierte Inhalte generieren
- Kontextuelles Wissen uber Kinderpartys einbringen
- Kompromissvorschlage bei Konflikten finden (z.B. Allergie + Lieblingsrezept)
- Unsicherheiten des Nutzers durch Dialog klaren
- Skalierbar personalisierte Texte schreiben

**KI kann nicht (zuverlaessig):**
- Echtzeitdaten liefern (Preise, lokale Anbieter)
- Garantiert korrekte Mengenangaben ohne Validierung
- Medizinische Allergie-Entscheidungen treffen
- Ersatz fur strukturierte Daten sein (Datenbank bleibt Backbone)

### 1.3 Anforderungsanalyse: Use Cases aus Nutzerperspektive

Aus einer hypothetischen Befragung von Eltern ergeben sich folgende Top-Schmerzen:

| Rang | Schmerzpunkt | KI-Losung |
|---|---|---|
| 1 | "Mein Kind hat spezifische Interessen, der Plan passt nicht" | Kinderprofil + KI-Personalisierung |
| 2 | "Ich weiss nicht wo ich anfangen soll" | Naturlichsprachlicher Wizard / KI-Chat |
| 3 | "Die Spiele klingen alle gleich" | KI generiert einzigartige Spiel-Varianten |
| 4 | "Die Einladung klingt generisch" | KI schreibt personalisierte Einladungstexte |
| 5 | "Was ist wenn es regnet?" | KI-Alternativplan / kontextueller Chat |
| 6 | "Wie viel muss ich wirklich kaufen?" | KI-gestutzte Budgetoptimierung |
| 7 | "Ich brauche Ideen fur Themen" | KI-Themen-Vorschlage basierend auf Interessen |
| 8 | "Kann mir jemand beim Planen helfen?" | KI-Chat-Assistent |

---

## 2. KI-Feature-Katalog

### Feature 1: Naturlichsprachliche Eingabe (Conversational Wizard)

**Problem:** Der 7-Schritt-Wizard ist gut, aber es fehlt die Moglichkeit fur Eltern die alles auf einmal sagen wollen.

**Losung:** Ein optionaler "Schnell-Modus" oben im Wizard:

```
"Beschreibe die Party in einem Satz, wir erledigen den Rest."

Eingabe: "Ich plane eine Party fur Lena, sie wird 7, liebt Pferde und Einhorner, 
         wir haben 12 Gaste, Outdoor, ca. 150 EUR"

KI extrahiert:
  - Alter: 7
  - Interessen: Pferde, Einhorner
  - Gasteranzahl: 12
  - Ort: Outdoor
  - Budget: 150 EUR
  - Thema: Einhorn (automatisch gewahlt, aber korrigierbar)
```

**Technisch:**
- `POST /api/ai/parse-wizard-input` - GPT-4o mit strukturiertem JSON-Output
- Validierung des extrahierten Outputs gegen bekannte Wizard-Felder
- Nutzer sieht das vorausgefullte Wizard mit Moglichkeit zur Korrektur
- Kein Blind-Vertrauen in KI-Output - immer menschliche Bestatigung

---

### Feature 2: Kinder-Interessen-Profiler (Deep Personalization)

**Problem:** Das Kind ist aktuell nur Alter + Anzahl. Es hat Personlichkeit, Lieblingsserien, Hobbys.

**Losung:** Ein Freitextfeld im Wizard (Pro-Feature) + KI-Analyse:

**Wizard Step 1 (Pro):**
```
"Was liebt [Kindname] besonders? (optional, aber macht den Plan viel besser)"

Placeholder: z.B. "Mag Dinosaurier, liebt Basteln, hat Angst vor lauten Gerauschen, 
              beste Freundin heisst Sophie, Lieblingsfilm: Das Dschungelbuch"
```

**Was KI damit macht:**
- Erstellt ein internes Kindprofil-Objekt
- Beeinflusst Spiel-Ranking: "Ruhige Bastelspiele" hoher gewichten bei "hat Angst vor lauten Gerauschen"
- Personalisiert Zeitplan-Beschreibungen: "Basteln und entdecken mit Dinos" statt "Spiel 2"
- Generiert personalisierte Einladung: "Komm und feier mit dem großen Dinosaurier-Forscher Luca!"
- Schlagt alternative Themen vor: "Basierend auf Lenas Interessen passen auch: Dschungel-Safari, Naturentdecker"

---

### Feature 3: KI-Spiel-Varianten-Generator

**Problem:** Die Spieldatenbank hat 80+ Spiele - aber nach 3 Jahren Kindergeburtstagen kennen Eltern sie alle.

**Losung:** KI generiert Variationen der Standard-Spiele und neue themenspezifische Ideen:

**Trigger:** Button "Neues Spiel generieren" in GamesTab (Pro)

**Eingabe an KI:**
```json
{
  "theme": "Dinosaurier",
  "age": 6,
  "location": "outdoor",
  "guests": 10,
  "child_interests": ["Basteln", "Fossilien"],
  "existing_games": ["Reise nach Jerusalem", "Sackhupfen"],
  "exclude_materials": ["Schere"],
  "language": "de"
}
```

**KI-Output:**
```json
{
  "name_de": "Fossilien-Ausgraber",
  "name_en": "Fossil Excavation",
  "description_de": "Kleine Paleonteologen graben versteckte Dinosaurier-Fossilien (Gipsabdruecke oder Plastikdinos) im Sandkasten aus...",
  "instructions_de": ["1. Verstecke 10 Dino-Figuren im Sand...", "..."],
  "materials_de": ["Sandkasten oder grosse Kiste mit Sand", "10 Plastik-Dinosaurier", "Pinsel"],
  "duration_minutes": 20,
  "activity_level": "calm"
}
```

**Validierung:** KI-generierte Spiele werden vor Anzeige auf Mindestqualitat gepruft (Completeness-Check), nie blind angezeigt.

---

### Feature 4: KI-Rezept-Generator

**Problem:** Es gibt 1 Rezept pro Thema. Bei Allergien (glutenfrei + laktosefrei + vegan gleichzeitig) sind die Optionen erschopft.

**Losung:** KI generiert themen-passende Rezepte mit Allergie-Berucksichtigung:

**Trigger:** "Alternatives Rezept generieren" Button in FoodTab (Pro)

**Eingabe:**
```json
{
  "theme": "Dschungel-Safari",
  "allergens": {
    "glutenFree": true,
    "vegan": true
  },
  "skill_level": "beginner",
  "servings": 12,
  "available_time_minutes": 60,
  "language": "de"
}
```

**KI-Output:** Vollstandiges Rezept mit Zutaten (mit Mengen fur N Portionen), Schritt-fur-Schritt-Anleitung, Dekortipps passend zum Thema, Allergen-Markierungen.

**Sicherheit:** KI-Rezepte werden mit einem "KI-generiert - bitte prufen" Badge markiert. Kein Ersatz fur medizinische Allergie-Beratung.

---

### Feature 5: KI-Einladungstext-Generator

**Problem:** Die Einladungsvorlagen sind generisch und klingen immer gleich.

**Losung:** KI schreibt personalisierte Einladungstexte:

**Freitext-Eingabe im InvitationTab (Pro):**
```
"Stil: lustig, verspielt
 Besonderes: Lena liebt Dinos, ihre beste Freundin Sophie kommt auch
 Motto: Dino-Party
 Alter wird 7"
```

**KI generiert:**
```
Hey du wildes Dino-Kind!

Lena wird 7 - und das MUSS gefeiert werden!
Komm in die Urzeit-Hohle und feier mit uns:

Wann: Samstag, 14. Juni, 14:00-17:00 Uhr
Wo: Im grossen Garten der Dinos (Musterstrasse 1, 12345 Musterstadt)

Es wird gegraben, gebruellt und gefeiert!
(PS: Sophie freut sich schon auf dich!)

Bitte melde dich bis 7. Juni bei Lenas Mama an.
```

**Varianten:** KI kann 3 Varianten auf einmal generieren (lustig / klassisch / kreativ) zur Auswahl.

---

### Feature 6: KI-Chat-Assistent ("Party-Coach")

**Problem:** Eltern haben viele ad-hoc Fragen die der statische Plan nicht beantworten kann.

**Losung:** Ein Chatfenster in der Ergebnis-Seite, das den aktuellen Plan kennt:

**Kontextuelle Fragen die der Assistent beantwortet:**
- "Was mache ich wenn es regnet?" -> Generiert Indoor-Alternativplan
- "Spiel 2 klingt zu chaotisch fur schuchterne Kinder" -> Schlagt ruhigere Alternativen vor
- "Wie bereite ich den Kuchen einen Tag vorher vor?" -> Anleitungstipps
- "Ich habe nur 80 EUR Wirklichkeit statt 150" -> Budgetoptimierungsvorschlage
- "Was mache ich wenn ein Kind Heulkrampfe bekommt?" -> Krisenmanagement-Tipps
- "Kannst du eine Schatzsuche fur 6-Jahrige erklaren?" -> Detaillierte Spielanleitungen
- "Mein Garten ist nur 30qm" -> Raum-angepasste Spielvorschlage

**Technisch:**
- System-Prompt enthalt den vollstandigen aktuellen Plan als JSON-Kontext
- Antworten auf Deutsch oder Englisch je nach App-Spracheinstellung
- Streaming-Antworten (kein Warten auf komplette Antwort)
- Konversationsverlauf innerhalb der Session (max 10 Nachrichten fur Kosten-Kontrolle)
- Pro-only (Token-Kosten sind real)

---

### Feature 7: KI-Zeitplan-Optimierer

**Problem:** Der aktuelle Zeitplan ist ein linearer Template. Er berucksichtigt nicht:
- Energie-Kurve der Kinder (wild am Anfang, mude nach dem Essen)
- Optimale Spiel-Reihenfolge (aktiv -> ruhig -> aktiv)
- Alter-spezifische Aufmerksamkeitsspannen
- Essen- und Pausen-Rhythmus

**Losung:** KI-Analyse und -Optimierung des Zeitplans:

**Trigger:** "Zeitplan optimieren" Button im ScheduleTab (Pro)

**KI analysiert:**
- Energie-Level der aktuellen Spiel-Reihenfolge
- Ob Essen zwischen zwei sehr aktiven Spielen liegt (schlecht: Erbrechen-Risiko)
- Ob die Gesamtdauer fur das Alter angemessen ist
- Ob Pufferzeiten vorhanden sind

**KI gibt zurück:**
- Optimierten Zeitplan mit Begrundungen
- Warnungen: "Nach 'Laufendes Fangspiel' sollte eine 15-min-Pause vor dem Essen sein"
- Vorschlag: Reihenfolge andern, Puffer einfugen

---

### Feature 8: Themen-Vorschlags-KI

**Problem:** Eltern wissen oft nicht welches Thema zu ihrem Kind passt. Die Liste hat 14 Themen - welches ist das richtige?

**Losung:** KI schlagt Themen basierend auf Kindinteressen vor, noch vor Wizard Step 4:

**Nach Wizard Step 1 (Name + Interessen eingegeben):**
```
KI analysiert Interessen: "Pferde, Zeichnen, Einhorn-Buch"

Themen-Vorschlage:
  1. Einhorn (95% Match) - "Mias Lieblingsmotiv direkt als Partykonzept"
  2. Pferde & Pony (88% Match) - "Echte Pferde als Thema fur den Outdoor-Bereich"
  3. Kunst-Atelier (75% Match) - "Ideal fur kreative Kinder die gerne zeichnen"
  4. Prinzessin (60% Match) - "Passt zum Einhorn-Hintergrund, klassische Variante"
```

**Alternativ:** Freitext-Suche: "Gibt es ein Thema fur ein Kind das Weltraum und Roboter liebt?"
-> KI zeigt "Weltraum-Mission" an und generiert hybride Ideen ("Roboter-Labor im Weltraum")

---

### Feature 9: KI-Budgetoptimierer

**Problem:** Bei einem Budget von 80 EUR und 12 Gasten ist nicht klar wie man optimal verteilt.

**Losung:** KI schlagt Budgetverteilung vor und zeigt Trade-offs:

**Eingabe:** Budget 80 EUR, 12 Gaste, Dino-Theme

**KI-Ausgabe:**
```
Budget-Optimierung fur 80 EUR bei 12 Kindern:

Empfehlung:
  Kuchen (selber backen): 15 EUR (Zutaten)
  Essen/Snacks:           20 EUR (Wurst, Gemuese, Brezeln)
  Getranke:               8 EUR
  Spielmaterial:          12 EUR (Dino-Grabungs-Set)
  Mitgebsel:              18 EUR (1,50 EUR/Kind fur Dino-Figur + Sticker)
  Deko:                   7 EUR (Luftballons, Tischdecke)
  Gesamt:                 80 EUR

Alternative: Kuchen kaufen statt backen (+20 EUR, aber spart 3 Stunden Zeit)

Einsparmoglichkeiten:
  - Mitgebsel: Bastel-Mitgebsel im Spiel erstellen (Gipsabdruck), spart 10 EUR
  - Deko: Girlanden selbst basteln, spart 3 EUR
```

---

### Feature 10: Post-Party-Modul

**Problem:** Nach der Party gibt es keine Folge-Funktionalitat. Aber Eltern haben Feedback: was hat funktioniert, was nicht?

**Losung:** Optional nach dem Party-Datum: KI-gestutzte Retrospektive

**Nutzer beantwortet 3 Fragen:**
- "Was hat super funktioniert?"
- "Was hat nicht funktioniert?"
- "Notizen fur nachstes Jahr?"

**KI verarbeitet das zu:**
- Kindprofil-Update (Interessen bestatigt/widerlegt)
- Notizen im gespeicherten Plan
- Vorschlage fur nachste Party basierend auf Feedback
- (Aggregiert anonym: welche Spiele werden positiv bewertet?)

---

## 3. Technische Architektur

### 3.1 Gesamtubersicht

```
                        ┌────────────────────────────┐
                        │      Next.js App Router     │
                        │                             │
     User Browser ─────>│  Client Components          │
                        │  (Streaming UI, Chat)       │
                        │         │                   │
                        │  Server Components          │
                        │  (Plan Generation)          │
                        └────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
          ┌─────────▼──────────┐    ┌──────────▼──────────┐
          │  AI API Routes     │    │  Supabase            │
          │  /api/ai/*         │    │  (PostgreSQL + Auth) │
          │                    │    │                      │
          │  - parse-wizard    │    │  - child_profiles    │
          │  - personalize     │    │  - ai_conversations  │
          │  - generate-game   │    │  - ai_usage_log      │
          │  - generate-recipe │    │  - saved_plans       │
          │  - chat            │    │                      │
          └────────────────────┘    └──────────────────────┘
                    │
          ┌─────────▼──────────┐
          │  LLM Provider      │
          │  OpenAI GPT-4o     │
          │  (Anthropic Backup)│
          └────────────────────┘
```

### 3.2 Provider-Strategie

**Primarer Provider: OpenAI GPT-4o**
- Beste Deutsch-Qualitat
- Structured Outputs (JSON-Modus) fur zuverlaessige Datenextraktion
- Function Calling fur Tool-gestutzte Antworten
- Streaming fur Chat-Antworten

**Backup-Provider: Anthropic Claude 3.5 Haiku**
- Schneller und gunstiger fur einfache Aufgaben
- Guter Fallback bei OpenAI-Ausfallen

**Provider-Abstraktion (Pflicht):**
```typescript
// src/lib/ai/provider.ts
// Neutral - kein "use client"/"use server"

export interface AIProvider {
  complete(prompt: AIPrompt): Promise<string>;
  stream(prompt: AIPrompt): ReadableStream<string>;
  structuredOutput<T>(prompt: AIPrompt, schema: ZodSchema<T>): Promise<T>;
}

// Konkrete Implementierungen:
// src/lib/ai/openai.ts
// src/lib/ai/anthropic.ts
```

**Warum Abstraktion:** Provider konnen jederzeit wechseln ohne App-Code zu andern.

### 3.3 Kostenmodell und Token-Budget

| Feature | Avg. Input Tokens | Avg. Output Tokens | Cost/Call (GPT-4o) | Tier |
|---|---|---|---|---|
| Wizard-Parse (Natural Language) | 200 | 100 | ~$0.003 | Pro |
| Personalisierungs-Analyse | 800 | 300 | ~$0.011 | Pro |
| Spiel generieren | 600 | 400 | ~$0.010 | Pro |
| Rezept generieren | 500 | 600 | ~$0.011 | Pro |
| Einladungstext (3 Varianten) | 400 | 600 | ~$0.010 | Pro |
| Chat-Antwort (mit Plan-Kontext) | 2000 | 500 | ~$0.025 | Pro |
| Budget-Optimierung | 400 | 500 | ~$0.009 | Pro |
| Zeitplan-Optimierung | 1500 | 600 | ~$0.021 | Pro |

**Monatliches Token-Budget pro Pro-Nutzer:**
- Max 500.000 Input-Tokens/Monat (~$1.25)
- Max 200.000 Output-Tokens/Monat (~$2.00)
- Gesamt-Cap: ~$3.25/Monat pro Nutzer (bei Pro-Preis 4,99 EUR = angemessen)

**Rate-Limiting-Strategie:**
```typescript
// src/lib/ai/rate-limiter.ts
export const AI_RATE_LIMITS = {
  chat_messages_per_hour: 20,
  generations_per_day: 30,
  total_tokens_per_month: 500_000,
} as const;
```

### 3.4 Sicherheits-Architektur

**Regel: KI-API-Keys niemals im Client-Code**

```
Client Browser
     │
     ├── NEIN: fetch('https://api.openai.com') mit API-Key -> VERBOTEN
     │
     └── JA: fetch('/api/ai/chat') -> Next.js Server Route -> OpenAI API
```

**Weitere Sicherheitsmassnahmen:**
- Prompt Injection Prevention: Nutzereingaben werden durch ein Sanitization-Layer gefuhrt
- Content Filtering: KI-Output wird auf kindgerechte Inhalte gepruft
- Rate Limiting: Per-User, Per-IP als Doppelschutz
- Input-Validierung: Zod-Schemas fur alle API-Eingaben
- Ausgabe-Validierung: KI-JSON-Output wird gegen erwartetes Schema validiert

**Prompt Injection Beispiel:**
```typescript
// SCHLECHT - direkte Nutzereingabe in System-Prompt
const prompt = `Party planen fuer: ${userInput}`

// GUT - Input wird strukturiert und begrenzt
const sanitized = sanitizeUserInput(userInput, { maxLength: 500, stripHtml: true });
const prompt = buildPartyPlanPrompt({ childInterests: sanitized });
```

### 3.5 Caching-Strategie

Nicht jede KI-Anfrage muss live generiert werden:

```
Caching-Layer:
  L1: Memory Cache (Next.js Request-Level)
      - Themen-Matching-Ergebnisse (gleiche Interessen -> gleicher Score)
  
  L2: Supabase Cache-Tabelle
      - Haufige Spiel-Generierungen (Dino + Outdoor + Alter 6 -> Cache 7 Tage)
      - Budget-Vorschlage fur Standardkombinationen
  
  Nicht gecacht:
      - Chat-Antworten (kontextabhangig)
      - Einladungstexte (personalisiert)
      - Kindprofil-Analysen (individuell)
```

### 3.6 Streaming-Implementierung

Fur Chat und Textgenerierung werden Server-Sent Events (SSE) verwendet:

```typescript
// src/app/api/ai/chat/route.ts
import { OpenAI } from 'openai';

export async function POST(request: Request) {
  // Auth-Check + Rate-Limit-Check
  const user = await getAuthenticatedUser(request);
  if (!user || user.tier !== 'pro') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { message, planContext } = await validateBody(request);

  const stream = new ReadableStream({
    async start(controller) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: buildChatMessages(planContext, message),
        stream: true,
      });

      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
      }
      controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
  });
}
```

---

## 4. Datenbankschema-Erweiterungen

### 4.1 Neue Tabellen fur KI-Features

```sql
-- Konversationsverlauf fur KI-Chat
CREATE TABLE public.ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.saved_plans(id) ON DELETE SET NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KI-Nutzungs-Log fur Rate-Limiting und Abrechnung
CREATE TABLE public.ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  input_tokens INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KI-generierte Inhalte-Cache
CREATE TABLE public.ai_content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Kindprofile (fur Personalisierung)
CREATE TABLE public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  interests TEXT[],
  allergies JSONB,
  favorite_theme_slug TEXT REFERENCES public.themes(slug),
  ai_analysis JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Post-Party-Feedback
CREATE TABLE public.party_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.saved_plans(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  what_worked TEXT,
  what_failed TEXT,
  notes_for_next_year TEXT,
  ai_insights JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 4.2 Erweiterungen der WizardData-Typen

```typescript
// Erweiterung in src/types/index.ts

export interface ChildInterests {
  freeText: string;           // "Liebt Pferde, basteln, die Farbe blau"
  parsedKeywords: string[];   // ["Pferde", "Basteln", "Blau"] - KI-extrahiert
  temperament?: 'calm' | 'active' | 'mixed';
  shyness?: 'shy' | 'social' | 'mixed';
}

export interface WizardData {
  // Bestehende Felder...
  age: number;
  guestCount: number;
  location: LocationType;
  themeSlug: string;
  duration: number;
  budget: string;
  birthdayChildName: string;
  allergens: AllergenPreferences;
  guestNames: string[];

  // NEUE KI-Felder (optional, Pro-only)
  childInterests?: ChildInterests;
  childProfileId?: string;    // Referenz auf child_profiles-Tabelle
  aiPersonalizationEnabled?: boolean;
  partyDate?: string;         // ISO-Datum fur Aufgaben-Manager
}

export interface AIGeneratedContent {
  type: 'game' | 'recipe' | 'invitation' | 'schedule_optimization' | 'theme_suggestion';
  content: unknown;
  generatedAt: string;
  model: string;
  isVerified: boolean;        // true wenn manuell gepruft
}
```

---

## 5. Komponenten-Architektur (neue + geanderte Dateien)

### 5.1 Neue Komponenten

```
src/components/
  ai/
    AiChatPanel.tsx           - Chat-Seitenleiste in ResultView
    AiChatMessage.tsx         - Einzelne Chat-Nachricht (Streaming)
    AiGenerateButton.tsx      - Wiederverwendbarer "KI generieren" Button
    AiLoadingIndicator.tsx    - Animierter Lade-Indikator wahrend KI denkt
    AiContentBadge.tsx        - "KI-generiert" Badge auf Inhalten
    PersonalizationInput.tsx  - Freitextfeld im Wizard fur Kindinteressen
    ThemeRecommendations.tsx  - KI-Themen-Vorschlage nach Interesseneingabe
  child-profile/
    ChildProfileForm.tsx
    ChildProfileCard.tsx
    ChildSelector.tsx
  budget/
    BudgetOptimizer.tsx       - KI-Budgetoptimierung Anzeige
```

### 5.2 Geanderte Komponenten

```
src/components/wizard/PartyWizard.tsx
  - Step 1: PersonalizationInput hinzufugen (Pro, optional)
  - Schnell-Modus Toggle (NLU-Eingabe)
  - ChildSelector integrieren

src/components/result/ResultView.tsx
  - AiChatPanel als ausklappbares Seitenpanel (Pro)
  - KI-Buttons in einzelnen Tabs
  - "KI-generiert" Badge System

src/components/result/tabs/GamesTab.tsx
  - "KI-Spiel generieren" Button (Pro)
  - KI-generierte Spiele mit AiContentBadge

src/components/result/tabs/FoodTab.tsx
  - "KI-Alternatives Rezept" Button (Pro)
  - Allergie-Konfliktwarnungen

src/components/result/tabs/InvitationTab.tsx
  - "KI-Einladung schreiben" Bereich (Pro)
  - 3 Varianten anzeigen, eine auswahlen

src/components/result/tabs/ScheduleTab.tsx
  - "Zeitplan optimieren" Button (Pro)
  - KI-Optimierungshinweise anzeigen
```

### 5.3 Neue API-Routen

```
src/app/api/ai/
  parse-wizard/route.ts       - NLU-Wizard-Parsing
  personalize/route.ts        - Personalisierungsanalyse
  generate-game/route.ts      - Spiel generieren
  generate-recipe/route.ts    - Rezept generieren
  generate-invitation/route.ts - Einladungstext generieren
  optimize-schedule/route.ts  - Zeitplan optimieren
  chat/route.ts               - Chat-Endpunkt (SSE-Streaming)
  suggest-themes/route.ts     - Themen-Vorschlage
  optimize-budget/route.ts    - Budgetoptimierung
```

---

## 6. Implementierungsplan (Phasen)

### Phase 1: KI-Foundation (3-4 Tage)

**Ziel:** Sicheres, kosteneffizientes KI-Fundament aufbauen.

**Tasks:**
1. `npm install openai zod` - Dependencies
2. `src/lib/ai/provider.ts` - Provider-Abstraktion
3. `src/lib/ai/openai.ts` - OpenAI-Implementierung
4. `src/lib/ai/rate-limiter.ts` - Rate-Limiting-Logik
5. `src/lib/ai/prompts.ts` - Alle System-Prompts zentralisiert
6. `src/lib/ai/sanitizer.ts` - Input-Sanitization gegen Prompt-Injection
7. Datenbankmigrationen: `ai_usage_log`, `ai_content_cache`, `child_profiles`, `party_feedback`
8. Umgebungsvariablen: `OPENAI_API_KEY`, `AI_RATE_LIMIT_ENABLED=true`
9. `src/components/ai/AiLoadingIndicator.tsx`
10. `src/components/ai/AiContentBadge.tsx`

**Abnahmekriterium:** Ein Test-API-Call an `/api/ai/generate-game` liefert valides JSON zuruck, Auth wird gepruft, Rate-Limit wird protokolliert.

---

### Phase 2: Kinder-Personalisierung und Themen-Vorschlage (2-3 Tage)

**Ziel:** Wizard wird intelligent - kennt das Kind.

**Tasks:**
1. `PersonalizationInput.tsx` - Freitextfeld in Wizard Step 1
2. `WizardData`-Typ um `childInterests` erweitern
3. `ThemeRecommendations.tsx` - erscheint nach Interesseneingabe
4. `/api/ai/suggest-themes` Route
5. `/api/ai/personalize` Route (analysiert Interessen)
6. `ChildProfileForm.tsx` und `ChildSelector.tsx`
7. Pro-Gate: Personalisierungs-Features hinter `useFeatureGate('ai_personalization')`

**Abnahmekriterium:** Eingabe "Liebt Dinosaurier und Basteln" fuhrt zu Theme-Vorschlag "Dino" (Top 1) und alternativem Custom-Thema.

---

### Phase 3: KI-Spielgenerierung und Rezeptgenerator (2-3 Tage)

**Ziel:** Inhalt ist nicht mehr limitiert auf die Datenbank.

**Tasks:**
1. `/api/ai/generate-game` Route
2. `AiGenerateButton.tsx` wiederverwendbarer Button
3. Integration in `GamesTab.tsx`
4. `/api/ai/generate-recipe` Route
5. Integration in `FoodTab.tsx` (Allergie-Kontext mitgeben)
6. Output-Validierung mit Zod-Schemas
7. Cache-Logik fur haufige Kombinationen

**Abnahmekriterium:** "Dino + Outdoor + 6 Jahre + glutenfrei" liefert ein neues, valides Spiel und ein glutenfreies Dino-Rezept mit vollstandigen Zutaten.

---

### Phase 4: KI-Einladungstext-Generator (1-2 Tage)

**Ziel:** Einladungen werden persoenlich.

**Tasks:**
1. `/api/ai/generate-invitation` Route (3 Varianten)
2. UI-Erweiterung in `InvitationTab.tsx`
3. Varianten-Auswahl-Interface
4. Stil-Auswahl (lustig / klassisch / kreativ)

**Abnahmekriterium:** Drei unterschiedliche Einladungstexte werden generiert, davon mindestens einer mit dem Kindnamen personalisiert.

---

### Phase 5: KI-Chat-Assistent (3-4 Tage)

**Ziel:** Eltern haben immer einen Experten an ihrer Seite.

**Tasks:**
1. `/api/ai/chat` Route mit SSE-Streaming
2. `AiChatPanel.tsx` - ausklappbares Chat-Panel
3. `AiChatMessage.tsx` - mit Streaming-Rendering
4. Session-Konversationsverlauf im React-State
5. System-Prompt mit vollstandigem Plan-Kontext
6. Token-Budget-Anzeige (optional: wie viele Anfragen noch)
7. Integration in `ResultView.tsx` als floating button

**Abnahmekriterium:** Chat-Antwort erscheint streaming (wortweise), kennt den aktuellen Plan, antwortet auf Deutsch wenn App auf Deutsch eingestellt.

---

### Phase 6: Zeitplan-Optimierung und Budgetoptimierung (2-3 Tage)

**Ziel:** Intelligente Planoptimierung uber KI.

**Tasks:**
1. `/api/ai/optimize-schedule` Route
2. `/api/ai/optimize-budget` Route
3. UI in `ScheduleTab.tsx` und Result-Aktionsbereich
4. Optimierungshinweise visuell hervorheben
5. `BudgetOptimizer.tsx`

---

### Phase 7: Post-Party-Modul und Kindprofil-Lernen (2 Tage)

**Ziel:** App wird uber Jahre intelligenter fur jede Familie.

**Tasks:**
1. `/api/ai/post-party-analysis` Route
2. Post-Party-UI (erscheint nach gespeichertem `partyDate`)
3. Kindprofil-Update basierend auf Feedback
4. `party_feedback` Tabelle und Migration

---

## 7. Strukturanderungen aus Softwarearchitekten-Perspektive

### 7.1 Current State (Ist)

```
Frontend-only Logik
  WizardData -> sessionStorage -> Datenbank-Abfragen -> statische Berechnung -> UI

Probleme:
  - Keine Intelligenz: gleiche Inputs -> immer gleicher Output
  - Kein Kontext: App kennt Kind nicht
  - Statische Templates: 14 Themes x 1 Rezept = 14 Rezepte total
  - Keine Lernfahigkeit
```

### 7.2 Target State (Soll)

```
Hybrid Intelligence Architecture
  
  ┌─────────────────────────────────────────────────────────────┐
  │  Data Layer (Supabase)                                       │
  │  Backbone: Themes, Games, Recipes, FoodItems (statisch)      │
  │  + Child Profiles, AI Conversations, AI Usage Log (dynamisch)│
  └─────────────────────────────────────────────────────────────┘
           │                              │
  ┌────────▼──────────┐         ┌────────▼──────────────────┐
  │  Static Engine    │         │  AI Enhancement Layer      │
  │  (bestehend)      │         │  (neu, additiv)            │
  │                   │         │                            │
  │  - Template-      │         │  - Personalisierung        │
  │    Spiele         │         │  - Generierung             │
  │  - Mengen-        │         │  - Optimierung             │
  │    rechnung       │         │  - Chat-Assistent          │
  │  - Schedule-      │         │  - NLU-Parsing             │
  │    Generierung    │         │                            │
  └───────────────────┘         └────────────────────────────┘
           │                              │
           └──────────────┬───────────────┘
                          │
  ┌───────────────────────▼──────────────────────────────────────┐
  │  Result Layer (React UI)                                      │
  │  - Statische Template-Inhalte (immer verfugbar)               │
  │  - KI-Enhanced Inhalte (Pro-Feature, additiv, nicht ersetzend)│
  │  - Klare visuelle Trennung: KI-Badge auf KI-generierten Items │
  └──────────────────────────────────────────────────────────────┘
```

**Schlussel-Designentscheidung:** KI **erganzt** den statischen Engine, ersetzt ihn **nicht**.
- Free-Nutzer sehen immer noch vollstandige, gute Plane (statisch)
- Pro-Nutzer sehen denselben Plan + KI-Verbesserungen
- App funktioniert auch bei KI-API-Ausfall (Fallback auf statisch)

### 7.3 Neue Verzeichnisstruktur

```
src/
  lib/
    ai/                        NEU - KI-Logik (server-only, kein "use client")
      provider.ts              - Provider-Abstraktion
      openai.ts                - OpenAI-Implementierung
      anthropic.ts             - Anthropic-Fallback (optional)
      rate-limiter.ts          - Rate-Limiting
      sanitizer.ts             - Input-Sanitization
      prompts/                 - System-Prompts nach Feature
        game-generator.ts
        recipe-generator.ts
        invitation-writer.ts
        chat-assistant.ts
        wizard-parser.ts
        schedule-optimizer.ts
      schemas/                 - Zod-Schemas fur KI-Outputs
        game.schema.ts
        recipe.schema.ts
        invitation.schema.ts
    data.ts                    UNVERANDERT - Datenbank-Abfragen
    plan-generator.ts          UNVERANDERT - Statische Berechnungen
    feature-gates.ts           NEU - Feature-Gate-Konstanten
  
  app/
    api/
      ai/                      NEU - KI-API-Routen
        parse-wizard/route.ts
        personalize/route.ts
        generate-game/route.ts
        generate-recipe/route.ts
        generate-invitation/route.ts
        optimize-schedule/route.ts
        chat/route.ts
        suggest-themes/route.ts
        optimize-budget/route.ts
      stripe/                  NEU (aus Free/Pro Konzept)
        checkout/route.ts
        webhook/route.ts
  
  components/
    ai/                        NEU - KI-UI-Komponenten
      AiChatPanel.tsx
      AiChatMessage.tsx
      AiGenerateButton.tsx
      AiLoadingIndicator.tsx
      AiContentBadge.tsx
      PersonalizationInput.tsx
      ThemeRecommendations.tsx
    child-profile/             NEU
    upgrade/                   NEU
```

### 7.4 Umgebungsvariablen (neue)

```bash
# .env.local (nie committen)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
AI_RATE_LIMIT_ENABLED=true
AI_MONTHLY_TOKEN_BUDGET_FREE=0       # Free-Nutzer: kein KI-Zugriff
AI_MONTHLY_TOKEN_BUDGET_PRO=500000   # Pro-Nutzer: 500k Tokens/Monat

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (fur RSVP und Aufgaben-Erinnerungen)
RESEND_API_KEY=re_...
FROM_EMAIL=noreply@geburtstagspilot.de
```

---

## 8. Qualitats- und Sicherheitsstandards fur KI-Features

### 8.1 KI-Output-Qualitatsstandards

Jeder KI-generierte Inhalt muss folgende Kriterien erfullen:

- **Vollstandigkeit:** Alle Pflichtfelder sind befult (Zod-Validierung)
- **Kindgerechtigkeit:** Keine ungeeigneten Inhalte (System-Prompt-Guardrails)
- **Sprachkorrektheit:** Deutscher Text ist grammatikalisch korrekt (GPT-4o-Standard)
- **Realisierbarkeit:** Rezept-Zutaten sind kauflich, Spiele mit erklartem Material durchfuhrbar
- **Transparenz:** Jeder KI-generierte Inhalt tragt ein `AiContentBadge`

### 8.2 Fallback-Verhalten

```typescript
// Wenn KI-API nicht verfugbar: Fallback auf statischen Content
async function getGameWithAiFallback(params: GameParams): Promise<Game> {
  try {
    const aiGame = await generateAiGame(params);
    return aiGame;
  } catch (error) {
    console.error('AI game generation failed, falling back to database', error);
    return getRandomGameFromDatabase(params);
  }
}
```

### 8.3 Datenschutz und DSGVO

- Kindnamen und Interessen werden **niemals** an OpenAI als identifizierbare Personendaten ubertragen
- Vor API-Call: Pseudonymisierung (Vorname -> "das Geburtstagskind", Interessen bleiben generisch)
- Nutzer muss explizit zustimmen, dass Eingaben zur KI-Verarbeitung gesendet werden (einmalige Zustimmung beim ersten KI-Feature-Aufruf)
- Konversationsverlauf kann jederzeit geloscht werden
- OpenAI-Datenprozessierungsvertrag (DPA) muss abgeschlossen sein

---

## 9. Priorisierung und MVP-KI

Nicht alle 10 Features mussen gleichzeitig implementiert werden. Priorisierung nach Business-Impact:

| Prioritat | Feature | Begrundung |
|---|---|---|
| P1 | KI-Chat-Assistent | Hochste wahrgenommene Wert, starkes Pro-Argument |
| P1 | Kinder-Interessen-Profiler | Loest Problem #1 der Nutzer, differenzierend |
| P2 | KI-Einladungstext | Schnell implementiert, klarer sichtbarer Wert |
| P2 | KI-Spielgenerierung | Loest Problem "immer gleiche Spiele" |
| P3 | Themen-Vorschlage KI | Gut fur Onboarding, nicht kritisch |
| P3 | Zeitplan-Optimierung | Nischenfeature fur organisierte Eltern |
| P4 | Rezept-Generator | Gut fur Allergiker, komplexere Validierung |
| P4 | Budget-Optimierung | Nischenfeature |
| P5 | NLU-Wizard-Modus | Nett to have, erfordert gute UX fur Fallback |
| P5 | Post-Party-Modul | Langfristige Retention, kein sofortiger Wert |

**MVP-KI (Phase 1-4 implementiert):**
- Chat-Assistent + Kinder-Interessen-Profiler + Einladungstext + Spielgenerierung
- Das reicht fur einen starken "KI-powered" Marketing-Claim
- Implementierungszeit: ~10-14 Tage
