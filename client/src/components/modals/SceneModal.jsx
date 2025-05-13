import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Home,
  Moon,
  Sun,
  Tv,
  Sofa,
  Coffee,
  Bath,
  Wind,
  Plus,
  Trash2,
  Save,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { SceneDB, DeviceDB } from "@/database_lowdb/db";

const icons = [
  { icon: Zap, name: "Zap" },
  { icon: Home, name: "Home" },
  { icon: Moon, name: "Moon" },
  { icon: Sun, name: "Sun" },
  { icon: Tv, name: "TV" },
  { icon: Sofa, name: "Sofa" },
  { icon: Coffee, name: "Coffee" },
  { icon: Bath, name: "Bath" },
  { icon: Wind, name: "Wind" },
];

const SceneModal = ({ isOpen, onClose, editScene = null }) => {
  const [sceneName, setSceneName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(icons[0]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get all devices when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadDevices = async () => {
        try {
          // Initialize the database if not already initialized
          await DeviceDB.init();
          const devices = await DeviceDB.getAllItems("devices");
          setAvailableDevices(devices || []);

          // If editing, populate form
          if (editScene) {
            setSceneName(editScene.name);
            setSelectedIcon(
              icons.find((i) => i.name === editScene.icon) || icons[0]
            );

            // Find devices included in scene actions
            if (editScene.actions && Array.isArray(editScene.actions)) {
              const sceneDevices = editScene.actions
                .map((action) => ({
                  ...devices.find((d) => d.id === action.deviceId),
                  action: action.changes,
                }))
                .filter(Boolean);

              setSelectedDevices(sceneDevices);
            }
          } else {
            // Reset form for new scene
            setSceneName("");
            setSelectedIcon(icons[0]);
            setSelectedDevices([]);
          }
        } catch (error) {
          console.error("Failed to load devices:", error);
        }
      };

      loadDevices();
    }
  }, [isOpen, editScene]);

  const handleAddDevice = (device) => {
    // Check if device already selected
    if (selectedDevices.some((d) => d.id === device.id)) return;

    setSelectedDevices([
      ...selectedDevices,
      {
        ...device,
        action: {
          status: device.status === "on" ? "off" : "on",
        },
      },
    ]);
  };

  const handleRemoveDevice = (deviceId) => {
    setSelectedDevices(selectedDevices.filter((d) => d.id !== deviceId));
  };

  const handleToggleDeviceAction = (deviceId, field, value) => {
    setSelectedDevices(
      selectedDevices.map((device) => {
        if (device.id === deviceId) {
          return {
            ...device,
            action: {
              ...device.action,
              [field]: value,
            },
          };
        }
        return device;
      })
    );
  };

  const handleSubmit = async () => {
    if (!sceneName.trim() || selectedDevices.length === 0) return;

    try {
      setIsLoading(true);

      // Prepare the scene object
      const sceneData = {
        id: editScene?.id || SceneDB.generateId(),
        name: sceneName.trim(),
        icon: selectedIcon.name,
        actions: selectedDevices.map((device) => ({
          deviceId: device.id,
          changes: device.action,
        })),
        isActive: false,
        lastTriggered: null,
      };

      // Save to database
      await SceneDB.init();
      await DeviceDB.init();
      const devices = await DeviceDB.getAllItems("devices");
      await SceneDB.save(sceneData.id, sceneData);

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Error saving scene:", error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editScene ? "Edit Scene" : "Create New Scene"}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Scene Name */}
        <div>
          <label className="block text-sm mb-2">Scene Name</label>
          <input
            type="text"
            value={sceneName}
            onChange={(e) => setSceneName(e.target.value)}
            placeholder="Enter scene name"
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm mb-2">Icon</label>
          <div className="flex flex-wrap gap-2">
            {icons.map((icon, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedIcon(icon)}
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedIcon.name === icon.name
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <icon.icon
                  size={24}
                  className={
                    selectedIcon.name === icon.name ? "text-primary" : ""
                  }
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Device Actions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm">Devices & Actions</label>
            <div className="text-xs text-primary">
              {selectedDevices.length} selected
            </div>
          </div>

          {/* Selected Devices */}
          <div className="max-h-44 overflow-y-auto custom-scrollbar space-y-2 mb-4">
            {selectedDevices.length === 0 ? (
              <div className="text-center py-4 text-sm opacity-50">
                No devices selected yet
              </div>
            ) : (
              selectedDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center mr-3`}
                    >
                      {/* Device icon would go here */}
                      <Smartphone size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{device.name}</div>
                      <div className="text-xs opacity-60">{device.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={device.action.status || "toggle"}
                      onChange={(e) =>
                        handleToggleDeviceAction(
                          device.id,
                          "status",
                          e.target.value
                        )
                      }
                      className="glass px-2 py-1 rounded-lg text-xs bg-transparent border border-white/10"
                    >
                      <option value="on">Turn ON</option>
                      <option value="off">Turn OFF</option>
                      <option value="toggle">Toggle</option>
                    </select>

                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="p-1 rounded-lg hover:bg-white/10"
                    >
                      <Trash2
                        size={16}
                        className="opacity-60 hover:opacity-100"
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Available Devices */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-wider opacity-50">
                Available Devices
              </label>
            </div>
            <div className="max-h-44 overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2">
              {availableDevices.length === 0 ? (
                <div className="col-span-2 text-center py-4 text-sm opacity-50">
                  No devices available
                </div>
              ) : (
                availableDevices.map((device) => {
                  const isSelected = selectedDevices.some(
                    (d) => d.id === device.id
                  );
                  return (
                    <button
                      key={device.id}
                      onClick={() => handleAddDevice(device)}
                      disabled={isSelected}
                      className={`flex items-center px-3 py-2 rounded-lg text-left ${
                        isSelected
                          ? "bg-primary/10 border border-primary/30 opacity-50 cursor-not-allowed"
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center mr-2">
                        <Smartphone size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{device.name}</div>
                        <div className="text-xs opacity-60">{device.type}</div>
                      </div>
                      {!isSelected && (
                        <Plus size={16} className="ml-auto opacity-60" />
                      )}
                    </button>
                  );
                })
              )}
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
            disabled={
              isLoading || !sceneName.trim() || selectedDevices.length === 0
            }
            className={`px-4 py-2 rounded-lg bg-primary text-white flex items-center ${
              isLoading || !sceneName.trim() || selectedDevices.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary/90"
            }`}
          >
            <Save size={16} className="mr-2" />
            {isLoading ? "Saving..." : "Save Scene"}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default SceneModal;
