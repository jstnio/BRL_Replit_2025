import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Features } from "@/components/sections/Features";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";

export function Home() {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <Features />
      <TestimonialsCarousel />
    </div>
  );
}