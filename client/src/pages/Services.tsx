import { motion } from "framer-motion";
import { Ship, Plane, Truck, Box, BarChart3, Warehouse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const services = [
  {
    titleKey: "services.page.oceanFreight.title",
    descriptionKey: "services.page.oceanFreight.description",
    icon: Ship,
    featuresKey: "services.page.oceanFreight.features",
  },
  {
    titleKey: "services.page.airFreight.title",
    descriptionKey: "services.page.airFreight.description",
    icon: Plane,
    featuresKey: "services.page.airFreight.features",
  },
  {
    titleKey: "services.page.groundTransport.title",
    descriptionKey: "services.page.groundTransport.description",
    icon: Truck,
    featuresKey: "services.page.groundTransport.features",
  },
  {
    titleKey: "services.page.cargoInsurance.title",
    descriptionKey: "services.page.cargoInsurance.description",
    icon: Box,
    featuresKey: "services.page.cargoInsurance.features",
  },
  {
    titleKey: "services.page.supplyChain.title",
    descriptionKey: "services.page.supplyChain.description",
    icon: Warehouse,
    featuresKey: "services.page.supplyChain.features",
  },
  {
    titleKey: "services.page.tracking.title",
    descriptionKey: "services.page.tracking.description",
    icon: BarChart3,
    featuresKey: "services.page.tracking.features",
  },
];

export function Services() {
  const { t } = useTranslation();

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {t('services.page.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('services.page.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.titleKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{t(service.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{t(service.descriptionKey)}</p>
                  <ul className="space-y-2">
                    {t(service.featuresKey, { returnObjects: true }).map((feature: string) => (
                      <li key={feature} className="flex items-center text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}