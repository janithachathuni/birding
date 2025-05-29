import React from 'react';
import { Link } from 'react-router-dom';

const UserSidebar = () => {
  return (
    <div className="w-64 min-h-screen pt-4 pb-4 pl-14 border-r border-amber-300">
         {/* bg-[#553F2D]/50 */}
      <ul className="space-y-1 w-full text-left">
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard" className="block w-full">Your Feed</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard/blog" className="block w-full">Blog</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard/checklists" className="block w-full">Checklists</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard/trips" className="block w-full">Trips</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard/forum" className="block w-full">Forum</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard/settings" className="block w-full">Settings</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/dashboard/profile" className="block w-full">Profile</Link>
        </li>
        <li className="hover:bg-[#553F2D]/70 p-2 rounded transition-colors">
          <Link to="/logout" className="block w-full">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;