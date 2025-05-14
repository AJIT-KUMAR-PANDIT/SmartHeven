import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar,
  MapPin,
  ThermometerSun,
  Sun,
  PowerOff,
  Layers,
  Save,
  Plus,
  Smartphone,
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { toast } from "@/components/ui/use-toast";
import { AutomationDB, DeviceDB } from "@/database_lowdb/db";

const conditionTypes = [
  { icon: Clock, name: "Time", type: "time" },
  { icon: MapPin, name: "Location", type: "location" },
  { icon: ThermometerSun, name: "Temperature", type: "temperature" },
  { icon: Sun, name: "Sunset/Sunrise", type: "sun" },
  { icon: PowerOff, name: "Device State", type: "device" },
];

const AutomationModal = ({ isOpen, onClose, editAutomation = null }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCondition, setSelectedCondition] = useState(conditionTypes[0]);
  const [time, setTime] = useState("");
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [temperature, setTemperature] = useState({ min: 0, max: 30 });
  const [sunEvent, setSunEvent] = useState("sunrise");
  const [deviceTrigger, setDeviceTrigger] = useState({
    deviceId: "",
    state: "on",
  });
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deviceActions, setDeviceActions] = useState({});

  // Load devices and populate form if editing
  useEffect(() => {
    const loadData = async () => {
      try {
        const devicesData = await DeviceDB.getAllItems();
        const devicesList = Object.values(devicesData || {});
        setDevices(devicesList);
        if (editAutomation) {
          setName(editAutomation.name);
          setDescription(editAutomation.description);
          setSelectedCondition(
            conditionTypes.find(
              (t) => t.type === editAutomation.conditionType
            ) || conditionTypes[0]
          );
          setTime(editAutomation.time || "");
          setDays(editAutomation.days || []);
          setIsEnabled(editAutomation.isEnabled || false);

          // Initialize selected devices and their actions
          const selectedDeviceIds = editAutomation.devices || [];
          setSelectedDevices(selectedDeviceIds);

          const initialDeviceActions = {};
          selectedDeviceIds.forEach((deviceId) => {
            initialDeviceActions[deviceId] = editAutomation.deviceActions?.[
              deviceId
            ] || { action: "toggle" };
          });
          setDeviceActions(initialDeviceActions);
        } else {
          // Reset form for new automation
          setName("");
          setDescription("");
          setSelectedCondition(conditionTypes[0]);
          setTime("");
          setDays([]);
          setIsEnabled(false);
          setSelectedDevices([]);
          setDeviceActions({});
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load devices. Please try again.",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [isOpen, editAutomation]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    try {
      setIsLoading(true);

      const getConditionData = () => {
        switch (selectedCondition.type) {
          case "time":
            return { time, days };
          case "location":
            return { location };
          case "temperature":
            return { temperature };
          case "sun":
            return { sunEvent };
          case "device":
            return { deviceTrigger };
          default:
            return {};
        }
      };

      const automationData = {
        id: editAutomation?.id || AutomationDB.generateId(),
        name: name.trim(),
        description: description.trim(),
        conditionType: selectedCondition.type,
        condition: getConditionData(),
        isEnabled,
        devices: selectedDevices,
        deviceActions: deviceActions,
        createdAt: editAutomation?.createdAt || Date.now(),
        updatedAt: Date.now(),
      };

      // Save to database
      await AutomationDB.init();
      await AutomationDB.save("automations", automationData.id, automationData);

      toast({
        title: `Automation ${editAutomation ? "Updated" : "Created"}`,
        description: `Successfully ${
          editAutomation ? "updated" : "created"
        } the automation.`,
      });

      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error("Error saving automation:", error);
      toast({
        title: "Error",
        description: "Failed to save automation. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editAutomation ? "Edit Automation" : "Create Automation"}
      width="max-w-lg"
    >
      <div className="space-y-6 overflow-y-scroll h-[75vh]">
        {/* Name */}
        <div>
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter automation name"
            className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
            rows={3}
          />
        </div>

        {/* Condition Type */}
        <div>
          <label className="block text-sm mb-2">Condition Type</label>
          <div className="grid grid-cols-3 gap-2">
            {conditionTypes.map((condition, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCondition(condition)}
                className={`flex flex-col items-center p-3 rounded-lg ${
                  selectedCondition.type === condition.type
                    ? "bg-primary/20 border border-primary/50"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <condition.icon
                  size={24}
                  className={`mb-2 ${
                    selectedCondition.type === condition.type
                      ? "text-primary"
                      : ""
                  }`}
                />
                <span className="text-xs text-center">{condition.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Condition */}
        {selectedCondition.type === "time" && (
          <>
            <div>
              <label className="block text-sm mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => {
                  const value = e.target.value;
                  if (
                    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value) ||
                    value === ""
                  ) {
                    setTime(value);
                  }
                }}
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
                style={{
                  "--time-picker-bg": "rgba(30, 30, 35, 0.9)",
                  "--time-picker-text": "#ffffff",
                  "--time-picker-highlight": "rgba(99, 102, 241, 0.7)",
                  "--time-picker-arrow": "#ffffff",
                  "--time-picker-selected-bg": "rgba(99, 102, 241, 0.4)",
                  "--time-picker-hover-bg": "rgba(99, 102, 241, 0.3)",
                  color: "var(--time-picker-text)",
                  backgroundColor: "var(--time-picker-bg)",
                  "&::-webkit-calendar-picker-indicator": {
                    filter: "invert(1)",
                  },
                }}
                step="60"
                required
              />
              <div className="mt-2 text-xs text-white/50">
                Use 12-hour format (HH:MM)
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Days</label>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <motion.button
                      key={day}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (days.includes(day)) {
                          setDays(days.filter((d) => d !== day));
                        } else {
                          setDays([...days, day]);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg ${
                        days.includes(day)
                          ? "bg-primary/20 border border-primary/50"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      {day}
                    </motion.button>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {/* Location Condition */}
        {selectedCondition.type === "location" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Latitude</label>
              <input
                type="number"
                value={location.lat}
                onChange={(e) =>
                  setLocation({ ...location, lat: e.target.value })
                }
                placeholder="Enter latitude"
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Longitude</label>
              <input
                type="number"
                value={location.lng}
                onChange={(e) =>
                  setLocation({ ...location, lng: e.target.value })
                }
                placeholder="Enter longitude"
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
              />
            </div>
          </div>
        )}

        {/* Temperature Condition */}
        {selectedCondition.type === "temperature" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">
                Minimum Temperature (°C)
              </label>
              <input
                type="number"
                value={temperature.min}
                onChange={(e) =>
                  setTemperature({
                    ...temperature,
                    min: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">
                Maximum Temperature (°C)
              </label>
              <input
                type="number"
                value={temperature.max}
                onChange={(e) =>
                  setTemperature({
                    ...temperature,
                    max: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
              />
            </div>
          </div>
        )}

        {/* Sun Event Condition */}
        {selectedCondition.type === "sun" && (
          <div>
            <label className="block text-sm mb-2">Sun Event</label>
            <select
              value={sunEvent}
              onChange={(e) => setSunEvent(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
            >
              <option value="sunrise">Sunrise</option>
              <option value="sunset">Sunset</option>
            </select>
          </div>
        )}

        {/* Device State Condition */}
        {selectedCondition.type === "device" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Select Device</label>
              <select
                value={deviceTrigger.deviceId}
                onChange={(e) =>
                  setDeviceTrigger({
                    ...deviceTrigger,
                    deviceId: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
              >
                <option value="">Select a device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Device State</label>
              <select
                value={deviceTrigger.state}
                onChange={(e) =>
                  setDeviceTrigger({ ...deviceTrigger, state: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg glass border border-primary/30 bg-white/5 hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 focus:shadow-lg focus:shadow-primary/30 transition-all duration-200 text-white placeholder-white/50"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>
          </div>
        )}

        {/* Device Selection */}
        <div>
          <label className="block text-sm mb-2">
            Select Devices and Actions
          </label>
          {devices.length === 0 ? (
            <div className="text-center py-4 text-white/50">
              No devices available
            </div>
          ) : (
            <div className="space-y-4 max-h-48 overflow-y-auto p-2">
              {devices.map((device) => (
                <div key={device.id} className="space-y-2">
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (selectedDevices.includes(device.id)) {
                          setSelectedDevices(
                            selectedDevices.filter((id) => id !== device.id)
                          );
                          setDeviceActions((prev) => {
                            const newActions = { ...prev };
                            delete newActions[device.id];
                            return newActions;
                          });
                        } else {
                          setSelectedDevices([...selectedDevices, device.id]);
                          setDeviceActions((prev) => ({
                            ...prev,
                            [device.id]: { action: "toggle" },
                          }));
                        }
                      }}
                      className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-white/10 ${
                        selectedDevices.includes(device.id)
                          ? "bg-primary/20 border border-primary/50 shadow-lg shadow-primary/20"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-md bg-black/20 flex items-center justify-center mr-2">
                        <Smartphone
                          size={16}
                          className={
                            selectedDevices.includes(device.id)
                              ? "text-primary"
                              : ""
                          }
                        />
                      </div>
                      <span className="text-sm font-medium">{device.name}</span>
                    </motion.button>

                    {selectedDevices.includes(device.id) && (
                      <div className="ml-10 p-3 rounded-lg bg-white/5 border border-white/10">
                        <label className="block text-sm mb-2">Action</label>
                        <select
                          value={deviceActions[device.id]?.action || "toggle"}
                          onChange={(e) => {
                            setDeviceActions((prev) => ({
                              ...prev,
                              [device.id]: { action: e.target.value },
                            }));
                          }}
                          className="w-full px-3 py-2 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
                        >
                          <option value="toggle">Toggle</option>
                          <option value="turnOn">Turn On</option>
                          <option value="turnOff">Turn Off</option>
                        </select>
                      </div>
                    )}
                  </>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enabled */}
        <div className="flex items-center justify-between">
          <label className="block text-sm">Enabled</label>
          <div
            className="relative inline-flex"
            onClick={() => setIsEnabled(!isEnabled)}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={isEnabled}
              readOnly
            />
            <div
              className={`block w-14 h-8 rounded-full ${
                isEnabled ? "bg-primary" : "bg-white/10"
              } transition-colors duration-200`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${
                isEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
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
            disabled={isLoading}
            className="px-4 py-2 rounded-lg bg-primary text-white flex items-center"
          >
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {editAutomation ? "Update" : "Create"}
              </>
            )}
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default AutomationModal;
