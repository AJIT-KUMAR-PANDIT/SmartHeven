import { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MobileNav from "@/components/MobileNav";
import TopNav from "@/components/TopNav";
import Sidebar from "@/components/Sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import Scenes from "@/pages/Scenes";
import Automations from "@/pages/Automations";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import jsonDB from "@/lib/database";

// Import icons for room types
import { Sofa, UtensilsCrossed, Bed, Bath } from "lucide-react";

// Mock rooms data for sidebar
const mockRooms = [
  { id: 'living', name: 'Living Room', icon: Sofa },
  { id: 'kitchen', name: 'Kitchen', icon: UtensilsCrossed },
  { id: 'bedroom', name: 'Bedroom', icon: Bed },
  { id: 'bathroom', name: 'Bathroom', icon: Bath }
];

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState('living');
  const [rooms, setRooms] = useState(mockRooms);

  // Initialize database and load rooms
  useEffect(() => {
    const initApp = async () => {
      try {
        await jsonDB.init();
        
        // Try to load rooms from database
        const dbRooms = await jsonDB.getAllItems('rooms');
        if (dbRooms && dbRooms.length > 0) {
          setRooms(dbRooms);
          setActiveRoom(dbRooms[0].id);
        }
      } catch (error) {
        console.error("Failed to load rooms:", error);
      }
    };
    
    initApp();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
        <TooltipProvider>
          {/* Top Navigation */}
          <TopNav />
          
          <div className="flex pt-16"> {/* Add padding top for the TopNav */}
            {/* Sidebar */}
            <Sidebar 
              activeRoom={activeRoom}
              onRoomChange={setActiveRoom}
              rooms={rooms}
              isMobileOpen={isSidebarOpen}
              setIsMobileOpen={setIsSidebarOpen}
            />
            
            {/* Main Content */}
            <main className="flex-1">
              <Router />
            </main>
          </div>
          
          {/* Mobile Navigation */}
          <MobileNav onMenuClick={toggleSidebar} />
          
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
