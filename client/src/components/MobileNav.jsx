import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Home, 
  Smartphone, 
  Zap, 
  Clock, 
  LineChart, 
  Mic,
  Settings
} from 'lucide-react';

const MobileNav = () => {
  const [location] = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Smartphone, label: 'Devices', path: '/devices' },
    { icon: null, label: '', path: '' }, // Placeholder for mic button
    { icon: Zap, label: 'Scenes', path: '/scenes' },
    { icon: LineChart, label: 'Analytics', path: '/analytics' }
  ];
  
  const [isMicActive, setIsMicActive] = useState(false);
  
  const handleMicClick = () => {
    setIsMicActive(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsMicActive(false);
    }, 3000);
  };
  
  return (
    <>
      {/* Voice Recognition Animation Overlay */}
      {isMicActive && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {/* Sound wave animation */}
            <div className="flex items-center justify-center h-32 gap-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  initial={{ height: 10 }}
                  animate={{ 
                    height: [10, 40 * Math.random() + 10, 10],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            <p className="text-center text-white mt-6 font-medium text-lg">Listening...</p>
            <p className="text-center text-white/60 mt-2">Say a command</p>
          </motion.div>
        </motion.div>
      )}
      
      {/* Floating Mic Button for Desktop */}
      <motion.button
        className="fixed z-40 bottom-8 right-8 hidden md:flex w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary items-center justify-center shadow-xl"
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1, boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.4)" }}
        onClick={handleMicClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="relative">
          <Mic className="text-white" size={28} />
          
          {/* Animated ripple effect */}
          <motion.div
            className="absolute -inset-3 rounded-full border-2 border-white/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.button>
      
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/70 backdrop-blur-lg border-t border-white/10 flex justify-around items-center h-20 z-40 px-4 md:hidden">
        {navItems.map((item, index) => {
          // Center position is for the mic button
          if (index === 2) {
            return (
              <motion.button
                key="mic-button"
                className="relative w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg -mt-8"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.3)" }}
                onClick={handleMicClick}
              >
                <div className="relative">
                  <Mic className="text-white" size={24} />
                  
                  {/* Animated ripple effect */}
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-white/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.button>
            );
          }
          
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <motion.div 
                className="flex flex-col items-center"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className={`p-2 rounded-full ${isActive ? 'bg-white/10' : ''}`}
                  initial={false}
                  animate={isActive ? { 
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    scale: 1.1
                  } : { 
                    backgroundColor: "rgba(255, 255, 255, 0)",
                    scale: 1
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <item.icon 
                    size={24} 
                    className={isActive ? 'text-primary' : 'text-white/70'} 
                  />
                </motion.div>
                <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-white/70'}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
        
        {/* Added Settings to mobile nav */}
        <Link href="/settings">
          <motion.div 
            className="flex flex-col items-center"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className={`p-2 rounded-full ${location === '/settings' ? 'bg-white/10' : ''}`}
              initial={false}
              animate={location === '/settings' ? { 
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                scale: 1.1
              } : { 
                backgroundColor: "rgba(255, 255, 255, 0)",
                scale: 1
              }}
              transition={{ duration: 0.2 }}
            >
              <Settings 
                size={24} 
                className={location === '/settings' ? 'text-primary' : 'text-white/70'} 
              />
            </motion.div>
            <span className={`text-xs mt-1 ${location === '/settings' ? 'text-white' : 'text-white/70'}`}>
              Settings
            </span>
          </motion.div>
        </Link>
      </nav>
    </>
  );
};

export default MobileNav;