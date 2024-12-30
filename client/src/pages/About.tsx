import { motion } from "framer-motion";
import { Award, Users, Globe2, TrendingUp } from "lucide-react";

const stats = [
  { label: "Years of Experience", value: "15+" },
  { label: "Global Offices", value: "25+" },
  { label: "Satisfied Clients", value: "1000+" },
  { label: "Countries Served", value: "100+" },
];

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive for excellence in every aspect of our service, maintaining the highest standards of quality and professionalism.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Our clients are at the heart of everything we do. We build lasting relationships through dedicated service and support.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description:
      "With a worldwide network of partners and offices, we provide seamless logistics solutions across continents.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We continuously invest in technology and processes to improve our services and stay ahead of industry trends.",
  },
];

export function About() {
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
            About BRL Global
          </h1>
          <p className="text-lg text-muted-foreground">
            A leading provider of global logistics solutions, committed to
            excellence and innovation in freight forwarding services.
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
              <div className="text-sm text-muted-foreground">{stat.label}</div>
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
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose max-w-none">
            <p className="text-muted-foreground mb-4">
              Founded in 2008, BRL Global has grown from a small regional
              freight forwarder to a leading international logistics provider.
              Our journey has been marked by continuous innovation, strategic
              expansion, and an unwavering commitment to customer service.
            </p>
            <p className="text-muted-foreground">
              Today, we operate across multiple continents, serving diverse
              industries with comprehensive logistics solutions. Our success
              is built on our dedicated team, advanced technology, and
              strong partnerships with carriers and agents worldwide.
            </p>
          </div>
        </motion.div>

        {/* Company Values */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg text-center"
              >
                <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
