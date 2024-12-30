import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Features } from "@/components/sections/Features";

export function Home() {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <Features />
    </div>
  );
}
