import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Lightbulb,
  Thermometer,
  Speaker,
  Camera,
  Lock,
  Globe,
  Tv,
  Save,
  PlusCircle,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { DeviceDB } from "@/database_lowdb/db";
import { isProduction } from "@/utils/environment";

const deviceTypes = [
  { icon: Lightbulb, name: "Light", category: "lighting" },
  { icon: Thermometer, name: "Thermostat", category: "climate" },
  { icon: Speaker, name: "Speaker", category: "audio" },
  { icon: Camera, name: "Camera", category: "security" },
  { icon: Lock, name: "Smart Lock", category: "security" },
  { icon: Globe, name: "Sensor", category: "sensor" },
  { icon: Tv, name: "TV", category: "entertainment" },
  { icon: Smartphone, name: "Other", category: "other" },
];

const DeviceModal = ({ isOpen, onClose, editDevice = null }) => {
  const [deviceName, setDeviceName] = useState("");
  const [selectedType, setSelectedType] = useState(deviceTypes[0]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load rooms and populate form if editing
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          // Replace jsonDB.init() with DeviceDB.init()
          await DeviceDB.init();
          const roomsData = await DeviceDB.getAllItems("rooms");
          setRooms(roomsData || []);

          if (roomsData?.length > 0 && !selectedRoom) {
            setSelectedRoom(roomsData[0].id);
          }

          // If editing, populate form
          if (editDevice) {
            setDeviceName(editDevice.name);
            setSelectedType(
              deviceTypes.find((t) => t.category === editDevice.type) ||
                deviceTypes[0]
            );
            if (editDevice.room) {
              setSelectedRoom(editDevice.room);
            }
          } else {
            // Reset form for new device
            setDeviceName("");
            setSelectedType(deviceTypes[0]);
            if (roomsData?.length > 0) {
              setSelectedRoom(roomsData[0].id);
            }
          }
        } catch (error) {
          console.error("Failed to load data:", error);
        }
      };

      loadData();
    }
  }, [isOpen, editDevice]);

  const handleSubmit = async () => {
    if (!deviceName.trim() || !selectedRoom) return;

    try {
      setIsLoading(true);

      // Prepare device data
      const deviceData = {
        id: editDevice?.id || DeviceDB.generateId(),
        name: deviceName.trim(),
        type: selectedType.category,
        room: selectedRoom,
        status: "off",
        value: 0,
        battery: Math.floor(Math.random() * 100), // Random battery level
        lastUpdated: Date.now(),
        connected: true,
        firmware: "1.0.0",
        settings: {},
      };

      // Save to database
      await DeviceDB.init();
      await DeviceDB.save("devices", deviceData.id, deviceData);

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Error saving device:", error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDevice ? "Edit Device" : "Add New Device"}
      width="max-w-lg"
    >
      <div className="space-y-6">
        {/* Device Name */}
        <div>
          <label className="block text-sm mb-2">Device Name</label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder="Enter device name"
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Device Type */}
        <div>
          <label className="block text-sm mb-2">Device Type</label>
          <div className="grid grid-cols-4 gap-2">
            {deviceTypes.map((type, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedType(type)}
                className={`flex flex-col items-center p-3 rounded-lg ${
                  selectedType.name === type.name
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <type.icon
                  size={24}
                  className={`mb-2 ${
                    selectedType.name === type.name ? "text-primary" : ""
                  }`}
                />
                <span className="text-xs text-center">{type.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Room Selection */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm">Room</label>
            {rooms.length === 0 && (
              <span className="text-xs text-yellow-500">
                No rooms available
              </span>
            )}
          </div>

          {rooms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {rooms.map((room) => (
                <motion.button
                  key={room.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    selectedRoom === room.id
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-black/20 flex items-center justify-center mr-2">
                    <Home
                      size={14}
                      className={selectedRoom === room.id ? "text-primary" : ""}
                    />
                  </div>
                  <span className="text-sm">{room.name}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 rounded-lg border border-dashed border-white/20">
              <p className="text-sm opacity-60 mb-2">No rooms available</p>
              <button className="text-xs text-primary flex items-center">
                <PlusCircle size={12} className="mr-1" />
                Add a Room First
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="px-4 py-2 rounded-lg glass hover:bg-white/10"
          >
            Cancel
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={isLoading || !deviceName.trim() || !selectedRoom}
            className={`px-4 py-2 rounded-lg bg-primary text-white flex items-center ${
              isLoading || !deviceName.trim() || !selectedRoom
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            <Save size={16} className="mr-2" />
            {isLoading ? "Saving..." : "Save Device"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default DeviceModal;
