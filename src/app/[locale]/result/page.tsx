import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultView } from "@/components/result/ResultView";

export default function ResultPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-party-cream to-white dark:from-zinc-950 dark:to-zinc-900 py-6 sm:py-8 px-4">
        <ResultView />
      </main>
      <Footer />
    </>
  );
}
