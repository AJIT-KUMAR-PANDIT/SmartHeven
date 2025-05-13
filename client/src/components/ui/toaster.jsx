import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

export const Toaster = () => (
  <ShadcnToaster
    position="bottom-right"
    toastOptions={{
      className: "glass border border-white/10 backdrop-blur-lg",
      duration: 3000,
    }}
  />
);
