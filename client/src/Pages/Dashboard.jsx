import React from 'react';
import {Link} from 'react-router-dom';
import UserSidebar from '../Components/UserSidebar';


const Dashboard = () => {
  return (
    <div className="flex">
      <UserSidebar/>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
