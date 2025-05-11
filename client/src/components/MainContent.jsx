import { useState } from 'react';
import { PlusCircle, RefreshCw, Bell, Search } from 'lucide-react';
import RoomOverview from './RoomOverview';
import DeviceCard from './DeviceCard';
import EnergyMonitoring from './EnergyMonitoring';
import { motion } from 'framer-motion';

const MainContent = ({ activeRoom, devices, activeDevices, toggleDevice, roomData }) => {
  const [deviceCategory, setDeviceCategory] = useState('all');
  const [energyTimeframe, setEnergyTimeframe] = useState('week');

  // Filter devices by category if selected
  const filteredDevices = deviceCategory === 'all' 
    ? devices 
    : devices.filter(device => device.category === deviceCategory);

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-display font-bold capitalize"
            >
              {roomData?.name} Dashboard
            </motion.h1>
            <p className="text-sm text-foreground/60">Control and monitor your {roomData?.name.toLowerCase()} devices</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass neumorphic px-4 py-2 rounded-xl flex items-center text-sm hover:bg-white/10 transition"
            >
              <PlusCircle className="mr-2" size={18} />
              Add Device
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass neumorphic w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
            >
              <Bell size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass neumorphic w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition"
            >
              <Search size={18} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Room Overview Section */}
      <section className="mb-8">
        <RoomOverview roomData={roomData} />
      </section>

      {/* Devices Grid */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-semibold">Connected Devices</h2>
          <div className="flex space-x-2">
            <button className="glass px-3 py-1 rounded-lg text-xs flex items-center">
              <RefreshCw className="mr-1" size={14} />
              Refresh
            </button>
            <select 
              className="glass px-3 py-1 rounded-lg text-xs bg-transparent"
              value={deviceCategory}
              onChange={(e) => setDeviceCategory(e.target.value)}
            >
              <option value="all">All Devices</option>
              <option value="lighting">Lighting</option>
              <option value="climate">Climate</option>
              <option value="entertainment">Entertainment</option>
              <option value="security">Security</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              isActive={activeDevices[device.id]}
              onToggle={() => toggleDevice(device.id)}
            />
          ))}
        </div>
      </section>

      {/* Energy Monitoring Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-semibold">Energy Monitoring</h2>
          <div className="flex space-x-2">
            <button 
              className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${energyTimeframe === 'day' ? 'bg-white/10' : ''}`}
              onClick={() => setEnergyTimeframe('day')}
            >
              Day
            </button>
            <button 
              className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${energyTimeframe === 'week' ? 'bg-white/10' : ''}`}
              onClick={() => setEnergyTimeframe('week')}
            >
              Week
            </button>
            <button 
              className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${energyTimeframe === 'month' ? 'bg-white/10' : ''}`}
              onClick={() => setEnergyTimeframe('month')}
            >
              Month
            </button>
          </div>
        </div>

        <EnergyMonitoring timeframe={energyTimeframe} roomId={activeRoom} />
      </section>
    </main>
  );
};

export default MainContent;
