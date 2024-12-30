import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function CookieConsent() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait for component to mount to avoid hydration issues
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hasConsented = localStorage.getItem("cookieConsent");

    if (!hasConsented) {
      const { dismiss } = toast({
        title: (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Cookie Notice
          </div>
        ),
        description: (
          <div className="mt-1">
            We use cookies to enhance your browsing experience and analyze site traffic.
            By clicking "Accept", you consent to our use of cookies.
          </div>
        ),
        duration: Infinity,
        action: (
          <div className="flex gap-4 mt-2">
            <Button
              size="sm"
              onClick={() => {
                localStorage.setItem("cookieConsent", "true");
                dismiss();
              }}
            >
              Accept
            </Button>
          </div>
        ),
      });
    }
  }, [mounted, toast]);

  return null;
}