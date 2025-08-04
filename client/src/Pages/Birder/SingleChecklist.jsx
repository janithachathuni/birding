import React from 'react';
import UserSidebar from '../../Components/UserSidebar';

const SingleChecklist = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex-1 ml-64 p-4">
        <h1>Single checklist view</h1>
      </div>
    </div>
  );
};

export default SingleChecklist;