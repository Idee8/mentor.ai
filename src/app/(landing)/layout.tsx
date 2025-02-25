import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ClickSpark from "@/components/ui/click-spark";
import LandingProvider from "./provider";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LandingProvider>
      <ClickSpark>
        <Navbar />
        {children}
        <Footer />
      </ClickSpark>
    </LandingProvider>
  );
}
