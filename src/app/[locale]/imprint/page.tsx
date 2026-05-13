import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ImprintPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 sm:p-8 shadow-md border border-zinc-100 dark:border-zinc-700">
            <div className="prose dark:prose-invert prose-headings:font-extrabold prose-h1:text-2xl sm:prose-h1:text-3xl prose-h2:text-lg prose-p:text-sm prose-p:leading-relaxed max-w-none">
          <h1>Impressum</h1>
          <h2>WAMOCON GmbH</h2>
          <p>
            Mergenthalerallee 79 - 81<br />
            65760 Eschborn<br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: +49 6196 5838311<br />
            E-Mail: info@wamocon.com
          </p>

          <h2>Vertretungsberechtigter Geschäftsführer</h2>
          <p>Dipl.-Ing. Waleri Moretz</p>

          <h2>Registereintrag</h2>
          <p>
            Sitz der Gesellschaft: Eschborn<br />
            Handelsregister: Eschborn HRB 123666<br />
            Umsatzsteuer-Identifikationsnummer: DE344930486
          </p>

          <h2>Angaben zum Angebot</h2>
          <p>
            KinderPartyPlaner ist eine webbasierte Applikation zur Planung von Kindergeburtstagen.
            Das Angebot richtet sich an Eltern und Erziehungsberechtigte im deutschsprachigen Raum.
          </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
