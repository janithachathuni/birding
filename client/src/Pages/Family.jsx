import React, {useState, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import UserSidebar from '../Components/UserSidebar'
import AdminSidebar from '../Components/AdminSidebar'
import axios from 'axios'

const Family = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1>bird family</h1>
        </div>
      </div>
    </div>
  );
}

export default Family