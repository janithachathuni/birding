import React, { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiCheckSquare, 
  FiMap, 
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiPlus
} from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // Use a useEffect hook to get the user from local storage once the component mounts
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.username) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/birder/dashboard', icon: <FiHome size={20} />, label: 'Dashboard' },
    // Conditionally set the blog path based on the user's username
    { 
      path: currentUser ? `/${currentUser.username}` : '/birder/blog', 
      icon: <FiFileText size={20} />, 
      label: 'Blog' 
    },
    { path: '/birder/checklists', icon: <FiCheckSquare size={20} />, label: 'Checklists' },
    { path: '/birder/trips', icon: <FiMap size={20} />, label: 'Trips' },
    { path: '/birder/notifications', icon: <FiBell size={20} />, label: 'Notifications' },
    { path: '/birder/forum', icon: <FiMessageSquare size={20} />, label: 'Forum' },
    { path: '/birder/settings', icon: <FiSettings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-[20%] bg-white flex flex-col border-r border-gray-300">
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
                    ? 'bg-[#f5f6f5] text-[#143829] '
                    : 'text-black hover:bg-[#f5f6f5] hover:text-[#143829]'
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Create Post Button */}
      <div className="p-4">
        <button
          onClick={() => navigate('/create-post')}
          className="flex items-center justify-center w-full px-4 py-3 bg-[#143829] text-white hover:text-[#143829] rounded-lg hover:bg-[white] hover:border-1 hover:border-[#143829] transition-colors"
        >
          <FiPlus size={20} className="mr-2" />
          <span className="font-medium">Create Post</span>
        </button>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-300">
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