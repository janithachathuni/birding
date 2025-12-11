import React, { useState, useEffect } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import CreateProfile from "../Birder/CreateProfile";
import CreatePost from "../Birder/CreatePost";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const Dashboard = () => {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Check first login via API
      checkFirstLogin(parsedUser.id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const checkFirstLogin = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/profile/check-first-login/${userId}`
      );
      if (response.data.isFirstLogin) {
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error("Error checking first login status:", error);
    }
  };

  const handleProfileComplete = async () => {
    console.log("handleProfileComplete called!"); // Debug log
    try {
      const response = await axios.put(
        `http://localhost:3001/api/profile/complete-setup/${user.id}`
      );
      if (response.status === 200) {
        console.log("Profile setup completed successfully");
      } else {
        console.warn("API call completed but status not OK");
      }
    } catch (error) {
      console.error("Error completing profile setup:", error);
    } finally {
      // Close modal regardless of success or failure
      setShowProfileSetup(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-col flex-1 ml-[20%] mr-[30%]">
        <div className="flex items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center gap-8">
            <button className="px-4 py-4 font-semibold hover:bg-gray-50 transition-colors border-b-4 border-[#143829]">
              For You
            </button>
            <button className="px-4 py-4 font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
              Following
            </button>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-10 h-10 bg-[#143829] hover:bg-[#0f2a1f] text-white rounded-full flex items-center justify-center transition-colors"
          >
            <FaPlus size={18} />
          </button>
        </div>
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          {user && (
            <p className="text-gray-700">Welcome back, {user.username}!</p>
          )}
        </div>
      </div>
      <UserSidebarRight />

      {/* Profile Setup Modal */}
      {showProfileSetup && <CreateProfile onComplete={handleProfileComplete} />}

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onComplete={() => setShowCreatePost(false)} />
      )}
    </div>
  );
};

export default Dashboard;