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
import SearchModal from "@/components/SearchModal";
import AuthPage from "@/pages/AuthPage";

// Capacitor Preferences
import { Preferences } from "@capacitor/preferences";

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // controlled by session check
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // 🔍 Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { value } = await Preferences.get({ key: "isLoggedIn" });
      const isLoggedIn = value === "true";
      setIsAuthenticated(isLoggedIn);
      setShowAuthModal(!isLoggedIn);
    };
    checkSession();
  }, []);

  // 🚶 Activity tracker + Auto logout (15 minutes)
  useEffect(() => {
    const resetTimer = () => {
      setLastActivity(Date.now());
      if (sessionTimeout) clearTimeout(sessionTimeout);
      setSessionTimeout(
        setTimeout(() => {
          setShowAuthModal(true);
          setIsAuthenticated(false);
          Preferences.remove({ key: "isLoggedIn" });
        }, 900000)
      ); // 15 minutes
    };

    const activityListener = () => resetTimer();
    window.addEventListener("mousemove", activityListener);
    window.addEventListener("keydown", activityListener);
    window.addEventListener("touchstart", activityListener);
    window.addEventListener("scroll", activityListener);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", activityListener);
      window.removeEventListener("keydown", activityListener);
      window.removeEventListener("touchstart", activityListener);
      window.removeEventListener("scroll", activityListener);
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [sessionTimeout]);

  // 📦 Initialize database and load data
  useEffect(() => {
    const loadData = async () => {
      try {
        RoomDB.init();
        DeviceDB.init();

        const loadedRooms = await RoomDB.getAllItems("rooms");
        const loadedDevices = await DeviceDB.getAllItems("devices");

        setRooms(loadedRooms);
        setDevices(loadedDevices);

        if (Object.values(loadedRooms).length > 0) {
          setActiveRoom(Object.values(loadedRooms)[0].id);
        }

        const unsubscribeRooms = RoomDB.subscribe((updatedRooms) =>
          setRooms(updatedRooms)
        );
        const unsubscribeDevices = DeviceDB.subscribe((updatedDevices) =>
          setDevices(updatedDevices)
        );

        return () => {
          unsubscribeRooms();
          unsubscribeDevices();
        };
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="smarthaven-theme">
        {/* Show Auth Modal Only If Not Authenticated */}
        {showAuthModal && (
          <div className="fixed inset-0 z-[999] overflow-y-scroll bg-background/80 backdrop-blur-sm">
            <AuthPage
              onSuccess={async () => {
                const { value } = await Preferences.get({ key: "isLoggedIn" });
                const loggedIn = value === "true";
                setIsAuthenticated(loggedIn);
                setShowAuthModal(!loggedIn);
              }}
            />
          </div>
        )}

        {isAuthenticated && <SplashWelcome />}

        <div className="min-h-screen bg-background">
          {/* Optional Auth Script */}
          <script
            authed="location.reload()"
            src="https://auth.util.repl.co/script.js "
          ></script>

          {/* Header & UI */}
          <TopNav
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />

          <div className="flex h-[calc(100vh-4rem)]">
            <Sidebar
              isMobileOpen={isMobileMenuOpen}
              setIsMobileOpen={setIsMobileMenuOpen}
              rooms={rooms}
              activeRoom={activeRoom}
              onRoomChange={setActiveRoom}
              onLogout={() => {
                setIsAuthenticated(false);
                setShowAuthModal(true);
              }}
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
