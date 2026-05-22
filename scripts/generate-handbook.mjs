/**
 * Geburtstagspilot User Manual / Benutzerhandbuch Generator
 * Generates .docx files in German and English
 */

import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType
} from "docx";
import fs from "fs";

const FALLBACK_FONT = "Arial";
const PURPLE = "7C3AED";
const DARK = "18181B";
const GRAY = "52525B";
const LIGHT_GRAY = "A1A1AA";
const TODAY_DE = "Mai 2026";
const TODAY_EN = "May 2026";

const r = (text, opts = {}) =>
  new TextRun({ text: String(text), font: FALLBACK_FONT, size: 22, color: DARK, ...opts });

const p = (text, opts = {}) =>
  new Paragraph({ children: [r(text, { color: GRAY })], spacing: { after: 120 }, ...opts });

const h1 = (text) =>
  new Paragraph({
    children: [r(text, { bold: true, size: 36, color: PURPLE })],
    spacing: { before: 500, after: 200 },
  });

const h3 = (text) =>
  new Paragraph({
    children: [r(text, { bold: true, size: 24, color: DARK })],
    spacing: { before: 240, after: 100 },
  });

const bullet = (text) =>
  new Paragraph({
    children: [r(text, { color: GRAY })],
    bullet: { level: 0 },
    spacing: { after: 60 },
  });

const numberedItem = (num, title, desc) =>
  new Paragraph({
    children: [
      r(`${num}. `, { bold: true, color: PURPLE }),
      r(title, { bold: true }),
      r(` - ${desc}`, { color: GRAY }),
    ],
    spacing: { after: 100 },
  });

