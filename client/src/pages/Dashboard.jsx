import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import { devices } from '@/lib/deviceData';
import { rooms } from '@/lib/constants';

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState('bedroom');
  const [activeDevices, setActiveDevices] = useState(
    devices.reduce((acc, device) => {
      acc[device.id] = device.defaultActive;
      return acc;
    }, {})
  );

  const filteredDevices = devices.filter(device => device.room === activeRoom);

  const toggleDevice = (deviceId) => {
    setActiveDevices(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
  };

  const handleRoomChange = (roomId) => {
    setActiveRoom(roomId);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Sidebar 
        activeRoom={activeRoom} 
        onRoomChange={handleRoomChange}
        rooms={rooms}
      />
      <MainContent 
        activeRoom={activeRoom}
        devices={filteredDevices}
        activeDevices={activeDevices}
        toggleDevice={toggleDevice}
        roomData={rooms.find(room => room.id === activeRoom)}
      />
    </div>
  );
};

export default Dashboard;
