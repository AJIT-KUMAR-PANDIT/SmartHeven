import { useState } from 'react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

const DeviceCard = ({ device, isActive, onToggle }) => {
  const [localSettings, setLocalSettings] = useState(device.defaultSettings || {});

  const handleSettingChange = (settingName, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [settingName]: value
    }));
  };

  // Smart Light specific controls
  const renderLightControls = () => {
    if (device.type !== 'light') return null;
    
    return (
      <>
        <div className="mb-2 flex justify-between text-xs">
          <span>Brightness</span>
          <span>{localSettings.brightness || 75}%</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full mb-3">
          <div 
            className="h-full bg-primary rounded-full"
            style={{ width: `${localSettings.brightness || 75}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-1">
            {device.colors?.map(color => (
              <button 
                key={color.name}
                className="w-6 h-6 rounded-full" 
                style={{ backgroundColor: color.hex }}
                onClick={() => handleSettingChange('color', color.name)}
              />
            ))}
            <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">+</button>
          </div>
          <button className="text-xs opacity-70">
            <span className="sr-only">More options</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </>
    );
  };

  // Smart Thermostat specific controls
  const renderThermostatControls = () => {
    if (device.type !== 'thermostat') return null;
    
    const temperature = localSettings.temperature || 22;
    
    return (
      <>
        <div className="flex justify-center my-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="absolute" width="112" height="112" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="52" fill="none" stroke="#1E1E1E" strokeWidth="8" />
              <circle 
                cx="56" 
                cy="56" 
                r="52" 
                fill="none" 
                stroke={device.color} 
                strokeWidth="8" 
                strokeDasharray="327" 
                strokeDashoffset={327 - ((temperature - 16) / (30 - 16)) * 327}
              />
            </svg>
            <div className="text-center">
              <span className="text-3xl font-medium">{temperature}°</span>
              <span className="text-xs block opacity-70">TARGET: {temperature + 1}°</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
            onClick={() => temperature > 16 && handleSettingChange('temperature', temperature - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.button>
          <div className="text-center">
            <div className="text-xs opacity-70">CURRENT MODE</div>
            <div className="text-sm font-medium">{localSettings.mode || "Heating"}</div>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
            onClick={() => temperature < 30 && handleSettingChange('temperature', temperature + 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </motion.button>
        </div>
      </>
    );
  };

  // Smart Blinds specific controls
  const renderBlindsControls = () => {
    if (device.type !== 'blinds') return null;
    
    const position = localSettings.position || 80;
    
    return (
      <>
        <div className="relative h-24 mb-4 flex items-center justify-center">
          <div className="h-full w-3/4 border-2 border-white/20 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col">
              <div className="h-1/2 bg-white/5"></div>
              <div className="h-1/2 bg-white/10"></div>
            </div>
            <div 
              style={{ height: `${position}%` }} 
              className="bg-background w-full absolute bottom-0 transition-all duration-500"
            ></div>
          </div>
        </div>
        
        <div className="mb-2 flex justify-between text-xs">
          <span>Position</span>
          <span>{position}% Closed</span>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full mb-3">
          <div 
            className="h-full bg-secondary rounded-full"
            style={{ width: `${position}%` }}
          ></div>
        </div>
        
        <div className="flex justify-center space-x-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className={`px-3 py-1 text-xs rounded-lg glass ${position === 0 ? 'bg-secondary/20' : ''}`}
            onClick={() => handleSettingChange('position', 0)}
          >
            Open
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className={`px-3 py-1 text-xs rounded-lg glass ${position === 50 ? 'bg-secondary/20' : ''}`}
            onClick={() => handleSettingChange('position', 50)}
          >
            50%
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className={`px-3 py-1 text-xs rounded-lg glass ${position === 100 ? 'bg-secondary/20' : ''}`}
            onClick={() => handleSettingChange('position', 100)}
          >
            Close
          </motion.button>
        </div>
      </>
    );
  };

  // Smart TV specific controls
  const renderTVControls = () => {
    if (device.type !== 'tv') return null;
    
    return (
      <>
        <div className="my-4 glass rounded-lg p-2 bg-background/50">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF3B30">
                <path d="M6.2 5.6C5.8 5.9 5 6.3 5 8v8c0 1.7.8 2.1 1.2 2.4.4.2 1 .3 1.8.1 2-.5 10.5-4.3 10.5-4.3s1.2-.5 1.2-1.7c0-1.1-1-1.7-1.2-1.7C18.5 10.7 10 7 8 6.4c-.2 0-.8-.3-1.8.1z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium">Netflix</p>
              <p className="text-xs opacity-60">Last watched</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="py-2 glass rounded-lg flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
            <span className="text-[10px]">Vol -</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="py-2 glass rounded-lg flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <path d="M18.36 6.64A9 9 0 0 1 20.77 15" />
              <path d="M6.16 6.16a9 9 0 1 0 12.68 12.68" />
              <path d="M12 2v4" />
              <path d="m2 2 20 20" />
            </svg>
            <span className="text-[10px]">Power</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="py-2 glass rounded-lg flex flex-col items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
            <span className="text-[10px]">Vol +</span>
          </motion.button>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 glass rounded-lg text-xs"
        >
          Open Full Remote
        </motion.button>
      </>
    );
  };

  // Smart Speaker specific controls
  const renderSpeakerControls = () => {
    if (device.type !== 'speaker') return null;
    
    return (
      <>
        <div className="flex justify-center my-3">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Visualizer Animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full flex justify-center space-x-1">
                <div className="w-1 h-4 bg-primary/70 rounded animate-pulse" style={{ animationDelay: '0s' }}></div>
                <div className="w-1 h-8 bg-primary/70 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1 h-12 bg-primary/70 rounded animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <div className="w-1 h-10 bg-primary/70 rounded animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <div className="w-1 h-8 bg-primary/70 rounded animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                <div className="w-1 h-4 bg-primary/70 rounded animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            {/* Current track info */}
            <div className="absolute bottom-0 text-center w-full">
              <p className="text-xs opacity-70">Now Playing</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full glass bg-primary/20 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </motion.button>
        </div>
      </>
    );
  };

  // Air Purifier specific controls
  const renderPurifierControls = () => {
    if (device.type !== 'purifier') return null;
    
    const airQuality = localSettings.aqi || 98;
    const fanSpeed = localSettings.fanSpeed || 'Auto';
    
    return (
      <>
        <div className="flex justify-center my-3">
          <div className="glass rounded-full w-20 h-20 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-xl font-medium">{airQuality}</div>
              <div className="text-xs opacity-70">AQI</div>
            </div>
            <svg className="absolute inset-0" width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#1E1E1E" strokeWidth="4" />
              <circle 
                cx="40" 
                cy="40" 
                r="36" 
                fill="none" 
                stroke={device.color} 
                strokeWidth="4" 
                strokeDasharray="226" 
                strokeDashoffset={226 - (airQuality / 100) * 226}
              />
            </svg>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs">
            <span>Fan Speed</span>
            <span>{fanSpeed}</span>
          </div>
          <div className="flex justify-between space-x-2">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className={`flex-1 py-1 text-xs rounded-lg glass ${fanSpeed === 'Low' ? 'bg-secondary/20' : ''}`}
              onClick={() => handleSettingChange('fanSpeed', 'Low')}
            >
              Low
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className={`flex-1 py-1 text-xs rounded-lg glass ${fanSpeed === 'Med' ? 'bg-secondary/20' : ''}`}
              onClick={() => handleSettingChange('fanSpeed', 'Med')}
            >
              Med
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              className={`flex-1 py-1 text-xs rounded-lg glass ${fanSpeed === 'Auto' ? 'bg-secondary/20' : ''}`}
              onClick={() => handleSettingChange('fanSpeed', 'Auto')}
            >
              Auto
            </motion.button>
          </div>
        </div>
      </>
    );
  };

  const renderDeviceControls = () => {
    switch (device.type) {
      case 'light': return renderLightControls();
      case 'thermostat': return renderThermostatControls();
      case 'blinds': return renderBlindsControls();
      case 'tv': return renderTVControls();
      case 'speaker': return renderSpeakerControls();
      case 'purifier': return renderPurifierControls();
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: device.id * 0.05 }}
      className={`device-card glass rounded-xl p-4 transition-all duration-300 ${isActive ? 'active' : ''}`}
      onClick={() => !isActive && onToggle()}
    >
      <div className="flex justify-between items-start">
        <div className={`w-10 h-10 rounded-lg glass flex items-center justify-center text-${device.colorClass}`}>
          <device.icon size={18} />
        </div>
        <Switch 
          checked={isActive} 
          onCheckedChange={onToggle}
          className={isActive ? `bg-${device.colorClass}` : ''}
        />
      </div>
      
      <h3 className="font-medium mt-3">{device.name}</h3>
      <p className="text-xs text-foreground/60 mb-4">{device.brand}</p>
      
      {isActive && renderDeviceControls()}
    </motion.div>
  );
};

export default DeviceCard;
