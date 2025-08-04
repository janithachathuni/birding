import React from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiCheckSquare, 
  FiMap, 
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useLocation, NavLink } from 'react-router-dom';

const UserSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/birder/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    { path: '/birder/blog', icon: <FiFileText size={20} />, label: 'Blog' },
    { path: '/birder/checklists', icon: <FiCheckSquare size={20} />, label: 'Checklists' },
    { path: '/birder/trips', icon: <FiMap size={20} />, label: 'Trips' },
    { path: '/birder/notifications', icon: <FiBell size={20} />, label: 'Notifications' },
    { path: '/birder/forum', icon: <FiMessageSquare size={20} />, label: 'Forum' },
    { path: '/birder/settings', icon: <FiSettings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-4 -mb-5">
        <NavLink to="/" className="flex justify-center">
          <h2 className="text-2xl font-extrabold text-[#506142]">Kurullo</h2>
        </NavLink>
      </div>
      

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-3 py-2 rounded-lg transition-colors ${isActive 
                  ? 'bg-[#f5f6f5] text-[#425137]' 
                  : 'text-gray-700 hover:bg-[#f5f6f5] hover:text-[#506142]'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      
      {/* Logout at bottom */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
          <FiLogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;