import { useState, useEffect } from "react";
import MainContent from "@/components/MainContent";
import { storage } from "@/db/unstorage";

const Dashboard = () => {
  const [activeRoom, setActiveRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from unstorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Get rooms
        const roomsData = await storage.getItem("rooms");
        if (roomsData?.length > 0) {
          setRooms(roomsData);
          if (!activeRoom) {
            setActiveRoom(roomsData[0].id);
          }
        }

        // Get devices
        const devicesData = await storage.getItem("devices");
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
      const updatedDevices = devices.map((device) => {
        if (device.id === deviceId) {
          return {
            ...device,
            status: device.status === "on" ? "off" : "on",
          };
        }
        return device;
      });

      // Update UI
      setDevices(updatedDevices);

      // Save back to storage
      await storage.setItem("devices", updatedDevices);
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
        onRoomChange={handleRoomChange} // Optional prop
      />
    </div>
  );
};

export default Dashboard;
