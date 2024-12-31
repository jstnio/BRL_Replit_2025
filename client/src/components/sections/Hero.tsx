import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const services = [
  "services.oceanFreight.title",
  "services.airFreight.title",
  "services.groundTransport.title"
];

export function Hero() {
  const { t } = useTranslation();
  const [currentService, setCurrentService] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService((current) => (current + 1) % services.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-2 font-['Inter']">
            {t('hero.title')}
          </h1>
          <div className="relative h-24 mb-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentService}
                initial={{ 
                  opacity: 0,
                  y: 40,
                  rotateX: -90
                }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  rotateX: 0
                }}
                exit={{ 
                  opacity: 0,
                  y: -40,
                  rotateX: 90
                }}
                transition={{ 
                  duration: 0.6,
                  ease: [0.23, 1, 0.32, 1],
                  opacity: { duration: 0.3 }
                }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
              >
                <span className="text-4xl sm:text-6xl font-[600] bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text tracking-tight font-['Inter'] py-2 px-6">
                  {t(services[currentService])}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
          <p className="mt-2 text-lg leading-8 text-gray-600 font-[300] font-['Inter']">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" className="min-w-[150px] font-[500]">
              {t('hero.cta.primary')}
            </Button>
            <Button size="lg" variant="outline" className="min-w-[150px] font-[500]">
              {t('hero.cta.secondary')}
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
            fillOpacity=".2"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9089FC" />
              <stop offset={1} stopColor="#FF80B5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}