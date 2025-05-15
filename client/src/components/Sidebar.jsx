import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useState } from "react";
import { useTheme } from "@/components/ui/theme-provider.jsx";
import {
  Home,
  Smartphone,
  Zap,
  Clock,
  LineChart,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Plus,
} from "lucide-react";
import RoomModal from "@/components/modals/RoomModal";
import { Preferences } from "@capacitor/preferences";

const Sidebar = ({
  activeRoom,
  onRoomChange,
  rooms,
  isMobileOpen,
  setIsMobileOpen,
  onLogout, // 👈 This prop comes from App.jsx
}) => {
  const [location] = useLocation();
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/devices", icon: Smartphone, label: "Devices" },
    { path: "/scenes", icon: Zap, label: "Scenes" },
    { path: "/automations", icon: Clock, label: "Automations" },
    { path: "/analytics", icon: LineChart, label: "Analytics" },
    { path: "/rooms", icon: Home, label: "Rooms" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    if (setIsMobileOpen) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  // 🔐 Logout handler
  const handleLogout = async () => {
    try {
      // Clear session data
      await Preferences.remove({ key: "isLoggedIn" });
      await Preferences.remove({ key: "loggedInUser" });

      // Notify parent to update state
      if (onLogout) {
        onLogout();
      } else {
        window.location.reload(); // fallback
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md text-white md:hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`glass fixed top-0 left-0 w-full md:w-72 h-full z-30 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } flex flex-col overflow-hidden bg-background/95 backdrop-blur-lg border-r border-border/40`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-white/5">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <div className="ml-3">
              <h1 className="font-display text-xl font-bold">SmartHaven</h1>
              <p className="text-xs opacity-60">Intelligent Living</p>
            </div>
            <button
              className="ml-auto p-2 rounded-lg bg-black/30 text-white md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {/* Main Navigation */}
          <nav className="mb-6">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location === item.path;
                return (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <div
                        className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20"
                            : "hover:bg-white/5 transition"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 ${
                            isActive ? "text-primary" : "opacity-70"
                          }`}
                          size={20}
                        />
                        {item.label}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Room Navigation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider opacity-50 px-2">
                Rooms
              </h3>
              <button
                onClick={() => setIsRoomModalOpen(true)}
                className="text-xs text-primary hover:underline flex items-center"
              >
                <Plus size={12} className="mr-1" /> Add Room
              </button>
            </div>
            <div className="lg:mb-48 flex md:flex-col flex-row overflow-x-auto md:overflow-x-visible py-2 gap-2">
              {rooms?.map((room) => (
                <motion.button
                  key={room.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onRoomChange?.(room.id)}
                  className={`room-nav-item flex items-center hover:bg-white/10 transition rounded-xl px-3 py-2 min-w-[120px] md:min-w-0 ${
                    activeRoom === room.id ? "bg-dark-200" : "bg-white/5"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg glass flex items-center justify-center ${
                      activeRoom === room.id ? "bg-primary/20" : ""
                    }`}
                  >
                    <room.icon
                      className={`${
                        activeRoom === room.id ? "text-primary" : ""
                      }`}
                      size={18}
                    />
                  </div>
                  <span className="ml-2 text-sm">{room.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="lg:fixed bottom-16 w-[85%] glass rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Theme Mode</h3>
              <span className="text-xs text-primary capitalize">{theme}</span>
            </div>
            <div className="flex space-x-2">
              <motion.button
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center ${
                  theme === "light"
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-white/10"
                }`}
                onClick={() => setTheme("light")}
                whileTap={{ scale: 0.95 }}
              >
                <Sun size={14} className="mr-1" />
                Light
              </motion.button>
              <motion.button
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-white/10"
                }`}
                onClick={() => setTheme("dark")}
                whileTap={{ scale: 0.95 }}
              >
                <Moon size={14} className="mr-1" />
                Dark
              </motion.button>
              <motion.button
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center ${
                  theme === "system"
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-white/10"
                }`}
                onClick={() => setTheme("system")}
                whileTap={{ scale: 0.95 }}
              >
                <Monitor size={14} className="mr-1" />
                Auto
              </motion.button>
            </div>
          </div>

          {/* User Profile */}
          <div className="lg:fixed bottom-0 w-[85%] flex items-center mt-4 px-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
              JS
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">John Smith</h3>
              <p className="text-xs opacity-60">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
          <div className="mb-16"></div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Room Modal */}
      <RoomModal
        isOpen={isRoomModalOpen}
        onClose={() => setIsRoomModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
