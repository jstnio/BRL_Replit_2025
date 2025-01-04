import { Link } from "wouter";
import { AdminPageLayout } from "@/components/admin/AdminPageLayout";
import { Button } from "@/components/ui/button";
import { Plane, ArrowDownToLine, ArrowUpFromLine, ArrowUpDown } from "lucide-react";

const shipmentTypes = [
  {
    icon: ArrowDownToLine,
    label: "Inbound Shipments",
    description: "Shipments coming to Brazil",
    href: "/admin/airfreight/inbound"
  },
  {
    icon: ArrowUpFromLine,
    label: "Outbound Shipments",
    description: "Export shipments from Brazil",
    href: "/admin/airfreight/outbound"
  },
  {
    icon: ArrowUpDown,
    label: "Domestic Shipments",
    description: "Airfreight shipments carried inside Brazil",
    href: "/admin/airfreight/domestic"
  }
];

export function AirfreightShipmentsPage() {
  return (
    <AdminPageLayout title="Airfreight Shipments Management">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipmentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Link key={type.href} href={type.href}>
              <Button
                variant="outline"
                className="w-full h-32 flex flex-col items-center justify-center gap-3 text-lg hover:bg-primary hover:text-primary-foreground transition-colors p-4"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-6 w-6" />
                  <Plane className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <div className="font-semibold">{type.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {type.description}
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </AdminPageLayout>
  );
}