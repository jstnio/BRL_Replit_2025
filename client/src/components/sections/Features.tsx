import { motion } from "framer-motion";
import { Globe2, Clock, Shield, BarChart } from "lucide-react";

const features = [
  {
    name: "Global Network",
    description:
      "Access to an extensive network of partners and carriers worldwide",
    icon: Globe2,
  },
  {
    name: "24/7 Support",
    description:
      "Round-the-clock customer support and shipment tracking",
    icon: Clock,
  },
  {
    name: "Secure Handling",
    description:
      "Advanced cargo protection and security measures",
    icon: Shield,
  },
  {
    name: "Data Analytics",
    description:
      "Real-time tracking and performance analytics",
    icon: BarChart,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Why Choose BRL Global
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We combine industry expertise with innovative technology to deliver
            superior logistics solutions
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 bg-white rounded-lg shadow-sm"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
