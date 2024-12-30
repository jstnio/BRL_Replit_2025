import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hasConsented = localStorage.getItem("cookieConsent");

    if (!hasConsented) {
      const { dismiss } = toast({
        title: "Cookie Notice",
        description: "We use cookies to enhance your browsing experience and analyze site traffic.",
        duration: Infinity,
        action: (
          <Button
            variant="default"
            onClick={() => {
              localStorage.setItem("cookieConsent", "true");
              dismiss();
            }}
          >
            Accept
          </Button>
        ),
      });
    }
  }, [mounted, toast]);

  return null;
}