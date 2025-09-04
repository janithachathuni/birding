import React, { useState, useEffect } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import CreateProfile from "../Birder/CreateProfile";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if this is first login and profile not completed
      checkFirstLogin(parsedUser.id);
    } else {
      // If no user data, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const checkFirstLogin = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/profile/check-first-login/${userId}`);
      const data = await response.json();
      
      if (data.isFirstLogin) {
        setShowProfileSetup(true);
      }
    } catch (error) {
      console.error('Error checking first login status:', error);
    }
  };

  const handleProfileComplete = async () => {
    console.log("handleProfileComplete called!"); // Debug log
    try {
      // Update the isFirstLogin status - FIXED PORT TO 3001
      const response = await fetch(`http://localhost:3001/api/profile/complete-setup/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log("API call successful, closing modal"); // Debug log
        setShowProfileSetup(false);
      } else {
        console.error("API call failed, but closing modal anyway");
        // Close modal even if API call fails
        setShowProfileSetup(false);
      }
    } catch (error) {
      console.error('Error completing profile setup:', error);
      // Close modal even on error to prevent user from being stuck
      setShowProfileSetup(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
          <h1>Dashboard</h1>
          {user && <p>Welcome back, {user.username}!</p>}
        </div>
      </div>
      <UserSidebarRight />
      
      {/* Profile Setup Modal */}
      {showProfileSetup && (
        <CreateProfile onComplete={handleProfileComplete} />
      )}
    </div>
  );
};

export default Dashboard;