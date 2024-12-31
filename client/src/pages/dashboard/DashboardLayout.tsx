import { ReactNode } from "react";
import { useUser } from "@/hooks/use-user";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useUser();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {t('dashboard.welcome', { username: user.username })}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.role', { role: user.role?.name })}
          </p>
        </div>
        {children}
      </Card>
    </div>
  );
}
