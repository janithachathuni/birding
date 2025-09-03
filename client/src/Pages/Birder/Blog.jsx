import React from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//images import
import bannerimg from "../../assets/bannerimg.png";
import profilepic from "../../assets/default_profile_pic.png";

const Blog = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className=" bg-[white] w-full rounded-lg">
          hello
          {/* post area */}
          <div className="p-4">
            <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
              <h1>blog</h1>
            </div>
          </div>
        </div>
      </div>
      <UserSidebarRight />
    </div>
  );
};

export default Blog;
