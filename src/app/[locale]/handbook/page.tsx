import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HandbookContent } from "@/components/handbook/HandbookContent";

export default function HandbookPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HandbookContent />
      </main>
      <Footer />
    </>
  );
}
