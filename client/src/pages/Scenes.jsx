import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Moon, Sun, Utensils, Tv, Music, Bed } from 'lucide-react';

const SceneCard = ({ scene, isActive, onToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass rounded-xl p-5 neumorphic device-card ${isActive ? 'active' : ''}`}
      onClick={onToggle}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-${scene.colorClass}`} style={{ backgroundColor: `${scene.color}20` }}>
          <scene.icon size={24} />
        </div>
        <div className="relative inline-flex">
          <input
            type="checkbox"
            className="sr-only"
            checked={isActive}
            readOnly
          />
          <div
            className={`block w-14 h-8 rounded-full ${isActive ? 'bg-primary' : 'bg-white/10'} transition-colors duration-200`}
          ></div>
          <div
            className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-200 transform ${
              isActive ? 'translate-x-6' : 'translate-x-0'
            }`}
          ></div>
        </div>
      </div>
      <h3 className="text-lg font-medium">{scene.name}</h3>
      <p className="text-sm text-foreground/60">{scene.deviceCount} devices</p>
      
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-foreground/60 mb-2">Included devices:</p>
        <div className="flex flex-wrap gap-1">
          {scene.devices.map((device, idx) => (
            <span 
              key={idx} 
              className="inline-block px-2 py-1 text-xs bg-white/5 rounded-md"
            >
              {device}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Scenes = () => {
  // Sample scene data - in a real app, this would come from an API
  const scenesData = [
    {
      id: 1,
      name: 'Movie Night',
      deviceCount: 5,
      icon: Tv,
      colorClass: 'primary',
      color: '#0B84FF',
      devices: ['Living Room TV', 'Living Room Lights', 'Sound Bar']
    },
    {
      id: 2,
      name: 'Good Morning',
      deviceCount: 6,
      icon: Sun,
      colorClass: 'warning',
      color: '#FFCC00',
      devices: ['Bedroom Blinds', 'Kitchen Lights', 'Coffee Maker']
    },
    {
      id: 3,
      name: 'Good Night',
      deviceCount: 8,
      icon: Moon,
      colorClass: 'secondary',
      color: '#6D00F8',
      devices: ['All Lights', 'Lock Doors', 'Set Thermostat']
    },
    {
      id: 4,
      name: 'Dinner Time',
      deviceCount: 4,
      icon: Utensils,
      colorClass: 'accent',
      color: '#FF5733',
      devices: ['Dining Lights', 'Kitchen Appliances']
    },
    {
      id: 5,
      name: 'Party Mode',
      deviceCount: 7,
      icon: Music,
      colorClass: 'primary',
      color: '#0B84FF',
      devices: ['All Speakers', 'Living Room Lights', 'Kitchen Lights']
    },
    {
      id: 6,
      name: 'Sleeping',
      deviceCount: 5,
      icon: Bed,
      colorClass: 'secondary',
      color: '#6D00F8',
      devices: ['Bedroom Lights', 'AC', 'Bedroom Speaker']
    }
  ];
  
  const [activeScenes, setActiveScenes] = useState({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });
  
  const toggleScene = (sceneId) => {
    setActiveScenes(prev => ({
      ...prev,
      [sceneId]: !prev[sceneId]
    }));
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
                Scenes
              </motion.h1>
              <p className="text-sm text-foreground/60">Create and manage automated scenes</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass neumorphic px-4 py-2 rounded-xl flex items-center text-sm hover:bg-white/10 transition"
            >
              <Plus className="mr-2" size={18} />
              Create Scene
            </motion.button>
          </div>
        </header>
        
        {/* Scenes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenesData.map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              isActive={activeScenes[scene.id]}
              onToggle={() => toggleScene(scene.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scenes;