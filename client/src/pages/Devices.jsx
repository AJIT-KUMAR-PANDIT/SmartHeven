import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Plus } from 'lucide-react';
import { devices } from '@/lib/deviceData.js';
import DeviceCard from '@/components/DeviceCard';

const Devices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeDevices, setActiveDevices] = useState(
    devices.reduce((acc, device) => {
      acc[device.id] = device.defaultActive;
      return acc;
    }, {})
  );
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleDevice = (deviceId) => {
    setActiveDevices(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
  };
  
  // Filter devices based on search and category
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || device.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="p-4 md:p-6">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-display font-bold"
              >
                All Devices
              </motion.h1>
              <p className="text-sm text-foreground/60">Manage all your connected devices</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* Search and Filter Bar */}
        <div className="glass rounded-xl p-3 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-2.5 text-foreground/60" />
            <input
              type="text"
              placeholder="Search devices..."
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="h-10 pl-3 pr-8 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 appearance-none"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="lighting">Lighting</option>
                <option value="climate">Climate</option>
                <option value="entertainment">Entertainment</option>
                <option value="security">Security</option>
                <option value="appliance">Appliances</option>
              </select>
              <Filter size={16} className="absolute right-3 top-2.5 text-foreground/60" />
            </div>
          </div>
        </div>
        
        {/* Devices Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isActive={activeDevices[device.id]}
                onToggle={() => toggleDevice(device.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-foreground/60">No devices found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Devices;