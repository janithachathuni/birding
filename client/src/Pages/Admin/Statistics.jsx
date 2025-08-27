import React from "react";
import UserSidebar from "../../Components/AdminSidebar";

const Statistics = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1>Statistics</h1>
        </div>
      </div>
    </div>
  );
};

export default Statistics;