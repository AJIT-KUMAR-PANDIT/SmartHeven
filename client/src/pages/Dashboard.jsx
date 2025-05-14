import { useState, useEffect } from "react";
import MainContent from "@/components/MainContent";
import * as jsonDB from "@/lib/database";

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [roomIcons, setRoomIcons] = useState({}); // <-- State for storing icon mappings
  const [isLoading, setIsLoading] = useState(true);

  // Load data from the database and room icons
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get rooms
        const roomsData = await jsonDB.getAllItems("rooms");
        if (roomsData.length > 0) {
          setRooms(roomsData);
          if (!activeRoom) {
            setActiveRoom(roomsData[0].id);
          }
        }

        // Get devices
        const devicesData = await jsonDB.getAllItems("devices");
        setDevices(devicesData);

        // Fetch room icons
        const res = await fetch("@/assets/room/index.json");
        if (!res.ok) throw new Error("Failed to load room icons");

        const icons = await res.json();
        setRoomIcons(icons); // Save the room icon mapping

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get devices for the active room
  const filteredDevices = devices.filter(
    (device) => device.room === activeRoom
  );

  // Get active room data
  const activeRoomData = rooms.find((room) => room.id === activeRoom);

  // Toggle device state
  const toggleDevice = async (deviceId) => {
    try {
      const device = await jsonDB.getItem("devices", deviceId);
      if (!device) return;

      const newStatus = device.status === "on" ? "off" : "on";
      await jsonDB.updateDeviceStatus(deviceId, { status: newStatus });

      setDevices((prev) =>
        prev.map((d) => (d.id === deviceId ? { ...d, status: newStatus } : d))
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
        roomIcons={roomIcons} // Pass room icons to MainContent
      />
    </div>
  );
};

export default Dashboard;
