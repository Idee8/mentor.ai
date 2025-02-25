import Navbar from "@/components/navbar";
import ClickSpark from "@/components/ui/click-spark";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClickSpark>
      <Navbar />
      {children}
    </ClickSpark>
  );
}
