import React from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

const tripOne = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1>One Trip</h1>
        </div>
      </div>
      <UserSidebarRight />
    </div>
  );
};

export default tripOne;