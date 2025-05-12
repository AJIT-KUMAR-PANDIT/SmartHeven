import { motion } from 'framer-motion';
import { useLocation, Link } from 'wouter';
import { useState } from 'react';
import { useTheme } from '@/components/ui/theme-provider.jsx';
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
  Monitor
} from 'lucide-react';

const Sidebar = ({ activeRoom, onRoomChange, rooms }) => {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/devices', icon: Smartphone, label: 'Devices' },
    { path: '/scenes', icon: Zap, label: 'Scenes' },
    { path: '/automations', icon: Clock, label: 'Automations' },
    { path: '/analytics', icon: LineChart, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-md text-white md:hidden"
        onClick={toggleMobileMenu}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`glass fixed inset-0 w-full md:w-72 lg:w-80 p-4 flex flex-col md:relative md:min-h-screen z-20 transition-transform duration-300 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex items-center mb-8 mt-2">
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
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="mb-8">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div 
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium cursor-pointer ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20' 
                          : 'hover:bg-white/5 transition'
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon 
                        className={`mr-3 ${isActive ? 'text-primary' : 'opacity-70'}`} 
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
        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider opacity-50 px-4 mb-2">Rooms</h3>
          <div className="flex md:flex-col flex-row overflow-x-auto md:overflow-x-visible py-2 space-x-3 md:space-x-0 md:space-y-3">
            {rooms.map(room => (
              <motion.button
                key={room.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onRoomChange(room.id);
                  setIsMobileOpen(false);
                }}
                className={`room-nav-item flex items-center hover:bg-white/10 transition rounded-xl px-3 py-2 min-w-[120px] md:min-w-0 ${activeRoom === room.id ? 'bg-dark-200' : 'bg-white/5'}`}
              >
                <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center ${activeRoom === room.id ? 'bg-primary/20' : ''}`}>
                  <room.icon className={`${activeRoom === room.id ? 'text-primary' : ''}`} size={18} />
                </div>
                <span className="ml-2 text-sm">{room.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          {/* Theme Toggle */}
          <div className="glass rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Theme Mode</h3>
              <span className="text-xs text-primary capitalize">{theme}</span>
            </div>
            <div className="flex space-x-2">
              <motion.button 
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center ${theme === 'light' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
                onClick={() => setTheme('light')}
                whileTap={{ scale: 0.95 }}
              >
                <Sun size={14} className="mr-1" />
                Light
              </motion.button>
              <motion.button 
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
                onClick={() => setTheme('dark')}
                whileTap={{ scale: 0.95 }}
              >
                <Moon size={14} className="mr-1" />
                Dark
              </motion.button>
              <motion.button 
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition flex items-center justify-center ${theme === 'system' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
                onClick={() => setTheme('system')}
                whileTap={{ scale: 0.95 }}
              >
                <Monitor size={14} className="mr-1" />
                Auto
              </motion.button>
            </div>
          </div>
          
          {/* Modes Control */}
          <div className="glass rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Home Mode</h3>
              <span className="text-xs text-success">Active</span>
            </div>
            <div className="flex space-x-2">
              <motion.button 
                className="flex-1 py-2 rounded-lg text-xs font-medium bg-dark-200 hover:bg-dark-100 transition"
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
              <motion.button 
                className="flex-1 py-2 rounded-lg text-xs font-medium hover:bg-dark-200 transition"
                whileTap={{ scale: 0.95 }}
              >
                Away
              </motion.button>
              <motion.button 
                className="flex-1 py-2 rounded-lg text-xs font-medium hover:bg-dark-200 transition"
                whileTap={{ scale: 0.95 }}
              >
                Night
              </motion.button>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center mt-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
              JS
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">John Smith</h3>
              <p className="text-xs opacity-60">Admin</p>
            </div>
            <button className="ml-auto w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
