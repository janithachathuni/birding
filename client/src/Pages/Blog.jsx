import React from 'react';
import {Link} from 'react-router-dom';
import UserSidebar from '../Components/UserSidebar';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <UserSidebar/>
      
      {/* Main content area - takes remaining space */}
      <div className="flex flex-1">
        {/* 60% width content */}
        <div className='w-15/20 p-4'>
          Make your first post!
        </div>

        {/* 40% width content */}
        <div className='w-8/20 p-4 border-l border-amber-100'>
          Profile area
        </div>
      </div>
    </div>
  );
};

export default Dashboard;