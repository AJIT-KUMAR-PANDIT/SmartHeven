import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import Router from "./Router";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { AppStoreProvider, useAppStore } from "@/db/store";
import { refreshSignals } from "@/db/refreshSignals";
import { initDatabase } from "@/db/initDatabase";

// ✅ Component to initialize data using the store
function AppInitializer() {
  const {
    setDevices,
    setRooms,
    setScenes,
    setAutomations,
    setHistory,
    setSettings,
  } = useAppStore();

  useEffect(() => {
    async function loadDataFromDB() {
      try {
        const db = await initDatabase();

        const sections = [
          ["devices", setDevices],
          ["rooms", setRooms],
          ["scenes", setScenes],
          ["automations", setAutomations],
          ["history", setHistory],
          ["settings", setSettings],
        ];

        for (const [key, setter] of sections) {
          // Optionally fetch from DB or signal update
          const data = await refreshSignals(db, key); // Make sure this uses the db
          if (data) setter(data);
        }
      } catch (err) {
        console.error("Error initializing data:", err);
      }
    }

    loadDataFromDB();
  }, []);

  return null;
}

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { rooms, activeRoom, setActiveRoom } = useAppStore(); // assuming you added these in store

  useEffect(() => {
    if (rooms.length > 0 && !activeRoom) {
      setActiveRoom(rooms[0].id);
    }
  }, [rooms, activeRoom, setActiveRoom]);

  return (
    <>
      <TopNav />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          rooms={rooms}
          activeRoom={activeRoom}
          onRoomChange={setActiveRoom}
        />
        <main className="flex-1 overflow-y-auto p-4 pt-16 md:pt-4 md:ml-72">
          <Router />
        </main>
      </div>
      <MobileNav onMenuClick={() => setIsMobileMenuOpen(true)} />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
          <TooltipProvider>
            {/* ✅ Context-aware initialization */}
            <AppInitializer />
            <div className="min-h-screen bg-background">
              <script
                authed="location.reload()"
                src="https://auth.util.repl.co/script.js "
              />
              <AppContent />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </AppStoreProvider>
  );
}
