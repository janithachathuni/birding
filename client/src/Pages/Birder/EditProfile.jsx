import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import bannerimg from "../../Assets/bannerimg.png";
import profileimg from "../../Assets/default_profile_pic.png";

const EditProfile = ({ userId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: null,
    bannerPic: null,
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [previewUrls, setPreviewUrls] = useState({
    profilePic: null,
    bannerPic: null,
  });

  const [currentImages, setCurrentImages] = useState({
    profilePic: null,
    bannerPic: null,
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) {
          alert("User session not found. Please log in again.");
          return;
        }

        const response = await fetch(`http://localhost:3001/api/profiles/${userData.id}`);
        
        if (response.ok) {
          const data = await response.json();
          const profile = data.profile;
          
          setFormData({
            name: profile.displayName || "",
            bio: profile.bio || "",
            profilePic: null,
            bannerPic: null,
          });

          // Store the raw paths from database (e.g., "uploads/profiles/...")
          setCurrentImages({
            profilePic: profile.profilePic || null,
            bannerPic: profile.bannerPic || null,
          });

        } else if (response.status === 404) {
          console.log("Profile not found, using empty form");
        } else {
          console.error("Error loading profile:", response.statusText);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));

      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewUrls((prev) => ({
          ...prev,
          [type]: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        alert("User session not found. Please log in again.");
        return;
      }

      const profileFormData = new FormData();
      profileFormData.append("displayName", formData.name);
      profileFormData.append("bio", formData.bio);
      profileFormData.append("userId", userData.id);

      if (formData.profilePic) {
        profileFormData.append("profilePic", formData.profilePic);
      }
      if (formData.bannerPic) {
        profileFormData.append("bannerPic", formData.bannerPic);
      }

      const response = await fetch(`http://localhost:3001/api/profiles/edit/${userData.id}`, {
        method: "PUT",
        body: profileFormData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated successfully");
        if (onSuccess) onSuccess(data.profile);
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get banner image - matches Blog.jsx pattern
  const getBannerImage = () => {
    // 1. If user just selected a new image, show the preview
    if (previewUrls.bannerPic) {
      return previewUrls.bannerPic;
    }
    // 2. If there's an existing image from database, show it with server URL
    if (currentImages.bannerPic) {
      return `http://localhost:3001/${currentImages.bannerPic}`;
    }
    // 3. Otherwise show default
    return bannerimg;
  };

  // Helper function to get profile image - matches Blog.jsx pattern
  const getProfileImage = () => {
    // 1. If user just selected a new image, show the preview
    if (previewUrls.profilePic) {
      return previewUrls.profilePic;
    }
    // 2. If there's an existing image from database, show it with server URL
    if (currentImages.profilePic) {
      return `http://localhost:3001/${currentImages.profilePic}`;
    }
    // 3. Otherwise show default
    return profileimg;
  };

  if (initialLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl p-4 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className=""></h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full max-w-2xl mx-auto"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white w-full">
              {/* Banner image */}
              <div className="h-48 bg-gray-200 relative group">
                <img
                  src={getBannerImage()}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                {/* Overlay with camera */}
                <div className="absolute inset-0 bg-green-800/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <label className="cursor-pointer flex flex-col items-center text-white">
                    <FaCamera size={24} />
                    <span className="text-sm mt-1">Change Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "bannerPic")}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Profile image (half inside banner) */}
                <div className="absolute left-6 bottom-0 translate-y-1/2 group">
                  <div className="relative w-36 h-36">
                    <img
                      src={getProfileImage()}
                      alt="Profile"
                      className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
                    />
                    {/* Overlay with camera */}
                    <div className="absolute inset-0 bg-green-800/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
                      <label className="cursor-pointer flex flex-col items-center text-white">
                        <FaCamera size={20} />
                        <span className="text-xs mt-1">Change</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "profilePic")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile details */}
              <div className="px-6 mt-20">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your display name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2 font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about your birding interests..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-3 mb-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;