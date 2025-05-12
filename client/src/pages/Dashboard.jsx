import { useState, useEffect } from 'react';
import MainContent from '@/components/MainContent';
import jsonDB from '@/lib/database';

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState('');
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Get rooms
        const roomsData = await jsonDB.getAllItems('rooms');
        if (roomsData.length > 0) {
          setRooms(roomsData);
          // Set first room as active if no room is selected
          if (!activeRoom) {
            setActiveRoom(roomsData[0].id);
          }
        }
        
        // Get devices
        const devicesData = await jsonDB.getAllItems('devices');
        setDevices(devicesData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [activeRoom]);

  // Get devices for the active room
  const filteredDevices = devices.filter(device => device.room === activeRoom);
  
  // Get active room data
  const activeRoomData = rooms.find(room => room.id === activeRoom);

  // Toggle device state
  const toggleDevice = async (deviceId) => {
    try {
      // Get the device
      const device = await jsonDB.getItem('devices', deviceId);
      if (!device) return;
      
      // Toggle the status
      const newStatus = device.status === 'on' ? 'off' : 'on';
      
      // Update the device in the database
      await jsonDB.updateDeviceStatus(deviceId, { status: newStatus });
      
      // Update the UI
      setDevices(prev => 
        prev.map(d => 
          d.id === deviceId ? { ...d, status: newStatus } : d
        )
      );
    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };

  // Handle room change
  const handleRoomChange = (roomId) => {
    setActiveRoom(roomId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-primary animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto">
      <MainContent 
        activeRoom={activeRoom}
        devices={filteredDevices}
        toggleDevice={toggleDevice}
        roomData={activeRoomData}
      />
    </div>
  );
};

export default Dashboard;
