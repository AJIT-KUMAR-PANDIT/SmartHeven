import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Smartphone, 
  Lightbulb, 
  Thermometer,
  Speaker, 
  Camera, 
  Power, 
  Wifi, 
  Battery,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react';
import DeviceModal from '@/components/modals/DeviceModal';
import jsonDB from '@/lib/database';

// Device type to icon mapping
const deviceIcons = {
  'lighting': Lightbulb,
  'climate': Thermometer,
  'audio': Speaker,
  'security': Camera,
  'other': Smartphone
};

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('all');
  const [rooms, setRooms] = useState([]);
  
  // Load devices and rooms from database
  useEffect(() => {
    const loadData = async () => {
      try {
        await jsonDB.init();
        const devicesData = await jsonDB.getAllItems('devices');
        const roomsData = await jsonDB.getAllItems('rooms');
        
        setDevices(devicesData || []);
        setRooms(roomsData || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Filter devices by room
  const filteredDevices = selectedRoomFilter === 'all' 
    ? devices 
    : devices.filter(device => device.room === selectedRoomFilter);
  
  // Open modal for editing a device
  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };
  
  // Open modal for creating a new device
  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };
  
  // Toggle device on/off
  const handleToggleDevice = async (deviceId) => {
    try {
      await jsonDB.init();
      const updatedDevice = await jsonDB.toggleDevice(deviceId);
      
      if (updatedDevice) {
        setDevices(devices.map(device => 
          device.id === deviceId ? updatedDevice : device
        ));
        
        // Show success toast
        toast({
          title: "Device Updated",
          description: `Device ${updatedDevice.name} has been ${updatedDevice.status === 'on' ? 'turned on' : 'turned off'}.`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Failed to toggle device:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to update device. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  // Delete a device
  const handleDeleteDevice = async (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      try {
        await jsonDB.init();
        await jsonDB.removeItem('devices', deviceId);
        setDevices(devices.filter(device => device.id !== deviceId));
      } catch (error) {
        console.error('Failed to delete device:', error);
      }
    }
  };
  
  // Handle modal close and refresh devices
  const handleModalClose = async () => {
    setIsModalOpen(false);
    
    // Refresh devices list
    try {
      await jsonDB.init();
      const devicesData = await jsonDB.getAllItems('devices');
      setDevices(devicesData || []);
    } catch (error) {
      console.error('Failed to refresh devices:', error);
    }
  };
  
  // Get room name by id
  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };
  
  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient"
          >
            Devices
          </motion.h1>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary rounded-lg text-white flex items-center shadow-lg"
            onClick={handleAddDevice}
          >
            <Plus size={18} className="mr-2" />
            Add Device
          </motion.button>
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-foreground/60 mt-1"
        >
          Manage and control your connected smart devices
        </motion.p>
      </header>
      
      {/* Room Filters */}
      <div className="mb-6 overflow-x-auto pb-2">
        <div className="flex space-x-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            className={`px-4 py-2 rounded-lg text-sm flex items-center whitespace-nowrap ${
              selectedRoomFilter === 'all' 
                ? 'bg-primary/20 border border-primary/30 text-primary' 
                : 'glass border border-white/10 hover:bg-white/5'
            }`}
            onClick={() => setSelectedRoomFilter('all')}
          >
            All Devices
          </motion.button>
          
          {rooms.map(room => (
            <motion.button
              key={room.id}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-lg text-sm flex items-center whitespace-nowrap ${
                selectedRoomFilter === room.id 
                  ? 'bg-primary/20 border border-primary/30 text-primary' 
                  : 'glass border border-white/10 hover:bg-white/5'
              }`}
              onClick={() => setSelectedRoomFilter(room.id)}
            >
              {room.name}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Devices Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          // Loading skeletons
          [...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="glass rounded-xl p-4 h-44 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-white/10 mb-3"></div>
              <div className="w-2/3 h-4 rounded-md bg-white/10 mb-2"></div>
              <div className="w-1/2 h-3 rounded-md bg-white/5 mb-6"></div>
              <div className="w-full h-12 rounded-lg bg-white/5"></div>
            </motion.div>
          ))
        ) : filteredDevices.length === 0 ? (
          // Empty state
          <motion.div 
            className="col-span-full flex flex-col items-center justify-center glass rounded-xl p-10 border border-dashed border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Smartphone size={40} className="text-primary/40 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {selectedRoomFilter === 'all' ? 'No devices found' : 'No devices in this room'}
            </h3>
            <p className="text-sm text-foreground/60 text-center mb-6 max-w-md">
              {selectedRoomFilter === 'all' 
                ? 'Add your first smart device to get started with your smart home.'
                : `This room doesn't have any devices yet. Add a device to this room.`
              }
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-primary rounded-lg text-white flex items-center"
              onClick={handleAddDevice}
            >
              <Plus size={18} className="mr-2" />
              Add Device
            </motion.button>
          </motion.div>
        ) : (
          // Device cards
          filteredDevices.map((device, index) => {
            const DeviceIcon = deviceIcons[device.type] || Smartphone;
            return (
              <motion.div
                key={device.id}
                className="glass rounded-xl p-4 border border-white/5 hover:border-primary/20 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                layoutId={`device-${device.id}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg ${device.status === 'on' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-foreground/60'} flex items-center justify-center`}>
                      <DeviceIcon size={20} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{device.name}</h3>
                      <p className="text-xs text-foreground/60">
                        {getRoomName(device.room)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <button className="p-2 rounded-lg hover:bg-white/10">
                      <MoreVertical size={16} />
                    </button>
                    
                    {/* Dropdown menu */}
                    <div className="absolute right-0 top-full mt-1 w-36 glass rounded-lg border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                      <button 
                        className="w-full flex items-center px-3 py-2 hover:bg-white/10 rounded-t-lg"
                        onClick={() => handleEditDevice(device)}
                      >
                        <Edit size={14} className="mr-2 opacity-70" />
                        <span className="text-sm">Edit</span>
                      </button>
                      <button 
                        className="w-full flex items-center px-3 py-2 hover:bg-white/10 text-rose-400 rounded-b-lg"
                        onClick={() => handleDeleteDevice(device.id)}
                      >
                        <Trash2 size={14} className="mr-2 opacity-70" />
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Device status indicators */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center text-xs">
                    <Wifi size={12} className={`mr-1 ${device.connected ? 'text-green-500' : 'text-rose-400'}`} />
                    <span className="opacity-60">{device.connected ? 'Online' : 'Offline'}</span>
                  </div>
                  
                  {device.battery !== undefined && (
                    <div className="flex items-center text-xs">
                      <Battery size={12} className="mr-1" />
                      <span className="opacity-60">{device.battery}%</span>
                    </div>
                  )}
                </div>
                
                {/* Toggle button */}
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full mt-2 px-4 py-3 rounded-xl flex items-center justify-center ${
                    device.status === 'on'
                      ? 'bg-primary text-white'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleToggleDevice(device.id)}
                >
                  <Power size={16} className="mr-2" />
                  <span className="text-sm font-medium">{device.status === 'on' ? 'Turn Off' : 'Turn On'}</span>
                </motion.button>
              </motion.div>
            );
          })
        )}
      </div>
      
      {/* Device Modal */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        editDevice={editingDevice}
      />
    </div>
  );
};

export default Devices;