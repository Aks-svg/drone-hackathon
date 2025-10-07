import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { WasteSection } from "@/components/sections/WasteSection";
import { PlantationSection } from "@/components/sections/PlantationSection";
import { SolarSection } from "@/components/sections/SolarSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <WasteSection />
      <PlantationSection />
      <SolarSection />
    </div>
  );
};

export default Index;
