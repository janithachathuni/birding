import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import createprofilebird from "../../Assets/createprofilebird.gif";
import bannerimg from "../../Assets/bannerimg.png";
import default_profile_pic from "../../Assets/default_profile_pic.png";

const CreateProfile = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePic: null,
    bannerPic: null,
  });

  const [previewUrls, setPreviewUrls] = useState({
    profilePic: null,
    bannerPic: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile data:", formData);
    setStep(2);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 2));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Fixed size box but 1cm margin on top and bottom */}
      <div className="relative bg-white rounded-2xl p-6 w-full justify-center max-w-2xl h-[calc(100vh-1cm)] flex flex-col">
        {/* Navigation Arrows */}
        {step > 0 && (
          <button
            onClick={prevStep}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full shadow-md"
          >
            &lt;
          </button>
        )}
        {step < 2 && (
          <button
            onClick={nextStep}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 w-10 h-10 flex items-center justify-center rounded-full shadow-md"
          >
            &gt;
          </button>
        )}

        {/* Slide Content */}
        <div className="flex-1 flex flex-col justify-center overflow-y-auto">
          {step === 0 && (
            <div className="text-center px-6">
              <h2 className="text-2xl text-[#606c38] font-bold mb-4">Welcome to your new Kurullo account!</h2>
              <p className="text-gray-600 mb-6">
                Let’s set up your birding profile to get started.
              </p>
              <button
                onClick={nextStep}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
              >
                Start
              </button>
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center max-w-3xl w-full"
            >
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white w-full">
                {/* Banner image */}
                <div className="h-48 bg-gray-200 relative group">
                  <img
                    src={
                      previewUrls.bannerPic ||
                      bannerimg
                    }
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay with camera */}
                  <div className="absolute inset-0 bg-green-800/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <label className="cursor-pointer flex flex-col items-center text-white">
                      <FaCamera size={24} />
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
                        src={
                          previewUrls.profilePic ||
                          default_profile_pic
                        }
                        alt="Profile"
                        className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
                      />
                      {/* Overlay with camera */}
                      <div className="absolute inset-0 bg-green-800/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition">
                        <label className="cursor-pointer flex flex-col items-center text-white">
                          <FaCamera size={20} />
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
                  <div className="mb-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-1"
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-1 font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div className="flex justify-end mb-3">
                    <button
                      type="submit"
                      className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center px-6">
              <img
                src={createprofilebird}
                className="items-center mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold mb-4">
                Profile Created Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                You’re all set. Would you like to add your first birding post
                now?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={onComplete}
                  className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800"
                >
                  Yes, Create Post
                </button>
                <button
                  onClick={onComplete}
                  className="bg-gray-200 px-6 py-2 rounded-full hover:bg-gray-300"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center mt-1 gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                step === i ? "bg-black" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
