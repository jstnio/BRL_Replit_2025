import { motion } from "framer-motion";
import { Globe2, Clock, Shield, BarChart } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  {
    nameKey: "features.globalNetwork.name",
    descriptionKey: "features.globalNetwork.description",
    icon: Globe2,
  },
  {
    nameKey: "features.support.name",
    descriptionKey: "features.support.description",
    icon: Clock,
  },
  {
    nameKey: "features.security.name",
    descriptionKey: "features.security.description",
    icon: Shield,
  },
  {
    nameKey: "features.analytics.name",
    descriptionKey: "features.analytics.description",
    icon: BarChart,
  },
];

export function Features() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('features.title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.nameKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-white rounded-lg shadow-sm"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t(feature.nameKey)}</h3>
              <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}