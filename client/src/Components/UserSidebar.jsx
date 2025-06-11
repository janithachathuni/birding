import React from 'react';
import { Link } from 'react-router-dom';
import { Origami } from 'lucide-react';

const UserSidebar = () => {
  return (
    <div className="w-64 min-h-screen pt-4 pb-4 pl-14 border-r border-amber-100">
         {/* bg-[#553F2D]/50 */}
      <ul className="space-y-1 w-full text-left">
        <li className='text-center'>
          <Link to="/">Kurullo</Link>
        </li>
        <br/>

          <li className="hover:bg-amber-50 p-2 rounded transition-colors">
                    <span className='flex'>
            <Origami className="h-5 w-5 text-gray-600"/>
            <Link to="/dashboard" className="block w-full">Your Feed</Link>
                    </span>
          </li>

        
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/blog" className="block w-full">Blog</Link>
        </li>
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/checklists" className="block w-full">Checklists</Link>
        </li>
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/trips" className="block w-full">Trips</Link>
        </li>
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/forum" className="block w-full">Forum</Link>
        </li>
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/settings" className="block w-full">Settings</Link>
        </li>
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/profile" className="block w-full">Profile</Link>
        </li>
        <li className="hover:bg-amber-50 p-2 rounded transition-colors">
          <Link to="/logout" className="block w-full">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebar;