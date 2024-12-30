import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const { toast } = useToast();

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    
    if (!hasConsented) {
      toast({
        title: "Cookie Notice",
        description: "We use cookies to enhance your browsing experience and analyze site traffic.",
        duration: 0, // Toast will not auto-dismiss
        action: (
          <Button
            variant="default"
            onClick={() => {
              localStorage.setItem("cookieConsent", "true");
              // Close the toast by not providing a new one
              toast({
                duration: 0,
              });
            }}
          >
            Accept
          </Button>
        ),
      });
    }
  }, [toast]);

  return null;
}
