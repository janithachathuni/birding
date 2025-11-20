import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarChecklist";

const checklistOne = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className=" w-full rounded-lg">
          <div className="border-b border-gray-300 p-6 flex items-center">
            <FaArrowLeft className="mr-4 cursor-pointer"/>
            {/* profile picture */}
            <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
            {/* heading */}
            <p className="text-lg text-[#143829] font-semibold">Thalangama Lake</p>
          </div>
          
          {/* search area */}
          <div className="p-4 m-4 rounded-lg bg-gray-100">
            One checklist
          </div>

          {/* checklist content */}
          <div className="p-4 m-4 rounded-lg bg-gray-100">
            One checklist
          </div>
        </div>
      </div>
      <UserSidebarRight />
    </div>
  );
};

export default checklistOne;