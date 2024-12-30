import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";
import { useTranslation } from "react-i18next";

const contactInfo = [
  {
    icon: MapPin,
    titleKey: "contact.info.address.title",
    details: ["contact.info.address.line1", "contact.info.address.line2", "contact.info.address.line3"],
  },
  {
    icon: Phone,
    titleKey: "contact.info.phone.title",
    details: ["contact.info.phone.main", "contact.info.phone.support"],
  },
  {
    icon: Mail,
    titleKey: "contact.info.email.title",
    details: ["contact.info.email.general", "contact.info.email.support"],
  },
  {
    icon: Clock,
    titleKey: "contact.info.hours.title",
    details: ["contact.info.hours.days", "contact.info.hours.time"],
  },
];

export function Contact() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('contact.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="space-y-8">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.titleKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <item.icon className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-semibold">{t(item.titleKey)}</h3>
                </div>
                <div className="space-y-1">
                  {item.details.map((detail) => (
                    <p key={detail} className="text-muted-foreground">
                      {t(detail)}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}