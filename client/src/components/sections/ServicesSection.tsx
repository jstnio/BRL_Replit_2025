import { motion } from "framer-motion";
import { Ship, Plane, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const services = [
  {
    titleKey: "services.oceanFreight.title",
    descriptionKey: "services.oceanFreight.description",
    icon: Ship,
  },
  {
    titleKey: "services.airFreight.title",
    descriptionKey: "services.airFreight.description",
    icon: Plane,
  },
  {
    titleKey: "services.groundTransport.title",
    descriptionKey: "services.groundTransport.description",
    icon: Truck,
  },
];

export function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">{t('services.title')}</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{t(service.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{t(service.descriptionKey)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}