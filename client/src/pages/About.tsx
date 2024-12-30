import { motion } from "framer-motion";
import { Award, Users, Globe2, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const stats = [
  { label: "about.stats.experience", value: "15+" },
  { label: "about.stats.offices", value: "25+" },
  { label: "about.stats.clients", value: "1000+" },
  { label: "about.stats.countries", value: "100+" },
];

const values = [
  {
    icon: Award,
    titleKey: "about.values.excellence.title",
    descriptionKey: "about.values.excellence.description",
  },
  {
    icon: Users,
    titleKey: "about.values.customerFocus.title",
    descriptionKey: "about.values.customerFocus.description",
  },
  {
    icon: Globe2,
    titleKey: "about.values.globalReach.title",
    descriptionKey: "about.values.globalReach.description",
  },
  {
    icon: TrendingUp,
    titleKey: "about.values.innovation.title",
    descriptionKey: "about.values.innovation.description",
  },
];

export function About() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {t('about.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('about.subtitle')}
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{t(stat.label)}</div>
            </motion.div>
          ))}
        </div>

        {/* Company Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-8 mb-24"
        >
          <h2 className="text-3xl font-bold mb-6">{t('about.story.title')}</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-4">
              {t('about.story.part1')}
            </p>
            <p className="text-muted-foreground">
              {t('about.story.part2')}
            </p>
          </div>
        </motion.div>

        {/* Company Values */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">{t('about.values.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg text-center"
              >
                <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t(value.titleKey)}</h3>
                <p className="text-muted-foreground">{t(value.descriptionKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}