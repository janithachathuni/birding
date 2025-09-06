import React from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

const Base = () => {
  // Try to get the logged-in user from localStorage (after login you should store it there)
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="flex min-h-screen bg-white">
      {/* Show sidebars only if user is logged in */}
      {user && <UserSidebar />}
      
      <div
        className="flex flex-1 p-4ml-[20%] mr-[30%]" 

      >
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1>Content here</h1>
        </div>
      </div>

      {user && <UserSidebarRight />}
    </div>
  );
};

export default Base;
