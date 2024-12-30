import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";

const testimonials = [
  {
    quote: "BRL Global has transformed our logistics operations with their efficient and reliable services. Their global network and expertise have been invaluable to our business growth.",
    author: "Sarah Johnson",
    title: "Supply Chain Director",
    company: "TechCorp International",
  },
  {
    quote: "Outstanding service and professional team. BRL Global consistently delivers on their promises, making them our trusted partner for all shipping needs.",
    author: "Michael Chen",
    title: "Operations Manager",
    company: "Global Innovations Ltd",
  },
  {
    quote: "Their commitment to excellence and innovative solutions has significantly improved our shipping efficiency. BRL Global is a game-changer in the logistics industry.",
    author: "Emma Rodriguez",
    title: "Logistics Coordinator",
    company: "Summit Enterprises",
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Trusted by businesses worldwide for reliable logistics solutions
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto"
             onMouseEnter={() => setIsAutoPlaying(false)}
             onMouseLeave={() => setIsAutoPlaying(true)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-12 px-8 pb-8">
                  <QuoteIcon className="h-12 w-12 text-primary/20 absolute top-8 left-8" />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10"
                  >
                    <blockquote className="text-xl text-gray-900 mb-8">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-primary/20" />
                      <div>
                        <div className="font-semibold">
                          {testimonials[currentIndex].author}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {testimonials[currentIndex].title}
                        </div>
                        <div className="text-sm font-medium text-primary">
                          {testimonials[currentIndex].company}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-primary/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
