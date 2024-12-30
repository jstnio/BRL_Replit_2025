import { motion } from "framer-motion";
import { Ship, Plane, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Ocean Freight",
    description:
      "Reliable ocean freight solutions for your global shipping needs. FCL and LCL services available.",
    icon: Ship,
  },
  {
    title: "Air Freight",
    description:
      "Fast and efficient air freight services for time-sensitive cargo worldwide.",
    icon: Plane,
  },
  {
    title: "Ground Transport",
    description:
      "Comprehensive ground transportation solutions for domestic and cross-border shipping.",
    icon: Truck,
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive logistics solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
