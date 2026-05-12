import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResultView } from "@/components/result/ResultView";

export default function ResultPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8 px-4">
        <ResultView />
      </main>
      <Footer />
    </>
  );
}
