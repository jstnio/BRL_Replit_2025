import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/sections/ContactForm";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["1234 Logistics Way", "Suite 100", "Los Angeles, CA 90001"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+1 (555) 123-4567", "+1 (555) 765-4321"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["contact@brlglobal.com", "support@brlglobal.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Monday - Friday", "9:00 AM - 6:00 PM PST"],
  },
];

export function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with our team for any inquiries about our services
            or to request a quote.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          <div className="space-y-8">
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg"
              >
                <div className="flex items-center mb-4">
                  <item.icon className="h-6 w-6 text-primary mr-3" />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <div className="space-y-1">
                  {item.details.map((detail) => (
                    <p key={detail} className="text-muted-foreground">
                      {detail}
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
