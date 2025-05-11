import { 
  ThermometerSun, 
  Droplets, 
  Sun, 
  Sofa, 
  Bed, 
  UtensilsCrossed, 
  DoorClosed 
} from 'lucide-react';

export const rooms = [
  {
    id: 'living',
    name: 'Living Room',
    icon: Sofa,
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&h=800',
    deviceCount: 8,
    temperature: 21,
    stats: [
      {
        name: 'Temperature',
        value: '21°C',
        color: 'warning',
        percentage: 50,
        icon: ThermometerSun,
        delay: 0
      },
      {
        name: 'Humidity',
        value: '42%',
        color: 'secondary',
        percentage: 42,
        icon: Droplets,
        delay: 0.1
      },
      {
        name: 'Light Level',
        value: '70%',
        color: 'warning',
        percentage: 70,
        icon: Sun,
        delay: 0.2
      }
    ]
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: Bed,
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&h=800',
    deviceCount: 6,
    temperature: 22,
    stats: [
      {
        name: 'Temperature',
        value: '22°C',
        color: 'warning',
        percentage: 50,
        icon: ThermometerSun,
        delay: 0
      },
      {
        name: 'Humidity',
        value: '45%',
        color: 'secondary',
        percentage: 45,
        icon: Droplets,
        delay: 0.1
      },
      {
        name: 'Light Level',
        value: '65%',
        color: 'warning',
        percentage: 65,
        icon: Sun,
        delay: 0.2
      }
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: UtensilsCrossed,
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&h=800',
    deviceCount: 7,
    temperature: 23,
    stats: [
      {
        name: 'Temperature',
        value: '23°C',
        color: 'warning',
        percentage: 55,
        icon: ThermometerSun,
        delay: 0
      },
      {
        name: 'Humidity',
        value: '48%',
        color: 'secondary',
        percentage: 48,
        icon: Droplets,
        delay: 0.1
      },
      {
        name: 'Light Level',
        value: '80%',
        color: 'warning',
        percentage: 80,
        icon: Sun,
        delay: 0.2
      }
    ]
  },
  {
    id: 'entrance',
    name: 'Entrance',
    icon: DoorClosed,
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=1200&h=800',
    deviceCount: 4,
    temperature: 20,
    stats: [
      {
        name: 'Temperature',
        value: '20°C',
        color: 'warning',
        percentage: 45,
        icon: ThermometerSun,
        delay: 0
      },
      {
        name: 'Humidity',
        value: '40%',
        color: 'secondary',
        percentage: 40,
        icon: Droplets,
        delay: 0.1
      },
      {
        name: 'Light Level',
        value: '60%',
        color: 'warning',
        percentage: 60,
        icon: Sun,
        delay: 0.2
      }
    ]
  }
];
