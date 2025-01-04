import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { Features } from "@/components/sections/Features";
import { TestimonialsCarousel } from "@/components/sections/TestimonialsCarousel";

export function Home() {
  return (
    <div>
      <Hero />
      <ServicesSection />
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <video 
              className="w-full rounded-lg shadow-xl" 
              controls
              poster="/attached_assets/BRL_vector.png"
            >
              <source src="/attached_assets/BRL_Container_Inpection.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
      <Features />
      <TestimonialsCarousel />
    </div>
  );
}