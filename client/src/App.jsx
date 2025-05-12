import { ThemeProvider } from "@/components/ui/theme-provider.jsx";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileNav from "@/components/MobileNav";
import NotFound from "@/pages/not-found.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import Devices from "@/pages/Devices.jsx";
import Scenes from "@/pages/Scenes.jsx";
import Automations from "@/pages/Automations.jsx";
import Analytics from "@/pages/Analytics.jsx";
import Settings from "@/pages/Settings.jsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/devices" component={Devices} />
      <Route path="/scenes" component={Scenes} />
      <Route path="/automations" component={Automations} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
        <TooltipProvider>
          <Toaster />
          <div className="bg-background min-h-screen">
            <Router />
            <MobileNav />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;