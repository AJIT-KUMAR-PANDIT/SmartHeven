import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Search,
  X,
  Home,
  Lightbulb,
  PlayCircle,
  Zap,
  Activity,
  Loader2,
} from "lucide-react";
import { RoomDB, DeviceDB, SceneDB, AutomationDB } from "@/database_lowdb/db";

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState({
    rooms: [],
    devices: [],
    scenes: [],
    automations: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          RoomDB.init(),
          DeviceDB.init(),
          SceneDB.init(),
          AutomationDB.init(),
        ]);

        const [rooms, devices, scenes, automations] = await Promise.all([
          RoomDB.getAllItems("rooms"),
          DeviceDB.getAllItems("devices"),
          SceneDB.getAllItems(),
          AutomationDB.getAllItems(),
        ]);

        setSearchResults({
          rooms: Object.values(rooms).map((room) => ({
            ...room,
            type: "room",
            icon: Home,
          })),
          devices: Object.values(devices).map((device) => ({
            ...device,
            type: "device",
            icon: Lightbulb,
          })),
          scenes: Object.values(scenes).map((scene) => ({
            ...scene,
            type: "scene",
            icon: PlayCircle,
          })),
          automations: Object.values(automations).map((automation) => ({
            ...automation,
            type: "automation",
            icon: Zap,
          })),
        });
      } catch (error) {
        console.error("Error loading search data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const categories = [
    { id: "all", name: "All", icon: Search },
    { id: "rooms", name: "Rooms", icon: Home },
    { id: "devices", name: "Devices", icon: Lightbulb },
    { id: "scenes", name: "Scenes", icon: PlayCircle },
    { id: "automations", name: "Automations", icon: Zap },
  ];

  const getFilteredResults = () => {
    const results = [];
    if (activeCategory === "all") {
      Object.entries(searchResults).forEach(([category, items]) => {
        results.push(
          ...items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      });
    } else {
      results.push(
        ...searchResults[activeCategory].filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    return results;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed  w-[95%] sm:w-full max-w-2xl bg-black/90 rounded-2xl p-3 sm:p-4 z-[500] border border-white/20 shadow-xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="relative mb-3 sm:mb-4 flex-shrink-0">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                size={20}
              />
              <input
                type="text"
                placeholder="Search everything..."
                className="w-full h-11 sm:h-12 pl-10 pr-4 bg-white/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                onClick={onClose}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>
            {/* Categories */}
            <div className="flex space-x-2 mb-3 sm:mb-4 overflow-x-auto pb-2 flex-shrink-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base whitespace-nowrap ${
                      activeCategory === category.id
                        ? "bg-primary text-white"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{category.name}</span>
                  </button>
                );
              })}
            </div>
            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {getFilteredResults().map((result) => {
                  const Icon = result.icon;
                  return (
                    <motion.button
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => {
                        const path = `/${result.type}s`;
                        setLocation(path);
                        onClose();
                      }}
                      className="w-full flex items-center space-x-3 p-2.5 sm:p-3 rounded-lg hover:bg-white/10 transition cursor-pointer group"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Icon size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">
                          {result.name}
                        </p>
                        <p className="text-xs sm:text-sm text-foreground/60 capitalize">
                          {result.type}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
