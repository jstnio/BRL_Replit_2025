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
} from "lucide-react";

const adminLinks = [
  { icon: Plane, label: "Airlines", href: "/admin/airlines" },
  { icon: Building2, label: "Airports", href: "/admin/airports" },
  { icon: Ship, label: "Ocean Carriers", href: "/admin/ocean-carriers" },
  { icon: FileText, label: "Documents", href: "/admin/documents" },
  { icon: Container, label: "Ports", href: "/admin/ports" },
  { icon: Globe2, label: "Countries", href: "/admin/countries" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Scale, label: "Customs Brokers", href: "/admin/customs-brokers" },
  { icon: Globe, label: "International Agents", href: "/admin/international-agents" },
  { icon: Truck, label: "Truckers", href: "/admin/truckers" },
  { icon: Container, label: "Port Terminals", href: "/admin/port-terminals" },
  { icon: Warehouse, label: "Warehouses", href: "/admin/warehouses" },
];

export function AdminDashboard() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link) => {
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
    </DashboardLayout>
  );
}