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
} from "lucide-react";
import Modal from "@/components/ui/modal";
import { toast } from "@/components/ui/use-toast";
import { AutomationDB } from "@/database_lowdb/db";

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
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form if editing
  useEffect(() => {
    if (isOpen) {
      if (editAutomation) {
        setName(editAutomation.name);
        setDescription(editAutomation.description);
        setSelectedCondition(
          conditionTypes.find((t) => t.type === editAutomation.conditionType) ||
            conditionTypes[0]
        );
        setTime(editAutomation.time || "");
        setDays(editAutomation.days || []);
        setIsEnabled(editAutomation.isEnabled || false);
      } else {
        // Reset form for new automation
        setName("");
        setDescription("");
        setSelectedCondition(conditionTypes[0]);
        setTime("");
        setDays([]);
        setIsEnabled(false);
      }
    }
  }, [isOpen, editAutomation]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      setIsLoading(true);

      // Prepare automation data
      const automationData = {
        id: editAutomation?.id || AutomationDB.generateId(),
        name: name.trim(),
        description: description.trim(),
        conditionType: selectedCondition.type,
        time,
        days,
        isEnabled,
        lastUpdated: Date.now(),
      };

      // Save to database
      await AutomationDB.init();
      await AutomationDB.save("automations", automationData.id, automationData);

      toast({
        title: `Automation ${editAutomation ? "Updated" : "Created"}`,
        description: `Successfully ${editAutomation ? "updated" : "created"} the automation.`,
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
      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter automation name"
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
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
                    selectedCondition.type === condition.type ? "text-primary" : ""
                  }`}
                />
                <span className="text-xs text-center">{condition.name}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time */}
        {selectedCondition.type === "time" && (
          <div>
            <label className="block text-sm mb-2">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 rounded-lg glass border border-white/10 bg-white/5 focus:outline-none focus:border-primary/50"
            />
          </div>
        )}

        {/* Days */}
        {selectedCondition.type === "time" && (
          <div>
            <label className="block text-sm mb-2">Days</label>
            <div className="flex flex-wrap gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
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
              ))}
            </div>
          </div>
        )}

        {/* Enabled */}
        <div className="flex items-center justify-between">
          <label className="block text-sm">Enabled</label>
          <div className="relative inline-flex" onClick={() => setIsEnabled(!isEnabled)}>
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