import React from 'react';
import UserSidebar from '../../Components/UserSidebar';
import { Check } from 'lucide-react';

const Checklists = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex-1 ml-64 p-4">
        <h1>Checklists</h1>
      </div>
    </div>
  );
};

export default Checklists;