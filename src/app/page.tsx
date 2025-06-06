import HomeHero from "@/components/HomeHero";
import About from "@/components/About";
import CallToActionSection from "@/components/CallToAction";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <HomeHero />
      <About />
      <CallToActionSection />
    </div>
  );
}
