import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
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
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
