import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { QuoteIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

type Testimonial = {
  quote: string;
  author: string;
  title: string;
  company: string;
};

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { t } = useTranslation();

  const testimonials = t('testimonials.items', { returnObjects: true }) as Testimonial[];

  useEffect(() => {
    if (!isAutoPlaying || !testimonials?.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  if (!testimonials?.length) return null;

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight">
            {t('testimonials.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('testimonials.subtitle')}
          </p>
        </motion.div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <AnimatePresence initial={false} mode="wait" custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  setCurrentIndex((current) => (current + 1) % testimonials.length);
                } else if (swipe > swipeConfidenceThreshold) {
                  setCurrentIndex((current) => 
                    current === 0 ? testimonials.length - 1 : current - 1
                  );
                }
              }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-12 px-8 pb-8">
                  <QuoteIcon className="h-12 w-12 text-primary/20 absolute top-8 left-8" />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative z-10"
                  >
                    <blockquote className="text-xl text-gray-900 mb-8">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                    <motion.div 
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      <Avatar className="h-12 w-12 border-2 border-primary/20" />
                      <div>
                        <motion.div 
                          className="font-semibold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {testimonials[currentIndex].author}
                        </motion.div>
                        <motion.div 
                          className="text-sm text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {testimonials[currentIndex].title}
                        </motion.div>
                        <motion.div 
                          className="text-sm font-medium text-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {testimonials[currentIndex].company}
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-4"
                    : "bg-primary/20 w-2"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}