// Dashboard.jsx
import { useState, useEffect } from "react";
import MainContent from "@/components/MainContent";
import { getAllItems, save } from "@/db/database";

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from database
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get rooms
        const roomsData = await getAllItems("rooms");
        if (roomsData?.length > 0) {
          setRooms(roomsData);
          if (!activeRoom) {
            setActiveRoom(roomsData[0].id);
          }
        }

        // Get devices
        const devicesData = await getAllItems("devices");
        setDevices(devicesData || []);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeRoom]);

  // Get devices for active room
  const filteredDevices = devices.filter(
    (device) => device.room === activeRoom
  );

  // Get active room data
  const activeRoomData = rooms.find((room) => room.id === activeRoom);

  // Toggle device state
  const toggleDevice = async (deviceId) => {
    try {
      const device = devices.find((d) => d.id === deviceId);
      if (!device) return;

      const updatedDevice = {
        ...device,
        status: device.status === "on" ? "off" : "on",
      };

      // Update UI
      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? updatedDevice : d))
      );

      // ✅ Use database abstraction
      await save("devices", deviceId, updatedDevice);
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
        onRoomChange={handleRoomChange}
      />
    </div>
  );
};

export default Dashboard;
