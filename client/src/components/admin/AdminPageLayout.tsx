import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface AdminPageLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminPageLayout({ children, title }: AdminPageLayoutProps) {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/admin")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <Button
          onClick={() => navigate("/dashboard/admin")}
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>
      {children}
    </div>
  );
}
