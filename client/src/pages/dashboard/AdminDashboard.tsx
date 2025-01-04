import { useTranslation } from "react-i18next";
import { DashboardLayout } from "./DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Plane,
  Ship,
  Building2,
  Globe2,
  Users,
  Scale,
  Globe,
  Truck,
  Warehouse,
  Container,
  FileText,
  DollarSign,
  Briefcase,
  PackageCheck,
  Stamp,
} from "lucide-react";

const adminLinks = [
  // Operations & Services
  { icon: Plane, label: "Airfreight Shipments", href: "/admin/airfreight" },
  { icon: Ship, label: "Ocean Freight Shipments", href: "/admin/ocean-freight" },
  { icon: Truck, label: "Ground Freight", href: "/admin/ground-freight" },
  { icon: Stamp, label: "Customs Clearance", href: "/admin/customs-clearance" },

  // Partners & Vendors
  { icon: Plane, label: "Airlines", href: "/admin/airlines" },
  { icon: Building2, label: "Airports", href: "/admin/airports" },
  { icon: Ship, label: "Ocean Carriers", href: "/admin/ocean-carriers" },
  { icon: Container, label: "Ports", href: "/admin/ports" },
  { icon: Container, label: "Port Terminals", href: "/admin/port-terminals" },
  { icon: Scale, label: "Customs Brokers", href: "/admin/customs-brokers" },
  { icon: Truck, label: "Truckers", href: "/admin/truckers" },
  { icon: Warehouse, label: "Warehouses", href: "/admin/warehouses" },

  // Business Management
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Globe, label: "International Agents", href: "/admin/international-agents" },
  { icon: Globe2, label: "Countries", href: "/admin/countries" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: DollarSign, label: "Finance", href: "/admin/finance" },
  { icon: Briefcase, label: "Personnel", href: "/admin/personnel" },
];

const sections = [
  {
    title: "Operations & Services",
    links: adminLinks.slice(0, 4)
  },
  {
    title: "Partners & Vendors",
    links: adminLinks.slice(4, 12)
  },
  {
    title: "Business Management",
    links: adminLinks.slice(12)
  }
];

export function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      {sections.map((section, index) => (
        <div key={section.title} className={`${index > 0 ? 'mt-8' : ''}`}>
          <h2 className="text-lg font-semibold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}