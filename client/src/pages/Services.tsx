import { motion } from "framer-motion";
import { Ship, Plane, Truck, Box, BarChart3, Warehouse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Ocean Freight",
    description:
      "Complete ocean freight solutions including FCL (Full Container Load) and LCL (Less than Container Load) services. We handle customs clearance, documentation, and port handling.",
    icon: Ship,
    features: ["FCL & LCL Services", "Port-to-Port Delivery", "Custom Clearance"],
  },
  {
    title: "Air Freight",
    description:
      "Express air freight services for time-critical shipments. Our global network ensures quick and reliable delivery to any destination worldwide.",
    icon: Plane,
    features: ["Express Delivery", "Door-to-Door Service", "Priority Handling"],
  },
  {
    title: "Ground Transport",
    description:
      "Efficient ground transportation solutions including FTL and LTL services. We offer cross-border shipping and domestic distribution services.",
    icon: Truck,
    features: ["FTL & LTL Options", "Cross-border Solutions", "Last Mile Delivery"],
  },
  {
    title: "Cargo Insurance",
    description:
      "Comprehensive cargo insurance options to protect your shipments against loss, damage, or theft during transit.",
    icon: Box,
    features: ["Full Coverage", "Risk Assessment", "Claims Support"],
  },
  {
    title: "Supply Chain Solutions",
    description:
      "End-to-end supply chain management services including warehousing, distribution, and inventory management.",
    icon: Warehouse,
    features: ["Inventory Management", "Distribution", "Order Fulfillment"],
  },
  {
    title: "Track & Trace",
    description:
      "Real-time shipment tracking and monitoring services with detailed analytics and reporting capabilities.",
    icon: BarChart3,
    features: ["Real-time Updates", "Analytics Dashboard", "Status Notifications"],
  },
];

export function Services() {
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
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive logistics solutions tailored to meet your global shipping needs.
            We offer end-to-end supply chain services with reliability and efficiency.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <service.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
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
