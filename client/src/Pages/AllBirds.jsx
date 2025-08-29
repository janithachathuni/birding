import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserSidebar from "../Components/UserSidebar";
import AdminSidebar from "../Components/AdminSidebar";
import axios from "axios";

const AllBirds = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    //get user data from local storage
    const userData = localStorage.getItem("user");
    if(userData){
        const user = JSON.parse(userData);
        setUserRole(user.role);
        setIsLoggedIn(true);
    }else{
        setIsLoggedIn(false); 
    }
  }, [])

  let SidebarComponent = null;

  if(userRole === "admin"){
    SidebarComponent = AdminSidebar;
  }else if(userRole === "birder"){
    SidebarComponent = UserSidebar;
  }else{
    SidebarComponent = null; //no sidebar if user isnt logged in
  }

  return (
    <div className="flex min-h-screen bg-white">
      {SidebarComponent && <SidebarComponent/>}

      <div className={`flex flex-col flex-1 p-4 ${SidebarComponent ? 'ml-[20%] mr-[30%]' : 'mx-auto max-w-3xl'}`}>
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1>all da birds</h1>
        </div>
      </div>
    </div>
  );
};

export default AllBirds;
