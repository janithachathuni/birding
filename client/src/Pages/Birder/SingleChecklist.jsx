import React from 'react';
import UserSidebar from '../../Components/UserSidebar';

const SingleChecklist = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[20%]">
        <h1>Single checklist view</h1>
      </div>
    </div>
  );
};

export default SingleChecklist;