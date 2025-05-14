import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Sofa,
  UtensilsCrossed,
  Bed,
  Bath,
  Tv,
  MonitorPlay,
  Footprints,
  Shuffle,
  Save,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { RoomDB } from "@/database_lowdb/db";

// Initialize database
RoomDB.init();

const roomTypes = [
  { name: "LivingRoom", type: "LivingRoom", component: Sofa },
  { name: "Kitchen", type: "Kitchen", component: UtensilsCrossed },
  { name: "Bedroom", type: "Bedroom", component: Bed },
  { name: "Bathroom", type: "Bathroom", component: Bath },
  { name: "MediaRoom", type: "MediaRoom", component: Tv },
  { name: "Office", type: "Office", component: MonitorPlay },
  { name: "Hallway", type: "Hallway", component: Footprints },
  { name: "Other", type: "Other", component: Home },
];

const RoomModal = ({ isOpen, onClose, editRoom = null }) => {
  const [roomName, setRoomName] = useState("");
  const [selectedType, setSelectedType] = useState(roomTypes[0]);
  const [floor, setFloor] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (isOpen) {
      if (editRoom) {
        setRoomName(editRoom.name);
        setSelectedType(
          roomTypes.find((t) => t.type === editRoom.type) || roomTypes[0]
        );
        setFloor(editRoom.floor || 1);
      } else {
        // Reset form for new room
        setRoomName("");
        setSelectedType(roomTypes[0]);
        setFloor(1);
      }
    }
  }, [isOpen, editRoom]);

  const handleSubmit = async () => {
    if (!roomName.trim()) return;

    try {
      setIsLoading(true);

      // Prepare room data
      const roomData = {
        id: editRoom?.id || RoomDB.generateId(),
        name: roomName.trim(),
        type: selectedType.type,
        icon: selectedType.type, // Store type identifier instead of name
        floor: parseInt(floor),
        devices: editRoom?.devices || [],
      };

      // Save to database
      await RoomDB.init();
      const newId = editRoom?.id || RoomDB.generateId();
      await RoomDB.save("rooms", newId, { ...roomData, id: newId });

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Error saving room:", error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editRoom ? "Edit Room" : "Add New Room"}
      width="max-w-lg"
    >
      <div className="space-y-6">
        {/* Room Name */}
        <div>
          <label className="block text-sm mb-2">Room Name</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
          />

          {/* Random name generator */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              const names = [
                "LivingRoom",
                "Kitchen",
                "MasterBedroom",
                "GuestRoom",
                "Bathroom",
                "Office",
                "GameRoom",
                "DiningRoom",
                "Hallway",
              ];
              const randomName =
                names[Math.floor(Math.random() * names.length)];
              setRoomName(randomName);
            }}
            className="mt-2 px-2 py-1 rounded text-xs flex items-center text-primary/70 hover:text-primary"
          >
            <Shuffle size={12} className="mr-1" />
            Generate random name
          </motion.button>
        </div>

        {/* Room Type */}
        <div>
          <label className="block text-sm mb-2">Room Type</label>
          <div className="grid grid-cols-4 gap-2">
            {roomTypes.map((type, index) => (
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
                <type.component
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

        {/* Floor */}
        <div>
          <label className="block text-sm mb-2">Floor</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-24 px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
            />
            <div className="flex space-x-1">
              {[1, 2, 3].map((f) => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFloor(f)}
                  className={`px-3 py-2 rounded-lg ${
                    parseInt(floor) === f
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </div>
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
            disabled={isLoading || !roomName.trim()}
            className={`px-4 py-2 rounded-lg bg-primary text-white flex items-center ${
              isLoading || !roomName.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            <Save size={16} className="mr-2" />
            {isLoading ? "Saving..." : "Save Room"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default RoomModal;