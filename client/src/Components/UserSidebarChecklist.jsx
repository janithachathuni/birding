import React from "react";

const UserSidebarChecklist = () => {
  return (
    <div className="fixed top-0 right-0 h-screen w-[30%] bg-white flex flex-col border-l border-gray-300">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Content will go here */}
        Hello hello hello 
      </div>
      
      {/* Sticky footer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <p className="text-xs text-gray-500">© 2025 Kurullo</p>
      </div>
    </div>
  );
};

export default UserSidebarChecklist;