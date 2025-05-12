import { useState, useEffect } from 'react';
import { PlusCircle, RefreshCw, Bell, Search, Sun, Zap } from 'lucide-react';
import RoomOverview from './RoomOverview';
import DeviceCard from './DeviceCard';
import EnergyMonitoring from './EnergyMonitoring';
import { motion, AnimatePresence } from 'framer-motion';

const MainContent = ({ activeRoom, devices, activeDevices, toggleDevice, roomData }) => {
  const [deviceCategory, setDeviceCategory] = useState('all');
  const [energyTimeframe, setEnergyTimeframe] = useState('week');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);

  // Filter devices by category if selected
  const filteredDevices = deviceCategory === 'all' 
    ? devices 
    : devices.filter(device => device.category === deviceCategory);
    
  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  // Simulate refresh animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Hide greeting after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGreeting(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background pb-28 md:pb-6">
      {/* Welcome Greeting Overlay - Appears briefly on load */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm"
          >
            <div className="glass p-8 rounded-2xl flex flex-col items-center">
              <motion.div 
                className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-5"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0px 0px 0px rgba(0,0,0,0)",
                    "0px 0px 30px rgba(33, 150, 243, 0.5)",
                    "0px 0px 0px rgba(0,0,0,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {getGreeting().includes('Morning') ? (
                  <Sun className="text-white" size={42} />
                ) : (
                  <Zap className="text-white" size={42} />
                )}
              </motion.div>
              <motion.h1 
                className="text-3xl font-display font-bold mb-2"
                animate={{ 
                  color: ["#fff", "#2196f3", "#fff"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {getGreeting()}
              </motion.h1>
              <p className="text-lg text-white/70">Welcome to your SmartHaven</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-display font-bold capitalize bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient"
            >
              {roomData?.name} Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm text-foreground/60"
            >
              Control and monitor your {roomData?.name.toLowerCase()} devices
            </motion.p>
          </div>
          <motion.div 
            className="flex items-center space-x-3 mt-4 md:mt-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="glass neumorphic px-4 py-2 rounded-xl flex items-center text-sm hover:bg-white/10 transition"
            >
              <PlusCircle className="mr-2" size={18} />
              Add Device
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="glass neumorphic w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
            >
              <Bell size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              className="glass neumorphic w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
            >
              <Search size={18} />
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Room Overview Section */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <RoomOverview roomData={roomData} />
      </motion.section>

      {/* Devices Grid */}
      <motion.section 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-xl font-display font-semibold"
            whileHover={{ scale: 1.02 }}
          >
            Connected Devices
          </motion.h2>
          <div className="flex space-x-2">
            <motion.button 
              className="glass px-3 py-1 rounded-lg text-xs flex items-center overflow-hidden"
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
            >
              <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                className="mr-1"
              >
                <RefreshCw size={14} />
              </motion.div>
              Refresh
            </motion.button>
            <motion.select 
              className="glass px-3 py-1 rounded-lg text-xs bg-transparent cursor-pointer"
              value={deviceCategory}
              onChange={(e) => setDeviceCategory(e.target.value)}
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <option value="all">All Devices</option>
              <option value="lighting">Lighting</option>
              <option value="climate">Climate</option>
              <option value="entertainment">Entertainment</option>
              <option value="security">Security</option>
            </motion.select>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredDevices.map((device, index) => (
            <motion.div 
              key={device.id} 
              variants={itemVariants}
              custom={index}
              layout
            >
              <DeviceCard
                device={device}
                isActive={activeDevices[device.id]}
                onToggle={() => toggleDevice(device.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* Energy Monitoring Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <motion.h2 
            className="text-xl font-display font-semibold"
            whileHover={{ scale: 1.02 }}
          >
            Energy Monitoring
          </motion.h2>
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map(period => (
              <motion.button 
                key={period}
                className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${energyTimeframe === period ? 'bg-white/10' : ''}`}
                onClick={() => setEnergyTimeframe(period)}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                whileTap={{ scale: 0.95 }}
                animate={energyTimeframe === period ? { 
                  boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 10px rgba(33, 150, 243, 0.3)", "0px 0px 0px rgba(0,0,0,0)"],
                } : {}}
                transition={{ duration: 2, repeat: energyTimeframe === period ? Infinity : 0 }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>

        <EnergyMonitoring timeframe={energyTimeframe} roomId={activeRoom} />
      </motion.section>
    </main>
  );
};

export default MainContent;
