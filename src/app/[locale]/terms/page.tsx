import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1>Allgemeine Geschäftsbedingungen</h1>

          <h2>1. Geltungsbereich</h2>
          <p>
            Diese AGB gelten für die Nutzung der Webanwendung KinderPartyPlaner,
            betrieben von der WAMOCON GmbH, Mergenthalerallee 79 - 81, 65760 Eschborn.
          </p>

          <h2>2. Leistungsbeschreibung</h2>
          <p>
            KinderPartyPlaner ist ein kostenloses Online-Tool zur Planung von Kindergeburtstagen.
            Der Dienst generiert personalisierte Partypläne basierend auf Nutzereingaben.
          </p>

          <h2>3. Nutzungsbedingungen</h2>
          <p>
            Die Nutzung des kostenlosen Angebots erfordert keine Registrierung.
            Die generierten Inhalte (Spielanleitungen, Rezepte) dienen als Vorschläge
            und ersetzen keine Aufsichtspflicht.
          </p>

          <h2>4. Haftungsausschluss</h2>
          <p>
            Die WAMOCON GmbH übernimmt keine Haftung für die Richtigkeit der
            generierten Mengenangaben, Rezepte oder Spielanleitungen. Die Durchführung
            aller Aktivitäten erfolgt auf eigene Verantwortung.
          </p>

          <h2>5. Anwendbares Recht</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland.
            Gerichtsstand ist Eschborn.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
