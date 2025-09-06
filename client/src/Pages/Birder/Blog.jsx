import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import EditProfile from "./EditProfile";
import axios from "axios";

//images import
import bannerimg from "../../assets/bannerimg.png";
import profileimg from "../../assets/default_profile_pic.png";

//import posts
import Posts from "./Posts"

const Blog = () => {
  const { username } = useParams(); // Get username from URL parameter
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");

  // Profile and user state
  const [profile, setProfile] = useState(null);
  const [profileUser, setProfileUser] = useState(null); // User whose profile we're viewing
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userExists, setUserExists] = useState(true);
  const [loading, setLoading] = useState(true);

  // Get current logged-in user
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;
  const currentUserId = currentUser?.id;

  // Determine if this is own profile or viewing someone else's
  const isViewingOwnProfile =
    !username || (username && username === currentUser?.username);
  const targetUsername = username || currentUser?.username;

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        setLoading(true);

        // Don't try to fetch if username looks like an error route
        if (username === "404" || username === "error" || username === "*") {
          setUserExists(false);
          return;
        }

        // Determine the username to fetch
        const targetUsername = username || currentUser?.username;

        if (targetUsername) {
          console.log(`Fetching user by username: ${targetUsername}`);

          // Make the API call
          const userResponse = await axios.get(
            `http://localhost:3001/api/users/username/${targetUsername}`
          );

          // Correctly set the state with the data from the backend
          setProfileUser(userResponse.data.user);
          setProfile(userResponse.data.profile);
          setIsOwnProfile(targetUsername === currentUser?.username);
          setUserExists(true);
        }
      } catch (error) {
        console.error("Error fetching user/profile:", error);
        if (error.response && error.response.status === 404) {
          // Handle the 404 case correctly
          setUserExists(false);
        } else {
          // Handle other errors
          console.error("An unexpected error occurred:", error);
          setUserExists(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProfile();
  }, [username, currentUserId]);

  // Redirect to 404 if user doesn't exist
  useEffect(() => {
    if (!loading && !userExists) {
      navigate("/404", { replace: true });
    }
  }, [userExists, loading, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (!userExists) return null; // Will redirect to 404
  if (!profileUser || !profile)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Profile not found
      </div>
    );

  const handleCopyLink = () => {
    const url = username
      ? `${window.location.origin}/${username}`
      : window.location.href;
    navigator.clipboard.writeText(url);
    setShowMenu(false);
    alert("Profile link copied to clipboard!");
  };

  const handleReport = () => {
    setShowMenu(false);
    alert("Report submitted. We'll review this account.");
  };

  const handleBlock = () => {
    setShowMenu(false);
    alert("This account has been blocked.");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* show sidebar only when logged in */}
      {user && <UserSidebar />}

      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className="bg-[white] w-full rounded-lg">
          {/* Profile Header */}
          <div className="flex items-center max-w-3xl w-full">
            <div className="overflow-hidden bg-white w-full">
              {/* Banner image with action buttons */}
              <div className="h-48 bg-gray-200 relative group">
                {profile.bannerPic ? (
                  <img
                    src={`http://localhost:3001/${profile.bannerPic}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={bannerimg} className="w-full h-full object-cover" />
                )}

                {/* Action buttons in top right corner */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {isOwnProfile && (
                    <button
                      className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition text-sm"
                      onClick={() => setShowEditProfile(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                  <div className="relative">
                    <button
                      className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={handleCopyLink}
                        >
                          Copy Link
                        </button>
                        {!isOwnProfile && (
                          <>
                            <button
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              onClick={handleReport}
                            >
                              Report
                            </button>
                            <button
                              className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              onClick={handleBlock}
                            >
                              Block Account
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile image */}
                <div className="absolute left-6 bottom-0 translate-y-1/2 group">
                  <div className="relative w-36 h-36">
                    {profile.profilePic ? (
                      <img
                        src={`http://localhost:3001/${profile.profilePic}`}
                        className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
                      />
                    ) : (
                      <img
                        src={profileimg}
                        className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Profile details */}
              <div className="px-6 mt-20">
                {/* Name & Username */}
                <div>
                  <p className="text-2xl font-bold text-black">
                    {profile.displayName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    @{profileUser.username}
                  </p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-gray-800 text-sm leading-relaxed max-w-xl">
                  {profile.bio}
                </p>
                <br />

                {/* Followers & Following */}
                <div className="flex justify-left gap-6 text-sm mb-2 text-gray-700">
                  <p>
                    <span className="font-semibold">
                      {profile.followers ? profile.followers.length : 0}
                    </span>{" "}
                    Followers
                  </p>
                  <p>
                    <span className="font-semibold">
                      {profile.following ? profile.following.length : 0}
                    </span>{" "}
                    Following
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab selection */}
          <div className="flex justify-around border-b border-gray-200">
            {["Posts", "Articles", "Likes"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-center font-medium transition ${
                  activeTab === tab
                    ? "text-[#143829] border-b-3 border-[#143829]"
                    : "text-gray-500 hover:text-[#143829]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content area - now empty, can be populated based on activeTab */}
          <div className="">
            {activeTab === "Posts" && (
              <Posts/>
            )}
            {activeTab === "Articles" && (
              <div className="text-center text-gray-500">
                No articles yet
              </div>
            )}
            {activeTab === "Likes" && (
              <div className="text-center text-gray-500">
                No likes yet
              </div>
            )}
          </div>
          
        </div>
      </div>

      {user && <UserSidebarRight />}

      {/* Edit Profile Modal - only show if it's own profile */}
      {showEditProfile && isOwnProfile && (
        <EditProfile
          userId={currentUserId}
          onClose={() => setShowEditProfile(false)}
          onSuccess={(updatedProfile) => {
            setProfile(updatedProfile);
            localStorage.setItem("profile", JSON.stringify(updatedProfile));
            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
};

export default Blog;