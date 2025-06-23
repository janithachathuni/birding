import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, X } from "lucide-react";
import UserSidebar from "../Components/UserSidebar";
import default_profile_pic from "../assets/default_profile_pic.png";
import littlegrebe from "../assets/littlegrebe.jpg";

const Dashboard = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
    return false;
  };

  // Add event listeners to prevent image dragging (which can lead to copying)
  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen">
      {/* Copy message notification */}
      {showCopyMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md z-50">
          Copying images is not allowed
        </div>
      )}

      {/* Full screen overlay */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="absolute top-4 right-4 p-2">
            <X 
              className="text-white cursor-pointer hover:text-gray-300" 
              size={32}
              onClick={toggleFullScreen}
            />
          </div>
          <img 
            src={littlegrebe} 
            className="max-h-screen max-w-screen object-contain select-none" 
            onClick={toggleFullScreen}
            onContextMenu={handleCopy}
            onDragStart={preventDragHandler}
          />
        </div>
      )}

      <UserSidebar />

      {/* Main content area - takes remaining space */}
      <div className="flex flex-1">
        {/* 60% width content */}
        <div className="w-15/20">
          <div className="border-b border-amber-200">
            <span className="flex text-2xl p-4">
              <h1 className="w-1/2 p-4">For you</h1>
              <h1 className="w-1/2 p-4 border-l border-amber-200">
                Following
              </h1>
            </span>
          </div>

          {/* post section */}
          <div className="m-4 border border-black rounded">
            <div>
              <img 
                src={littlegrebe} 
                className="border border-black cursor-pointer select-none"
                onClick={toggleFullScreen}
                onContextMenu={handleCopy}
                onDragStart={preventDragHandler}
              />
              <div className="flex justify-between items-center p-2">
                <p className="flex-1">Hewrie Sharky</p>
                <span className="flex gap-2">
                  <MessageCircle className="cursor-pointer" />
                  <Heart
                    className={`cursor-pointer ${
                      isLiked ? "fill-red-500 text-red-500" : ""
                    }`}
                    onClick={handleLikeClick}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 40% width content */}
        <div className="w-8/20 p-4 border-l border-amber-100">
          <div className="flex p-4">
            <div className="w-1/3">
              <img 
                src={default_profile_pic} 
                className="rounded-full select-none"
                onContextMenu={handleCopy}
                onDragStart={preventDragHandler}
              />
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