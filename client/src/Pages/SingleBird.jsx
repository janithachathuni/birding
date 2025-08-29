import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../Components/UserSidebar";
import AdminSidebar from "../Components/AdminSidebar";
import mapsl from "../assets/mapsl.png";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const birdData = {
  id: 1,
  name: ["Sri Lanka Junglefowl", "Ceylon Junglefowl"],
  sinhala_name: "වළි කුකුළා",
  tamil_name: "இலங்கைக் காட்டுக்கோழி",
  scientific_name: "Gallus lafayettii",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg/500px-Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg",
  frequency: "Very common",
  residency: "Resident",
  endemic: true,
  family: "Phasianidae",
  description:
    "The Sri Lanka Junglefowl is a bird species endemic to Sri Lanka. It is the national bird of the country and is closely related to the Red Junglefowl. The male is brightly colored with orange-red body plumage and dark purple to black wings and tail. The female is much smaller and duller, with brown plumage with white patterning on the lower belly and breast.",
  places: [
    "Sinharaja Forest Reserve",
    "Knuckles Mountain Range",
    "Horton Plains National Park",
    "Yala National Park",
    "Udawalawe National Park",
  ],
};

const SingleBird = () => {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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

  const handleGoBack = () => {
    navigate(-1); // This navigates to the previous page in the browser history
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
                {birdData.name[0]}
              </h1>
              <span className="text-xl text-gray-600 italic">
                {birdData.scientific_name}
              </span>
            </div>
            <div className="mt-2 text-gray-700">
              <p className="mb-1">
                Also known as: {birdData.name.slice(1).join(", ")}
              </p>
              <p>
                {birdData.sinhala_name}, {birdData.tamil_name}
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
                alt={birdData.name[0]}
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
                    src={mapsl}
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

              {birdData.places.length > 0 && (
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
      </div>
    </div>
  );
};

export default SingleBird;