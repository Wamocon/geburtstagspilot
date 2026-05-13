import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md border border-zinc-100 dark:border-zinc-700">
            <div className="prose dark:prose-invert prose-headings:font-extrabold prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-lg prose-p:text-sm prose-p:leading-relaxed max-w-none">
          <h1>Datenschutzerklärung</h1>

          <h2>1. Verantwortlicher</h2>
          <p>
            WAMOCON GmbH<br />
            Mergenthalerallee 79 - 81<br />
            65760 Eschborn<br />
            E-Mail: info@wamocon.com
          </p>

          <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p>
            KinderPartyPlaner erhebt in Version 1 keine personenbezogenen Daten.
            Es ist kein Nutzerkonto erforderlich. Alle eingegebenen Daten (Alter, Gästezahl, Motto)
            werden ausschließlich lokal im Browser verarbeitet und nicht an Server übermittelt.
          </p>

          <h2>3. Cookies</h2>
          <p>
            Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch notwendige
            Cookies für die Sprachauswahl gespeichert.
          </p>

          <h2>4. Hosting</h2>
          <p>
            Die Website wird auf Vercel (Vercel Inc., San Francisco, USA) gehostet.
            Vercel verarbeitet Zugriffsdaten (IP-Adresse, Zeitstempel) gemäß deren Datenschutzerklärung.
          </p>

          <h2>5. Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung
            Ihrer personenbezogenen Daten. Kontaktieren Sie uns unter info@wamocon.com.
          </p>            </div>
          </div>        </div>
      </main>
      <Footer />
    </>
  );
}