function generateDE() {
  return new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } },
      },
      children: [
        // Title Page
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          children: [r("Geburtstagspilot", { bold: true, size: 56, color: PURPLE })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [r("Benutzerhandbuch", { size: 32, color: DARK })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [r("3 Stunden Spaß. 5 Minuten Planung.", { italics: true, size: 24, color: GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        new Paragraph({
          children: [r(`Stand: ${TODAY_DE}`, { size: 20, color: LIGHT_GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [r("WAMOCON GmbH", { size: 20, color: LIGHT_GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [r("www.geburtstagspilot.de", { size: 20, color: PURPLE })],
          alignment: AlignmentType.CENTER,
        }),

        // Inhaltsverzeichnis
        h1("Inhaltsverzeichnis"),
        numberedItem(1, "Willkommen", "Einführung in Geburtstagspilot"),
        numberedItem(2, "Erste Schritte", "Registrierung und erster Plan"),
        numberedItem(3, "Der Party-Wizard", "7 Schritte zum perfekten Plan"),
        numberedItem(4, "Dein Partyplan", "Alle Bereiche im Überblick"),
        numberedItem(5, "Dashboard", "Pläne verwalten"),
        numberedItem(6, "Pläne teilen", "Zusammenarbeit mit anderen Eltern"),
        numberedItem(7, "Pro-Funktionen", "Erweiterte Features"),
        numberedItem(8, "Verfügbare Mottos", "14 Themen zur Auswahl"),
        numberedItem(9, "Häufige Fragen", "FAQ"),
        numberedItem(10, "Hilfe & Support", "Kontakt"),

        // 1. Willkommen
        h1("1. Willkommen bei Geburtstagspilot"),
        p("Geburtstagspilot hilft dir, den perfekten Kindergeburtstag in nur 5 Minuten zu planen. Dieses Handbuch erklärt alle Funktionen Schritt für Schritt."),
        p("Mit Geburtstagspilot bekommst du einen kompletten Partyplan, der Zeitablauf, Spiele, Rezepte, Einkaufsliste, Einladung und Mitgebsel-Ideen enthält, alles automatisch auf das Alter und die Gästezahl deines Kindes zugeschnitten."),

        // 2. Erste Schritte
        h1("2. Erste Schritte"),
        h3("Konto erstellen"),
        p("Registriere dich kostenlos mit deiner E-Mail-Adresse. Du erhältst sofort Zugang zum Party-Wizard und kannst bis zu 3 Pläne kostenlos erstellen."),
        h3("Wizard starten"),
        p("Klicke auf 'Jetzt planen' und beantworte 7 einfache Fragen: Alter, Gästezahl, Ort, Motto, Dauer, Allergien und Budget."),
        h3("Plan erhalten"),
        p("In Sekunden erhältst du einen kompletten Partyplan mit Zeitablauf, Spielen, Rezepten, Einkaufsliste, Einladung und Mitgebsel-Ideen."),

        // 3. Party-Wizard
        h1("3. Der Party-Wizard"),
        p("Der Wizard führt dich in 7 Schritten zum perfekten Partyplan:"),
        bullet("Schritt 1: Alter des Kindes (3 bis 12 Jahre)"),
        bullet("Schritt 2: Anzahl der Gäste (3 bis 20 Kinder)"),
        bullet("Schritt 3: Ort der Feier (drinnen, draußen oder beides)"),
        bullet("Schritt 4: Motto-Auswahl aus 14 Themen"),
        bullet("Schritt 5: Dauer der Party (2 bis 4 Stunden)"),
        bullet("Schritt 6: Allergien und besondere Wünsche"),
        bullet("Schritt 7: Budget-Rahmen (optional)"),

        // 4. Partyplan
        h1("4. Dein Partyplan"),
        p("Nach dem Wizard erhältst du einen umfassenden Plan mit folgenden Bereichen:"),
        h3("Zeitablauf"),
        p("Minutengenaue Planung für die gesamte Feier mit automatischen Pufferzeiten zwischen den Aktivitäten."),
        h3("Spiele"),
        p("5 altersgerechte Spiele mit detaillierten Anleitungen, Materiallisten und Zeitangaben, passend zum gewählten Motto."),
        h3("Essen & Kuchen"),
        p("Rezepte und Mengenberechnungen exakt für deine Gästezahl, mit Berücksichtigung von Allergien und besonderen Wünschen."),
        h3("Einkaufsliste"),
        p("Alle benötigten Materialien und Lebensmittel nach Kategorien sortiert: Lebensmittel, Getränke, Bastelmaterial, Dekoration und Mitgebsel."),
        h3("Einladung"),
        p("Druckfertige Einladung zum Personalisieren mit allen wichtigen Informationen wie Datum, Uhrzeit und Adresse."),
        h3("Mitgebsel"),
        p("Mitgebsel-Ideen in drei Budget-Stufen: Sparfuchs (ca. 2 EUR), Goldene Mitte (ca. 5 EUR) und Deluxe (ca. 8 EUR pro Kind)."),

        // 5. Dashboard
        h1("5. Dashboard"),
        p("Im Dashboard findest du alle deine gespeicherten Partypläne. Hier kannst du:"),
        bullet("Gespeicherte Pläne laden und bearbeiten"),
        bullet("Pläne mit anderen Eltern teilen"),
        bullet("Neue Pläne erstellen"),
        bullet("Deinen Kontostatus einsehen (Free oder Pro)"),

        // 6. Pläne teilen
        h1("6. Pläne teilen"),
        p("Teile deine Partypläne ganz einfach mit anderen Eltern oder Helfern:"),
        bullet("1. Öffne den gewünschten Plan"),
        bullet("2. Klicke auf 'Plan teilen'"),
        bullet("3. Kopiere den generierten Link oder teile per WhatsApp"),

        // 7. Pro-Funktionen
        h1("7. Pro-Funktionen"),
        p("Mit dem Pro-Plan (1,99 EUR/Monat) schaltest du folgende Funktionen frei:"),
        bullet("Bis zu 50 gespeicherte Pläne"),
        bullet("KI Party-Coach als Chat-Assistent"),
        bullet("KI-generierte Spielvorschläge"),
        bullet("KI-Einladungstexte"),
        bullet("Eltern-Kollaboration in Echtzeit"),
        bullet("RSVP-Tracking mit E-Mail-Versand"),
        bullet("Kinderprofile für zukünftige Partys"),
        bullet("Aufgaben-Manager mit Erinnerungen"),
        bullet("Budget-Tracker"),
        bullet("Dauerhafte Teilen-Links"),

        // 8. Mottos
        h1("8. Verfügbare Mottos"),
        p("Wähle aus 14 liebevoll gestalteten Mottos:"),
        bullet("Piraten"),
        bullet("Prinzessin"),
        bullet("Dinosaurier"),
        bullet("Weltraum"),
        bullet("Fußball"),
        bullet("Detektiv"),
        bullet("Einhorn"),
        bullet("Tiere"),
        bullet("Superhelden"),
        bullet("Zirkus"),
        bullet("Ritter"),
        bullet("Meerjungfrau"),
        bullet("Dschungel"),
        bullet("Ohne Motto"),

        // 9. FAQ
        h1("9. Häufige Fragen"),
        h3("Ist Geburtstagspilot kostenlos?"),
        p("Ja, der Basis-Plan ist komplett kostenlos. Du kannst bis zu 3 Partypläne erstellen. Für erweiterte Funktionen gibt es den Pro-Plan ab 1,99 EUR/Monat."),
        h3("Wie werden meine Daten geschützt?"),
        p("Wir nehmen Datenschutz ernst. Alle Daten werden verschlüsselt übertragen und gespeichert. Details findest du in unserer Datenschutzerklärung."),
        h3("Kann ich einen Plan nachträglich bearbeiten?"),
        p("Ja, du kannst gespeicherte Pläne jederzeit im Dashboard öffnen und bearbeiten."),
        h3("Für welche Altersgruppe ist Geburtstagspilot geeignet?"),
        p("Geburtstagspilot ist für Kindergeburtstage von 3 bis 12 Jahren optimiert."),
        h3("Kann ich meinen Account löschen?"),
        p("Ja, kontaktiere uns unter info@wamocon.com und wir löschen deinen Account und alle zugehörigen Daten."),
        h3("Was passiert wenn ich das Pro-Abo kündige?"),
        p("Nach der Kündigung behältst du Zugriff bis zum Ende des Abrechnungszeitraums. Danach wechselst du zum kostenlosen Plan."),

        // 10. Support
        h1("10. Hilfe & Support"),
        p("Du hast Fragen oder brauchst Hilfe? Kontaktiere uns:"),
        p("E-Mail: info@wamocon.com"),
        p("Telefon: +49 6196 5838311"),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          children: [r("WAMOCON GmbH | Mergenthalerallee 79 - 81 | 65760 Eschborn", { size: 18, color: LIGHT_GRAY })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });
}

function generateEN() {
  return new Document({
    sections: [{
      properties: {
        page: { margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 } },
      },
      children: [
        // Title Page
        new Paragraph({ spacing: { before: 2000 } }),
        new Paragraph({
          children: [r("Geburtstagspilot", { bold: true, size: 56, color: PURPLE })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [r("User Manual", { size: 32, color: DARK })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
        }),
        new Paragraph({
          children: [r("3 Hours of Fun. 5 Minutes of Planning.", { italics: true, size: 24, color: GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        new Paragraph({
          children: [r(`As of: ${TODAY_EN}`, { size: 20, color: LIGHT_GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [r("WAMOCON GmbH", { size: 20, color: LIGHT_GRAY })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [r("www.geburtstagspilot.de", { size: 20, color: PURPLE })],
          alignment: AlignmentType.CENTER,
        }),

        // Table of Contents
        h1("Table of Contents"),
        numberedItem(1, "Welcome", "Introduction to Geburtstagspilot"),
        numberedItem(2, "Getting Started", "Registration and first plan"),
        numberedItem(3, "The Party Wizard", "7 steps to the perfect plan"),
        numberedItem(4, "Your Party Plan", "All sections at a glance"),
        numberedItem(5, "Dashboard", "Manage your plans"),
        numberedItem(6, "Sharing Plans", "Collaborate with other parents"),
        numberedItem(7, "Pro Features", "Advanced functionality"),
        numberedItem(8, "Available Themes", "14 themes to choose from"),
        numberedItem(9, "FAQ", "Frequently Asked Questions"),
        numberedItem(10, "Help & Support", "Contact"),

        // 1. Welcome
        h1("1. Welcome to Geburtstagspilot"),
        p("Geburtstagspilot helps you plan the perfect children's birthday party in just 5 minutes. This manual explains all features step by step."),
        p("With Geburtstagspilot you get a complete party plan that includes schedule, games, recipes, shopping list, invitation, and goodie bag ideas, all automatically tailored to your child's age and guest count."),

        // 2. Getting Started
        h1("2. Getting Started"),
        h3("Create an Account"),
        p("Register for free with your email address. You get immediate access to the party wizard and can create up to 3 plans for free."),
        h3("Start the Wizard"),
        p("Click 'Start Planning' and answer 7 simple questions: age, guest count, location, theme, duration, allergies, and budget."),
        h3("Get Your Plan"),
        p("In seconds you receive a complete party plan with schedule, games, recipes, shopping list, invitation, and goodie bag ideas."),

        // 3. Party Wizard
        h1("3. The Party Wizard"),
        p("The wizard guides you through 7 steps to the perfect party plan:"),
        bullet("Step 1: Child's age (3 to 12 years)"),
        bullet("Step 2: Number of guests (3 to 20 children)"),
        bullet("Step 3: Party location (indoor, outdoor, or both)"),
        bullet("Step 4: Theme selection from 14 options"),
        bullet("Step 5: Party duration (2 to 4 hours)"),
        bullet("Step 6: Allergies and special requirements"),
        bullet("Step 7: Budget range (optional)"),

        // 4. Party Plan
        h1("4. Your Party Plan"),
        p("After the wizard, you receive a comprehensive plan with the following sections:"),
        h3("Schedule"),
        p("Minute-by-minute planning for the entire party with automatic buffer times between activities."),
        h3("Games"),
        p("5 age-appropriate games with detailed instructions, material lists, and time estimates, matching your chosen theme."),
        h3("Food & Cake"),
        p("Recipes and quantity calculations exact to your guest count, considering allergies and special requirements."),
        h3("Shopping List"),
        p("All required materials and food sorted by category: food, drinks, craft materials, decoration, and goodie bag contents."),
        h3("Invitation"),
        p("Print-ready invitation for personalization with all important information like date, time, and address."),
        h3("Goodie Bags"),
        p("Goodie bag ideas in three budget levels: Budget Friendly (approx. 2 EUR), Golden Middle (approx. 5 EUR), and Deluxe (approx. 8 EUR per child)."),

        // 5. Dashboard
        h1("5. Dashboard"),
        p("In the dashboard you find all your saved party plans. Here you can:"),
        bullet("Load and edit saved plans"),
        bullet("Share plans with other parents"),
        bullet("Create new plans"),
        bullet("View your account status (Free or Pro)"),

        // 6. Sharing Plans
        h1("6. Sharing Plans"),
        p("Share your party plans easily with other parents or helpers:"),
        bullet("1. Open the desired plan"),
        bullet("2. Click 'Share Plan'"),
        bullet("3. Copy the generated link or share via WhatsApp"),

        // 7. Pro Features
        h1("7. Pro Features"),
        p("With the Pro plan (1.99 EUR/month) you unlock the following features:"),
        bullet("Up to 50 saved plans"),
        bullet("AI Party Coach as chat assistant"),
        bullet("AI-generated game suggestions"),
        bullet("AI invitation texts"),
        bullet("Real-time parent collaboration"),
        bullet("RSVP tracking with email sending"),
        bullet("Child profiles for future parties"),
        bullet("Task manager with reminders"),
        bullet("Budget tracker"),
        bullet("Permanent share links"),

        // 8. Themes
        h1("8. Available Themes"),
        p("Choose from 14 lovingly designed themes:"),
        bullet("Pirates"),
        bullet("Princess"),
        bullet("Dinosaurs"),
        bullet("Space"),
        bullet("Soccer"),
        bullet("Detective"),
        bullet("Unicorn"),
        bullet("Animals"),
        bullet("Superheroes"),
        bullet("Circus"),
        bullet("Knights"),
        bullet("Mermaid"),
        bullet("Jungle"),
        bullet("No Theme"),

        // 9. FAQ
        h1("9. Frequently Asked Questions"),
        h3("Is Geburtstagspilot free?"),
        p("Yes, the basic plan is completely free. You can create up to 3 party plans. For advanced features, there is the Pro plan starting at 1.99 EUR/month."),
        h3("How is my data protected?"),
        p("We take data protection seriously. All data is transmitted and stored encrypted. Details can be found in our Privacy Policy."),
        h3("Can I edit a plan later?"),
        p("Yes, you can open and edit saved plans anytime from the dashboard."),
        h3("What age group is Geburtstagspilot designed for?"),
        p("Geburtstagspilot is optimized for children's birthday parties ages 3 to 12."),
        h3("Can I delete my account?"),
        p("Yes, contact us at info@wamocon.com and we will delete your account and all associated data."),
        h3("What happens if I cancel my Pro subscription?"),
        p("After cancellation, you retain access until the end of the billing period. After that, you switch to the free plan."),

        // 10. Support
        h1("10. Help & Support"),
        p("Have questions or need help? Contact us:"),
        p("Email: info@wamocon.com"),
        p("Phone: +49 6196 5838311"),
        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          children: [r("WAMOCON GmbH | Mergenthalerallee 79 - 81 | 65760 Eschborn", { size: 18, color: LIGHT_GRAY })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });
}

async function main() {
  console.log("Generating Geburtstagspilot User Manual...");

  const deDoc = generateDE();
  const deBuffer = await Packer.toBuffer(deDoc);
  fs.writeFileSync("public/Benutzerhandbuch_Geburtstagspilot_DE.docx", deBuffer);
  console.log("  Created: public/Benutzerhandbuch_Geburtstagspilot_DE.docx");

  const enDoc = generateEN();
  const enBuffer = await Packer.toBuffer(enDoc);
  fs.writeFileSync("public/UserManual_Geburtstagspilot_EN.docx", enBuffer);
  console.log("  Created: public/UserManual_Geburtstagspilot_EN.docx");

  console.log("Done!");
}

main().catch(console.error);
