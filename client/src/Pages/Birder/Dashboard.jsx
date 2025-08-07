import React, { useState } from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import littlegrebe from "../../assets/littlegrebe.jpg";

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

  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen bg-white">
      {showCopyMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          Copying images is not allowed
        </div>
      )}

      {isFullScreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={toggleFullScreen}
          >
            <X size={32} />
          </button>
          <img
            src={littlegrebe}
            alt="Full screen view"
            className="max-h-screen max-w-screen object-contain select-none"
            onClick={toggleFullScreen}
            onContextMenu={handleCopy}
            onDragStart={preventDragHandler}
          />
        </div>
      )}

      <UserSidebar />

      {/* Main content with margins for fixed sidebars */}
      <div className="flex flex-1 p-4 ml-[20%] mr-[25%]">
        {/* Left panel - Feed (full width here since no right panel) */}
        <div className="w-full ">
          {/* Tabs */}
          <div className="flex border-b border-amber-200">
            <button className="w-1/2 py-4 text-center text-xl font-medium hover:bg-amber-50">
              For You
            </button>
            <button className="w-1/2 py-4 text-center text-xl font-medium hover:bg-amber-50 border-l border-amber-200">
              Following
            </button>
          </div>

          {/* Post card */}
          <div className="m-6 rounded-lg shadow bg-white overflow-hidden">
            <img
              src={littlegrebe}
              alt="Post content"
              className="w-full h-auto cursor-pointer select-none"
              onClick={toggleFullScreen}
              onContextMenu={handleCopy}
              onDragStart={preventDragHandler}
            />
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
              <p className="text-gray-800 font-semibold">Hewrie Sharky</p>
              <div className="flex gap-4">
                <MessageCircle className="cursor-pointer text-gray-600 hover:text-black" />
                <Heart
                  onClick={handleLikeClick}
                  className={`cursor-pointer transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-black"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserSidebarRight />
    </div>
  );
};

export default Dashboard;
