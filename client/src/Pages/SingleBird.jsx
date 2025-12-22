import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserSidebar from "../Components/UserSidebar";
import AdminSidebar from "../Components/AdminSidebar";
import mapsl from "../assets/mapsl.png";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const SingleBird = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [birdData, setBirdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPhotos, setUserPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams(); // Get bird ID from URL

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch bird data when component mounts
  useEffect(() => {
    const fetchBirdData = async () => {
      if (!id) {
        setError("No bird ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3001/api/birds/get/${id}`);
        setBirdData(response.data);
      } catch (err) {
        console.error("Error fetching bird data:", err);
        setError(err.response?.data?.message || "Failed to fetch bird data");
      } finally {
        setLoading(false);
      }
    };

    fetchBirdData();
  }, [id]);

  // Fetch user photos tagged with this bird
  useEffect(() => {
    const fetchUserPhotos = async () => {
      if (!birdData) return;

      try {
        setPhotosLoading(true);
        const response = await axios.get("http://localhost:3001/api/posts");
        
        if (response.data.success) {
          const allPosts = response.data.data;
          const photosWithBird = [];
          
          allPosts.forEach(post => {
            post.images.forEach(image => {
              const hasBird = image.birds?.some(bird => 
                bird.taggedName === birdData.primaryName || 
                bird.taggedName === birdData.scientificName
              );
              
              if (hasBird) {
                photosWithBird.push({
                  imageUrl: image.imageUrl,
                  postId: post._id,
                  username: post.user?.username,
                  userId: post.user?._id,
                  caption: post.caption,
                  createdAt: post.createdAt
                });
              }
            });
          });
          
          setUserPhotos(photosWithBird);
        }
      } catch (err) {
        console.error("Error fetching user photos:", err);
      } finally {
        setPhotosLoading(false);
      }
    };

    fetchUserPhotos();
  }, [birdData]);

  const handleGoBack = () => {
    navigate(-1); // This navigates to the previous page in the browser history
  };

  const handlePhotoClick = (username, postId) => {
    navigate(`/${username}/${postId}`);
  };

  // Determine which sidebar to show based on user role
  let SidebarComponent = null;

  if (userRole === "admin") {
    SidebarComponent = AdminSidebar;
  } else if (userRole === "birder") {
    SidebarComponent = UserSidebar;
  } else {
    SidebarComponent = null; // no sidebar if not logged in
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[white]">
        {SidebarComponent && <SidebarComponent />}
        <div className={`flex flex-col flex-1 p-4 ${SidebarComponent ? 'ml-[20%] mr-[25%]' : 'mx-auto max-w-3xl'}`}>
          <div className="bg-[#f5f6f5] p-6 rounded-xl w-full flex items-center justify-center min-h-[400px]">
            <div className="text-gray-600">Loading bird data...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-[white]">
        {SidebarComponent && <SidebarComponent />}
        <div className={`flex flex-col flex-1 p-4 ${SidebarComponent ? 'ml-[20%] mr-[25%]' : 'mx-auto max-w-3xl'}`}>
          <button
            onClick={handleGoBack}
            className="self-start mb-4 p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
          >
            <FaArrowLeft />
          </button>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  // No bird data
  if (!birdData) {
    return (
      <div className="flex min-h-screen bg-[white]">
        {SidebarComponent && <SidebarComponent />}
        <div className={`flex flex-col flex-1 p-4 ${SidebarComponent ? 'ml-[20%] mr-[25%]' : 'mx-auto max-w-3xl'}`}>
          <button
            onClick={handleGoBack}
            className="self-start mb-4 p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
          >
            <FaArrowLeft />
          </button>
          <div className="bg-[#f5f6f5] p-6 rounded-xl w-full">
            <p className="text-gray-600">Bird not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[white]">
      {SidebarComponent && <SidebarComponent />}

      <div className={`flex flex-col flex-1 p-4 ${SidebarComponent ? 'ml-[20%] mr-[25%]' : 'mx-auto max-w-3xl'}`}>
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="self-start mb-4 p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
        >
          <FaArrowLeft />
        </button>

        {/* Main Content Container */}
        <div className="bg-[#f5f6f5] p-6 rounded-xl w-full space-y-8">
          {/* Header Area - Left Aligned */}
          <div className="mb-6">
            <div className="flex items-baseline">
              <h1 className="text-2xl font-bold text-gray-900 mr-2">
                {birdData.primaryName}
              </h1>
              <span className="text-xl text-gray-600 italic">
                {birdData.scientificName}
              </span>
            </div>
            <div className="mt-2 text-gray-700">
              {birdData.otherNames && birdData.otherNames.length > 0 && (
                <p className="mb-1">
                  Also known as: {birdData.otherNames.join(", ")}
                </p>
              )}
              <p>
                {birdData.sinhalaName && `${birdData.sinhalaName}`}
                {birdData.sinhalaName && birdData.tamilName && ", "}
                {birdData.tamilName && `${birdData.tamilName}`}
              </p>
            </div>
          </div>

          {/* Bird Image - Centered with padding */}
          <div className="relative mb-8 px-[15px] flex justify-center">
            <div className="relative">
              {birdData.endemic && (
                <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  ENDEMIC
                </div>
              )}
              <img
                src={birdData.image}
                alt={birdData.primaryName}
                className="w-full max-w-3xl h-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Details Section - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column - Map, Family, Frequency, Residency */}
            <div className="md:col-span-1 space-y-6">
              {/* Habitat Map - Square and smaller */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  HABITAT MAP
                </h3>
                <div className="w-40 h-40 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={birdData.habitatMap || mapsl}
                    alt="Habitat Map"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  FAMILY
                </h3>
                <p className="text-gray-800">{birdData.family}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  FREQUENCY
                </h3>
                <p className="text-gray-800">{birdData.frequency}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  RESIDENCY STATUS
                </h3>
                <p className="text-gray-800">{birdData.residency}</p>
              </div>
            </div>

            {/* Right Column - Description and Places (2/3 width) */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  DESCRIPTION
                </h3>
                <p className="text-gray-800">{birdData.description}</p>
              </div>

              {birdData.places && birdData.places.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    FREQUENTLY SPOTTED IN
                  </h3>
                  <p className="text-gray-800">{birdData.places.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Photos Section */}
        <div className="mt-4 bg-[#f5f6f5] p-4 rounded-xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Community Photos
          </h2>
          
          {photosLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading photos...</p>
            </div>
          ) : userPhotos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No photos have been uploaded for this bird yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {userPhotos.map((photo, index) => (
                <div
                  key={index}
                  onClick={() => handlePhotoClick(photo.username, photo.postId)}
                  className="group relative aspect-square bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow cursor-pointer"
                >
                  <img
                    src={`http://localhost:3001${photo.imageUrl}`}
                    alt={`Photo by ${photo.username}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-medium">
                      @{photo.username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleBird;