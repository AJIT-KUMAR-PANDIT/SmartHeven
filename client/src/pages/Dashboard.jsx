import { useState, useEffect } from "react";
import MainContent from "@/components/MainContent";
import * as signalDB from "@/lib/signalDatabase";

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Initialize database
        await signalDB.initDatabase();

        // Get rooms
        const roomsData = await signalDB.getAllItems("rooms");
        if (roomsData.length > 0) {
          setRooms(roomsData);
          // Set first room as active if no room is selected
          if (!activeRoom) {
            setActiveRoom(roomsData[0].id);
          }
        }

        // Get devices
        const devicesData = await signalDB.getAllItems("devices");
        setDevices(devicesData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeRoom]);

  // Get devices for the active room
  const filteredDevices = devices.filter(
    (device) => device.room === activeRoom
  );

  // Get active room data
  const activeRoomData = rooms.find((room) => room.id === activeRoom);

  // Toggle device state
  const toggleDevice = async (deviceId) => {
    try {
      // Use SignalDB's toggleDevice function
      const updatedDevice = await signalDB.toggleDevice(deviceId);
      if (!updatedDevice) return;

      // Update the UI
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? updatedDevice : d))
      );
    } catch (error) {
      console.error("Error toggling device:", error);
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
