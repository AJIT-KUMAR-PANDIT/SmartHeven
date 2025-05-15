import { Switch, Route } from "wouter";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Scenes from "./pages/Scenes";
import Automations from "./pages/Automations";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/not-found";
import RoomsPage from "./pages/rooms";
import AuthPage from "./pages/AuthPage";

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/devices" component={Devices} />
      <Route path="/scenes" component={Scenes} />
      <Route path="/automations" component={Automations} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/rooms" component={RoomsPage} />
      <Route path="/settings" component={Settings} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
