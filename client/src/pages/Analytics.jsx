import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarDays,
  Clock,
  Activity,
  Zap,
  Droplets,
  ThermometerSun,
  ArrowDown,
  ArrowUp,
  BarChart3
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-xl p-5 neumorphic"
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{backgroundColor: `${color}20`}}>
          <Icon size={20} style={{color: color}} />
        </div>
        <div className={`px-2 py-1 rounded-md text-xs flex items-center ${isPositive ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
          {isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-sm text-foreground/70 mb-1">{title}</div>
      <div className="text-2xl font-medium">{value}</div>
    </motion.div>
  );
};

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  
  // Sample analytics data
  const statsData = [
    {
      title: 'Energy Usage',
      value: '86.4 kWh',
      change: -12,
      icon: Zap,
      color: '#0B84FF'
    },
    {
      title: 'Water Usage',
      value: '428 L',
      change: 8,
      icon: Droplets,
      color: '#6D00F8'
    },
    {
      title: 'Avg. Temperature',
      value: '22.5°C',
      change: -4,
      icon: ThermometerSun,
      color: '#FFCC00'
    },
    {
      title: 'Device Activity',
      value: '248 hrs',
      change: 15,
      icon: Activity,
      color: '#FF5733'
    }
  ];
  
  const roomEfficiency = [
    { name: 'Living Room', efficiency: 92, color: '#0B84FF' },
    { name: 'Bedroom', efficiency: 88, color: '#6D00F8' },
    { name: 'Kitchen', efficiency: 75, color: '#FFCC00' },
    { name: 'Bathroom', efficiency: 95, color: '#00C853' }
  ];
  
  // Generate sample data points for the chart
  const generateChartPath = () => {
    const points = [];
    for (let i = 0; i < 7; i++) {
      points.push({
        day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
        value: Math.floor(Math.random() * 50) + 50,
        yPosition: 150 - (Math.floor(Math.random() * 50) + 50)
      });
    }
    
    return points.map((point, index) => {
      const x = 70 + (index * (350 / 6));
      const y = point.yPosition;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };
  
  const chartPath = generateChartPath();
  const areaPath = chartPath + ' L420,170 L70,170 Z';
  
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
                Analytics
              </motion.h1>
              <p className="text-sm text-foreground/60">Track your smart home performance</p>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${timeframe === 'day' ? 'bg-white/10' : ''}`}
                onClick={() => setTimeframe('day')}
              >
                <Clock className="mr-1" size={14} />
                Day
              </button>
              <button 
                className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${timeframe === 'week' ? 'bg-white/10' : ''}`}
                onClick={() => setTimeframe('week')}
              >
                <CalendarDays className="mr-1" size={14} />
                Week
              </button>
              <button 
                className={`glass px-3 py-1 rounded-lg text-xs flex items-center ${timeframe === 'month' ? 'bg-white/10' : ''}`}
                onClick={() => setTimeframe('month')}
              >
                <BarChart3 className="mr-1" size={14} />
                Month
              </button>
            </div>
          </div>
        </header>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
        
        {/* Energy Usage Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-xl p-5 neumorphic mb-6"
        >
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Energy Consumption</h3>
              <p className="text-sm text-foreground/60">Total usage for the {timeframe}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">86.4 kWh</p>
              <p className="text-xs text-success">
                12% less vs last {timeframe}
              </p>
            </div>
          </div>
          
          {/* Energy Chart */}
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="50" y1="170" x2="480" y2="170" stroke="#333" strokeWidth="1" />
              <line x1="50" y1="130" x2="480" y2="130" stroke="#333" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="90" x2="480" y2="90" stroke="#333" strokeWidth="1" strokeDasharray="4" />
              <line x1="50" y1="50" x2="480" y2="50" stroke="#333" strokeWidth="1" strokeDasharray="4" />
              
              {/* Y-axis labels */}
              <text x="30" y="170" textAnchor="end" fill="#999" fontSize="10">0</text>
              <text x="30" y="130" textAnchor="end" fill="#999" fontSize="10">50</text>
              <text x="30" y="90" textAnchor="end" fill="#999" fontSize="10">100</text>
              <text x="30" y="50" textAnchor="end" fill="#999" fontSize="10">150</text>
              
              {/* X-axis labels */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const x = 70 + (index * (350 / 6));
                return (
                  <text key={day} x={x} y="185" textAnchor="middle" fill="#999" fontSize="10">{day}</text>
                );
              })}
              
              {/* Data line */}
              <path d={chartPath} stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" />
              
              {/* Area under the line */}
              <path d={areaPath} fill="url(#chartGradient)" opacity="0.3" />
              
              {/* Data points */}
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => {
                const x = 70 + (idx * (350 / 6));
                const y = 150 - (Math.floor(Math.random() * 50) + 50);
                return (
                  <circle 
                    key={idx} 
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill="hsl(var(--primary))" 
                  />
                );
              })}
            </svg>
          </div>
        </motion.div>
        
        {/* Room Efficiency */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass rounded-xl p-5 neumorphic"
        >
          <h3 className="text-lg font-medium mb-4">Room Efficiency</h3>
          
          <div className="space-y-5">
            {roomEfficiency.map((room) => (
              <motion.div 
                key={room.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>{room.name}</span>
                  <span className="font-medium">{room.efficiency}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${room.efficiency}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: room.color }}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;