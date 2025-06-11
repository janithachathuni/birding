import React from "react";
import { Link } from "react-router-dom";
import UserSidebar from "../Components/UserSidebar";
import default_profile_pic from "../assets/default_profile_pic.png";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />

      {/* Main content area - takes remaining space */}
      <div className="flex flex-1">
        {/* 60% width content */}
        <div className="w-15/20">
          {/* blog post photo + design */}

          <div className="border-b border-amber-200">
            {/* posts section heading, first */}
            <span className="flex text-2xl p-4">
              <h1 className="w-1/2  p-4">For you</h1>
              <h1 className="w-1/2  p-4 border-l border-amber-200">
                Following
              </h1>
            </span>
          </div>

          {/* post section, the posts */}

          <div>Hlello</div>
        </div>

        {/* 40% width content */}
        <div className="w-8/20 p-4 border-l border-amber-100">
          {/* Profile area */}
          <div className="flex p-4">
            <div className="w-1/3">
              {/* profile pic area */}
              <img src={default_profile_pic} className="rounded-full" />
            </div>
            <div className="w-2/3">
              <div>@username</div>
              Janitha Chathuni
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
