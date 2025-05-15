import { useState } from "react";
import { Eye, TrendingDown, Edit, Trash2, Plus, List } from "lucide-react";
import { motion } from "framer-motion";

export const RoomOverview = ({
  roomData,
  onEdit,
  onDelete,
  onAddDevice,
  onShowDevices,
  roomImages,
}) => {
  const [viewMode, setViewMode] = useState("regular");
  const [showDeviceList, setShowDeviceList] = useState(false);

  if (!roomData) return null;

  // Get the correct image path based on room type
  const roomImage = roomImages[roomData.type] || roomImages.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-5 neumorphic card-3d"
    >
      <div className="card-3d-inner grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Room preview image */}
        <div className="md:col-span-2 relative">
          <img
            src={roomImage}
            alt={`${roomData.name} view`}
            className="rounded-xl w-full h-64 md:h-full object-cover"
          />

          <div className="absolute top-4 right-4 glass rounded-lg p-2 bg-background/70 text-sm flex items-center">
            <Eye className="mr-2 text-primary" size={16} />
            Live View
          </div>

          {/* Status indicators overlaid on the image */}
          <div className="absolute bottom-4 left-4 flex space-x-2">
            <div className="glass bg-background/80 rounded-lg px-3 py-1 text-xs flex items-center">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse mr-2"></span>
              {roomData.deviceCount} Devices Online
            </div>
            <div className="glass bg-background/80 rounded-lg px-3 py-1 text-xs flex items-center">
              <TrendingDown className="text-warning mr-2" size={14} />
              {roomData.temperature}°C
            </div>
          </div>
        </div>

        {/* Room stats */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-medium mb-2">
              {roomData.name}
            </h3>
            <p className="text-sm text-foreground/60 mb-4">
              All systems operating normally
            </p>

            <div className="space-y-4">
              {roomData.stats &&
                roomData.stats.map((stat) => (
                  <motion.div
                    key={stat.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: stat.delay || 0 }}
                    className="flex items-center"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg glass flex items-center justify-center text-${stat.color}`}
                    >
                      <stat.icon size={18} />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-foreground/60">{stat.name}</p>
                      <p className="text-lg font-mono">{stat.value}</p>
                    </div>
                    <div className="ml-auto h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${stat.color} rounded-full`}
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onShowDevices(roomData.id)}
              className="bg-primary rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1"
            >
              <List size={16} /> Devices
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEdit(roomData.id)}
              className="bg-secondary rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1"
            >
              <Edit size={16} /> Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onDelete(roomData.id)}
              className="bg-destructive rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAddDevice(roomData.id)}
              className="bg-success rounded-xl py-2 text-sm font-medium flex items-center justify-center gap-1"
            >
              <Plus size={16} /> Add Device
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomOverview;
