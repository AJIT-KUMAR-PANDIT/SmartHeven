
import { Switch, Route } from "wouter";
import { lazyImport } from "./LazyLoader";

const Dashboard = lazyImport(() => import("./pages/Dashboard"));
const Devices = lazyImport(() => import("./pages/Devices"));
const Scenes = lazyImport(() => import("./pages/Scenes"));
const Automations = lazyImport(() => import("./pages/Automations"));
const Analytics = lazyImport(() => import("./pages/Analytics"));
const Settings = lazyImport(() => import("./pages/Settings"));
const NotFound = lazyImport(() => import("./pages/not-found"));

export default function Router() {
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
