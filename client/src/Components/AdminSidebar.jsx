import React from 'react';
import { 
  FiHome, 
  FiBarChart2, 
  FiShield, 
  FiUsers, 
  FiBell, 
  FiMonitor, 
  FiSettings,
  FiLogOut,
  FiDatabase
} from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';


const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    //clear all user data from local storage
    localStorage.removeItem('user');
    //redirected to login page
    navigate('/login');
  }

const navItems = [
  { path: '/admin/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
  { path: '/admin/bird-data', icon: <FiDatabase size={20} />, label: 'Bird Database' },
  { path: '/admin/statistics', icon: <FiBarChart2 size={20} />, label: 'Statistics' },
  { path: '/admin/content-moderation', icon: <FiShield size={20} />, label: 'Content Moderation' },
  { path: '/admin/manage-moderators', icon: <FiUsers size={20} />, label: 'Manage Moderators' },
  { path: '/admin/notifications', icon: <FiBell size={20} />, label: 'Notifications' },
  { path: '/admin/advertisements', icon: <FiMonitor size={20} />, label: 'Advertisements' },
  { path: '/admin/settings', icon: <FiSettings size={20} />, label: 'Settings' },
];


  return (
    <div className="fixed top-0 left-0 h-screen w-[20%] bg-white flex flex-col border-r border-gray-200">
      {/* Sidebar Header */}
      <div className="p-4 -mb-5">
        <NavLink to="/" className="flex justify-center">
          <h2 className="text-2xl font-extrabold text-[#143829]">Kurullo</h2>
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
                `flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
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
        <button 
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-[#f5f6f5] hover:text-[#506142] rounded-lg transition-colors">
          <FiLogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;
