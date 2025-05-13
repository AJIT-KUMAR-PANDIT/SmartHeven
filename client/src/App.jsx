import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Router from "./Router";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useState, useEffect } from "react";
import * as jsonDB from "@/lib/database";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  // Initialize database and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        await initDatabase();
        const loadedRooms = await getAllItems("rooms");
        const loadedDevices = await getAllItems("devices");
        setRooms(loadedRooms);
        setDevices(loadedDevices);
        if (loadedRooms.length > 0) {
          setActiveRoom(loadedRooms[0].id);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <script
              authed="location.reload()"
              src="https://auth.util.repl.co/script.js"
            ></script>
            <TopNav />
            <div className="flex h-[calc(100vh-4rem)]">
              <Sidebar
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
                rooms={rooms}
                activeRoom={activeRoom}
                onRoomChange={setActiveRoom}
              />
              <main className="md:mt-14 lg:mt-14 flex-1 overflow-y-auto p-4 pt-16 md:pt-4 md:ml-72">
                <Router />
              </main>
            </div>
            <MobileNav onMenuClick={() => setIsMobileMenuOpen(true)} />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
