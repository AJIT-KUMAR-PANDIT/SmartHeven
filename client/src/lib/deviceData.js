import { 
  Lightbulb, 
  ThermometerSun, 
  AppWindow, 
  Tv, 
  Speaker, 
  Wind 
} from 'lucide-react';

export const devices = [
  {
    id: 1,
    name: 'Bedside Lamp',
    type: 'light',
    brand: 'Phillips Hue',
    room: 'bedroom',
    category: 'lighting',
    icon: Lightbulb,
    colorClass: 'primary',
    color: '#0B84FF',
    defaultActive: true,
    defaultSettings: {
      brightness: 75,
      color: 'warm'
    },
    colors: [
      { name: 'warm', hex: '#FFCC00' },
      { name: 'sunset', hex: '#FF5733' },
      { name: 'cool', hex: '#0B84FF' }
    ]
  },
  {
    id: 2,
    name: 'Smart Thermostat',
    type: 'thermostat',
    brand: 'Nest',
    room: 'bedroom',
    category: 'climate',
    icon: ThermometerSun,
    colorClass: 'warning',
    color: '#FFCC00',
    defaultActive: true,
    defaultSettings: {
      temperature: 22,
      mode: 'Heating'
    }
  },
  {
    id: 3,
    name: 'Window Blinds',
    type: 'blinds',
    brand: 'Lutron',
    room: 'bedroom',
    category: 'security',
    icon: AppWindow,
    colorClass: 'secondary',
    color: '#6D00F8',
    defaultActive: false,
    defaultSettings: {
      position: 80
    }
  },
  {
    id: 4,
    name: 'Smart TV',
    type: 'tv',
    brand: 'Samsung',
    room: 'bedroom',
    category: 'entertainment',
    icon: Tv,
    colorClass: 'success',
    color: '#00C853',
    defaultActive: false
  },
  {
    id: 5,
    name: 'Smart Speaker',
    type: 'speaker',
    brand: 'Amazon Echo',
    room: 'bedroom',
    category: 'entertainment',
    icon: Speaker,
    colorClass: 'primary',
    color: '#0B84FF',
    defaultActive: true
  },
  {
    id: 6,
    name: 'Air Purifier',
    type: 'purifier',
    brand: 'Dyson',
    room: 'bedroom',
    category: 'climate',
    icon: Wind,
    colorClass: 'secondary',
    color: '#6D00F8',
    defaultActive: true,
    defaultSettings: {
      aqi: 98,
      fanSpeed: 'Auto'
    }
  },
  {
    id: 7,
    name: 'Ceiling Light',
    type: 'light',
    brand: 'LIFX',
    room: 'living',
    category: 'lighting',
    icon: Lightbulb,
    colorClass: 'primary',
    color: '#0B84FF',
    defaultActive: true,
    defaultSettings: {
      brightness: 85,
      color: 'cool'
    },
    colors: [
      { name: 'warm', hex: '#FFCC00' },
      { name: 'sunset', hex: '#FF5733' },
      { name: 'cool', hex: '#0B84FF' }
    ]
  },
  {
    id: 8,
    name: 'Refrigerator',
    type: 'appliance',
    brand: 'LG SmartThinQ',
    room: 'kitchen',
    category: 'appliance',
    icon: Wind,
    colorClass: 'secondary',
    color: '#6D00F8',
    defaultActive: true
  }
];
