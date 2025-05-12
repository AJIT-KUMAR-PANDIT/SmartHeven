import { useState, useEffect } from 'react';
import { useTheme } from '@/components/ui/theme-provider.jsx';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure this component only renders client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium">Theme Mode</h3>
        <span className="text-xs text-primary capitalize">{theme}</span>
      </div>
      <div className="flex space-x-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition flex items-center justify-center ${theme === 'light' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
          onClick={() => setTheme('light')}
        >
          <Sun size={16} className="mr-1" />
          Light
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition flex items-center justify-center ${theme === 'dark' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
          onClick={() => setTheme('dark')}
        >
          <Moon size={16} className="mr-1" />
          Dark
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium transition flex items-center justify-center ${theme === 'system' ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
          onClick={() => setTheme('system')}
        >
          <Monitor size={16} className="mr-1" />
          System
        </motion.button>
      </div>
    </div>
  );
};

export default ThemeToggle;