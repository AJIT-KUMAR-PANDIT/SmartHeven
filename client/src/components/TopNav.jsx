import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Bell, Search } from "lucide-react";

const TopNav = ({ isSearchOpen, setIsSearchOpen }) => {
  const [location] = useLocation();

  // Get the current page title based on the location
  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/devices":
        return "Devices";
      case "/scenes":
        return "Scenes";
      case "/automations":
        return "Automations";
      case "/analytics":
        return "Analytics";
      case "/settings":
        return "Settings";
      default:
        return "SmartHaven";
    }
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 md:left-[18rem] lg:left-[20rem] flex items-center justify-between px-4 h-16 bg-black/60 backdrop-blur-lg z-20 border-b border-white/10"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-3 h-3 rounded-full border-2 border-white"
          ></motion.div>
        </div>
        <h1 className="font-display text-lg font-bold lg:text-xl">
          Smart<span className="text-primary">Haven</span>
        </h1>
      </div>

      {/* Center - Page Title (only visible on mobile) */}
      <h2 className="absolute left-1/2 transform -translate-x-1/2 font-medium text-sm md:hidden">
        {getPageTitle()}
      </h2>

      {/* Right Actions */}
      <div className="flex items-center space-x-1">
        <motion.button
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-full flex items-center justify-center glass"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search size={18} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-full flex items-center justify-center glass relative"
        >
          <Bell size={18} />
          <span className="absolute top-1 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default TopNav;
