import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Upload, Settings, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/dashboard', icon: BarChart2, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
    { to: '/upload', icon: Upload, label: 'Upload Docs' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 h-screen fixed left-0 top-0 border-r border-[#10b981]/20 bg-[#0a1f12]/80 backdrop-blur-xl flex flex-col p-4"
    >
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-lime-500 flex items-center justify-center">
          <span className="text-black font-bold text-lg">🌱</span>
        </div>
        <h1 className="text-xl font-bold text-gradient">Agri RAG</h1>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <link.icon size={20} />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
