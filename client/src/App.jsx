import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import Router from "./Router";
import TopNav from "@/components/TopNav";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { RoomDB, DeviceDB } from "@/database_lowdb/db";
import SplashWelcome from "./components/SplashWelcome";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  // Initialize database and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize databases
        RoomDB.init();
        DeviceDB.init();

        const loadedRooms = await RoomDB.getAllItems("rooms");
        const loadedDevices = await DeviceDB.getAllItems("devices");
        setRooms(loadedRooms);
        setDevices(loadedDevices);
        if (Object.values(loadedRooms).length > 0) {
          setActiveRoom(Object.values(loadedRooms)[0].id);
        }

        // Subscribe to database changes
        const unsubscribeRooms = RoomDB.subscribe((updatedRooms) => {
          setRooms(updatedRooms);
        });

        const unsubscribeDevices = DeviceDB.subscribe((updatedDevices) => {
          setDevices(updatedDevices);
        });

        // Cleanup subscriptions
        return () => {
          unsubscribeRooms();
          unsubscribeDevices();
        };
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
        <SplashWelcome />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
