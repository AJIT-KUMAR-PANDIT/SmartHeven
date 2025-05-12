import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Clock, 
  Calendar, 
  MapPin, 
  ThermometerSun, 
  Sun, 
  PowerOff, 
  Layers
} from 'lucide-react';

const AutomationCard = ({ automation, isEnabled, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-xl p-5 neumorphic device-card ${isEnabled ? 'active' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-${automation.colorClass}`} style={{ backgroundColor: `${automation.color}20` }}>
          <automation.icon size={24} />
        </div>
        <div className="flex items-center">
          <span className={`text-xs mr-2 ${isEnabled ? 'text-success' : 'text-foreground/40'}`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <div className="relative inline-flex" onClick={onToggle}>
            <input
              type="checkbox"
              className="sr-only"
              checked={isEnabled}
              readOnly
            />
            <div
              className={`block w-14 h-8 rounded-full ${isEnabled ? 'bg-primary' : 'bg-white/10'} transition-colors duration-200`}
            ></div>
            <div
              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-medium">{automation.name}</h3>
      <p className="text-sm text-foreground/60 mb-3">{automation.description}</p>
      
      <div className="flex items-center text-xs text-foreground/70 mb-3">
        <div className="flex items-center mr-3">
          <Clock size={14} className="mr-1" />
          <span>{automation.time}</span>
        </div>
        {automation.days && (
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{automation.days}</span>
          </div>
        )}
      </div>
      
      <div className="pt-3 border-t border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs">
            <Layers size={14} className="mr-1" />
            <span>Conditions: {automation.conditions}</span>
          </div>
          <button className="text-xs text-primary hover:underline">Edit</button>
        </div>
      </div>
    </motion.div>
  );
};

const Automations = () => {
  // Sample automation data - in a real app, this would come from an API
  const automationsData = [
    {
      id: 1,
      name: 'Morning Routine',
      description: 'Open blinds and turn on lights at 7am on weekdays',
      time: '7:00 AM',
      days: 'Mon-Fri',
      conditions: 'Time-based',
      icon: Clock,
      colorClass: 'primary',
      color: '#0B84FF'
    },
    {
      id: 2,
      name: 'Away Mode',
      description: 'Turn off all devices when no one is home',
      time: 'When leaving',
      conditions: 'Location-based',
      icon: MapPin,
      colorClass: 'warning',
      color: '#FFCC00'
    },
    {
      id: 3,
      name: 'Evening Settings',
      description: 'Dim lights and decrease thermostat at 9pm',
      time: '9:00 PM',
      days: 'Everyday',
      conditions: 'Time-based',
      icon: ThermometerSun,
      colorClass: 'secondary',
      color: '#6D00F8'
    },
    {
      id: 4,
      name: 'Sunset Lighting',
      description: 'Adjust lighting when the sun sets',
      time: 'At sunset',
      conditions: 'Weather-based',
      icon: Sun,
      colorClass: 'accent',
      color: '#FF5733'
    },
    {
      id: 5,
      name: 'Night Mode',
      description: 'Turn off all non-essential devices at midnight',
      time: '12:00 AM',
      days: 'Everyday',
      conditions: 'Time-based',
      icon: PowerOff,
      colorClass: 'secondary',
      color: '#6D00F8'
    }
  ];
  
  const [enabledAutomations, setEnabledAutomations] = useState({
    1: true,
    2: true,
    3: true,
    4: false,
    5: false
  });
  
  const toggleAutomation = async (automationId) => {
    try {
      const newState = !enabledAutomations[automationId];
      
      await jsonDB.init();
      await jsonDB.saveItem('automations', {
        id: automationId,
        isEnabled: newState,
        lastUpdated: Date.now()
      });
      
      setEnabledAutomations(prev => ({
        ...prev,
        [automationId]: newState
      }));
      
      toast({
        title: `Automation ${newState ? 'Enabled' : 'Disabled'}`,
        description: `Successfully ${newState ? 'enabled' : 'disabled'} the automation.`,
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to toggle automation:', error);
      toast({
        title: "Error",
        description: "Failed to update automation. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <div className="min-h-screen pb-24 bg-background">
      <div className="p-4 md:p-6">
        <header className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl md:text-3xl font-display font-bold"
              >
                Automations
              </motion.h1>
              <p className="text-sm text-foreground/60">Create smart routines based on schedules or conditions</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass neumorphic px-4 py-2 rounded-xl flex items-center text-sm hover:bg-white/10 transition"
            >
              <Plus className="mr-2" size={18} />
              New Automation
            </motion.button>
          </div>
        </header>
        
        {/* Automations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {automationsData.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              isEnabled={enabledAutomations[automation.id]}
              onToggle={() => toggleAutomation(automation.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Automations;