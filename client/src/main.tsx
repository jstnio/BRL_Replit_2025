import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import App from './App';
import "./lib/i18n";  // Import i18n configuration
import "./index.css";

// Initialize React Query client
queryClient.prefetchQuery({
  queryKey: ['user'],
  queryFn: async () => {
    const res = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    if (!res.ok) {
      if (res.status === 401) return null;
      throw new Error(`${res.status}: ${await res.text()}`);
    }
    return res.json();
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);