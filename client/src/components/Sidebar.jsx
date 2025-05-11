import { motion } from 'framer-motion';
import { 
  Home, 
  Smartphone, 
  Zap, 
  Clock, 
  LineChart, 
  Settings, 
  LogOut 
} from 'lucide-react';

const Sidebar = ({ activeRoom, onRoomChange, rooms }) => {
  return (
    <aside className="glass w-full md:w-72 lg:w-80 p-4 flex flex-col md:min-h-screen z-10">
      <div className="flex items-center mb-8 mt-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Home className="text-white" size={24} />
        </div>
        <div className="ml-3">
          <h1 className="font-display text-xl font-bold">SmartHaven</h1>
          <p className="text-xs opacity-60">Intelligent Living</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="mb-8">
        <ul className="space-y-1">
          <li>
            <a href="#" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20">
              <Home className="mr-3 text-primary" size={20} />
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition">
              <Smartphone className="mr-3 opacity-70" size={20} />
              Devices
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition">
              <Zap className="mr-3 opacity-70" size={20} />
              Scenes
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition">
              <Clock className="mr-3 opacity-70" size={20} />
              Automations
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition">
              <LineChart className="mr-3 opacity-70" size={20} />
              Analytics
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium hover:bg-white/5 transition">
              <Settings className="mr-3 opacity-70" size={20} />
              Settings
            </a>
          </li>
        </ul>
      </nav>

      {/* Room Navigation */}
      <div className="mb-4">
        <h3 className="text-xs uppercase tracking-wider opacity-50 px-4 mb-2">Rooms</h3>
        <div className="flex md:flex-col flex-row overflow-x-auto md:overflow-x-visible py-2 space-x-3 md:space-x-0 md:space-y-3">
          {rooms.map(room => (
            <motion.button
              key={room.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onRoomChange(room.id)}
              className={`room-nav-item flex items-center hover:bg-white/10 transition rounded-xl px-3 py-2 min-w-[120px] md:min-w-0 ${activeRoom === room.id ? 'bg-dark-200' : 'bg-white/5'}`}
            >
              <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center ${activeRoom === room.id ? 'bg-primary/20' : ''}`}>
                <room.icon className={`${activeRoom === room.id ? 'text-primary' : ''}`} size={18} />
              </div>
              <span className="ml-2 text-sm">{room.name}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        {/* Modes Control */}
        <div className="glass rounded-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium">Home Mode</h3>
            <span className="text-xs text-success">Active</span>
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-dark-200 hover:bg-dark-100 transition">
              Home
            </button>
            <button className="flex-1 py-2 rounded-lg text-xs font-medium hover:bg-dark-200 transition">
              Away
            </button>
            <button className="flex-1 py-2 rounded-lg text-xs font-medium hover:bg-dark-200 transition">
              Night
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center mt-4 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-medium">
            JS
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">John Smith</h3>
            <p className="text-xs opacity-60">Admin</p>
          </div>
          <button className="ml-auto w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
