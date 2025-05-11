import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

const EnergyMonitoring = ({ timeframe, roomId }) => {
  // Sample energy data - would come from API in a real app
  const [energyData, setEnergyData] = useState({
    total: 42.8,
    change: -12,
    distribution: [
      { name: 'Lighting', value: 12.6, percentage: 30, color: 'primary' },
      { name: 'Climate Control', value: 18.3, percentage: 42, color: 'warning' },
      { name: 'Entertainment', value: 8.9, percentage: 20, color: 'secondary' },
      { name: 'Other Devices', value: 3.0, percentage: 8, color: 'gray-400' }
    ],
    chartData: [
      { day: 'Mon', value: 5.0, yPosition: 120 },
      { day: 'Tue', value: 7.0, yPosition: 100 },
      { day: 'Wed', value: 4.0, yPosition: 130 },
      { day: 'Thu', value: 10.0, yPosition: 70 },
      { day: 'Fri', value: 8.0, yPosition: 90 },
      { day: 'Sat', value: 6.0, yPosition: 110 }
    ]
  });

  // Simulate API call when timeframe changes
  useEffect(() => {
    // This would be an API call in a real app
    if (timeframe === 'day') {
      setEnergyData(prev => ({
        ...prev,
        total: 5.9,
        change: -8,
        chartData: [
          { day: '12AM', value: 0.2, yPosition: 160 },
          { day: '4AM', value: 0.1, yPosition: 165 },
          { day: '8AM', value: 0.8, yPosition: 130 },
          { day: '12PM', value: 1.5, yPosition: 100 },
          { day: '4PM', value: 1.8, yPosition: 90 },
          { day: '8PM', value: 1.5, yPosition: 100 }
        ]
      }));
    } else if (timeframe === 'week') {
      setEnergyData(prev => ({
        ...prev,
        total: 42.8,
        change: -12,
        chartData: [
          { day: 'Mon', value: 5.0, yPosition: 120 },
          { day: 'Tue', value: 7.0, yPosition: 100 },
          { day: 'Wed', value: 4.0, yPosition: 130 },
          { day: 'Thu', value: 10.0, yPosition: 70 },
          { day: 'Fri', value: 8.0, yPosition: 90 },
          { day: 'Sat', value: 6.0, yPosition: 110 }
        ]
      }));
    } else if (timeframe === 'month') {
      setEnergyData(prev => ({
        ...prev,
        total: 183.5,
        change: -5,
        chartData: [
          { day: 'W1', value: 42.8, yPosition: 120 },
          { day: 'W2', value: 45.2, yPosition: 110 },
          { day: 'W3', value: 48.3, yPosition: 100 },
          { day: 'W4', value: 47.2, yPosition: 105 }
        ]
      }));
    }
  }, [timeframe]);

  // Generate SVG path for the chart line
  const generateChartPath = () => {
    return energyData.chartData.map((point, index) => {
      const x = 70 + (index * (350 / (energyData.chartData.length - 1)));
      const y = point.yPosition;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  // Generate SVG path for the chart area
  const generateAreaPath = () => {
    const linePath = generateChartPath();
    const lastPoint = energyData.chartData.length - 1;
    const lastX = 70 + (lastPoint * (350 / (energyData.chartData.length - 1)));
    return `${linePath} L${lastX},170 L70,170 Z`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass rounded-xl p-5 neumorphic"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium">Consumption Overview</h3>
              <p className="text-sm text-foreground/60">{timeframe === 'day' ? 'Daily' : timeframe === 'week' ? 'Weekly' : 'Monthly'} power usage</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-medium">{energyData.total} kWh</p>
              <p className={`text-xs ${energyData.change < 0 ? 'text-success' : 'text-danger'}`}>
                {energyData.change}% vs last {timeframe}
              </p>
            </div>
          </div>
          
          {/* Energy Usage Chart */}
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
              <text x="30" y="130" textAnchor="end" fill="#999" fontSize="10">5</text>
              <text x="30" y="90" textAnchor="end" fill="#999" fontSize="10">10</text>
              <text x="30" y="50" textAnchor="end" fill="#999" fontSize="10">15</text>
              
              {/* X-axis labels */}
              {energyData.chartData.map((point, index) => {
                const x = 70 + (index * (350 / (energyData.chartData.length - 1)));
                return (
                  <text key={point.day} x={x} y="185" textAnchor="middle" fill="#999" fontSize="10">{point.day}</text>
                );
              })}
              
              {/* Data line */}
              <path d={generateChartPath()} className="chart-line" />
              
              {/* Area under the line */}
              <path d={generateAreaPath()} className="chart-area" />
              
              {/* Data points */}
              {energyData.chartData.map((point, index) => {
                const x = 70 + (index * (350 / (energyData.chartData.length - 1)));
                return (
                  <circle 
                    key={index} 
                    cx={x} 
                    cy={point.yPosition} 
                    r="4" 
                    fill="hsl(var(--primary))" 
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center">
              <span className="block w-3 h-3 rounded-full bg-primary mr-2"></span>
              <span className="text-xs capitalize">{roomId}</span>
            </div>
            <div className="flex items-center">
              <span className="block w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
              <span className="text-xs">Compare with other rooms</span>
            </div>
          </div>
        </div>
        
        {/* Energy Stats */}
        <div>
          <h3 className="text-lg font-medium mb-4">Energy Distribution</h3>
          
          <div className="space-y-5">
            {energyData.distribution.map((item) => (
              <motion.div 
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.value} kWh</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-full bg-${item.color} rounded-full`}
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <div className="glass rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success mr-3">
                <Leaf size={18} />
              </div>
              <div>
                <p className="text-sm font-medium">Eco-Friendly Usage</p>
                <p className="text-xs text-foreground/60">30% lower than avg.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnergyMonitoring;
