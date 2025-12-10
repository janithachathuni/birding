import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FaCamera, FaTimes, FaSearch } from "react-icons/fa";
import axios from "axios";

const CreatePost = ({ onComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [tagInputs, setTagInputs] = useState({});
  const [loading, setLoading] = useState(false);
  const [birdSuggestions, setBirdSuggestions] = useState({});
  const [searching, setSearching] = useState({});
  const [showSearchResults, setShowSearchResults] = useState({});

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [photos]);

  // Improved search function from checklist page
  const searchBirds = async (term, photoId) => {
    if (!term.trim()) {
      setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
      setShowSearchResults((prev) => ({ ...prev, [photoId]: false }));
      return;
    }

    try {
      setSearching((prev) => ({ ...prev, [photoId]: true }));
      console.log("Searching for:", term);

      const response = await axios.get("http://localhost:3001/api/birds/get");

      console.log("API Response:", response);
      console.log("Birds data:", response.data);

      const birds = Array.isArray(response.data)
        ? response.data
        : response.data.birds || [];
      console.log("Processed birds array:", birds.length, "birds found");

      const searchLower = term.toLowerCase().trim();

      const filtered = birds.filter((bird) => {
        if (!bird.primaryName) return false;

        // Check primary name
        if (bird.primaryName.toLowerCase().includes(searchLower)) return true;

        // Check other names
        if (bird.otherNames && Array.isArray(bird.otherNames)) {
          if (
            bird.otherNames.some(
              (name) =>
                name &&
                typeof name === "string" &&
                name.toLowerCase().includes(searchLower)
            )
          )
            return true;
        }

        // Check scientific name
        if (bird.scientificName?.toLowerCase().includes(searchLower))
          return true;

        // Check Sinhala name
        if (bird.sinhalaName?.toLowerCase().includes(searchLower)) return true;

        // Check Tamil name
        if (bird.tamilName?.toLowerCase().includes(searchLower)) return true;

        return false;
      });

      // Sort by relevance
      const sorted = filtered.sort((a, b) => {
        const aNameMatch = a.primaryName?.toLowerCase() === searchLower;
        const bNameMatch = b.primaryName?.toLowerCase() === searchLower;

        // Exact match on primary name gets highest priority
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        // Then sort alphabetically
        return a.primaryName.localeCompare(b.primaryName);
      });

      const results = sorted.slice(0, 10);
      setBirdSuggestions((prev) => ({ ...prev, [photoId]: results }));
      setShowSearchResults((prev) => ({
        ...prev,
        [photoId]: results.length > 0,
      }));
      setSearching((prev) => ({ ...prev, [photoId]: false }));

      console.log(
        "Search results for photo",
        photoId,
        ":",
        results.length,
        "results"
      );
    } catch (err) {
      console.error("Error searching birds:", err);
      console.error("Error details:", err.response?.data);
      setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
      setShowSearchResults((prev) => ({ ...prev, [photoId]: false }));
      setSearching((prev) => ({ ...prev, [photoId]: false }));
    }
  };

  // Debounced search with better handling
  const handleTagInputChange = (photoId, value) => {
    setTagInputs((prev) => ({ ...prev, [photoId]: value }));

    // Show suggestions if typing
    if (value.trim() && !showSearchResults[photoId]) {
      setShowSearchResults((prev) => ({ ...prev, [photoId]: true }));
    }

    // Debounce the search
    const debounce = setTimeout(() => {
      if (value.trim()) {
        searchBirds(value, photoId);
      } else {
        setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
        setShowSearchResults((prev) => ({ ...prev, [photoId]: false }));
      }
    }, 300);

    return () => clearTimeout(debounce);
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.slice(0, 7 - photos.length).map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
      birds: [],
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newPhotos = [...photos];
    const draggedPhoto = newPhotos[draggedIndex];
    newPhotos.splice(draggedIndex, 1);
    newPhotos.splice(dropIndex, 0, draggedPhoto);

    setPhotos(newPhotos);
    setDraggedIndex(null);
  };

  const removePhoto = (photoId) => {
    const photoToRemove = photos.find((p) => p.id === photoId);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setBirdSuggestions((prev) => {
      const newSuggestions = { ...prev };
      delete newSuggestions[photoId];
      return newSuggestions;
    });
    setShowSearchResults((prev) => {
      const newResults = { ...prev };
      delete newResults[photoId];
      return newResults;
    });
  };

  const addTagToPhoto = (photoId, bird = null) => {
    const tag = tagInputs[photoId] || "";
    const trimmedTag = tag.trim();

    if (!bird && !trimmedTag) return;

    const photo = photos.find((p) => p.id === photoId);

    if (!photo) return;

    // Check if bird already exists for this photo
    if (bird) {
      // Adding from suggestions
      if (photo.birds.some((b) => b.birdId === bird._id)) {
        alert(`"${bird.primaryName}" is already tagged in this photo`);
        return;
      }

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? {
                ...p,
                birds: [
                  ...p.birds,
                  {
                    birdId: bird._id,
                    name: bird.primaryName,
                    scientificName: bird.scientificName || "",
                    taggedName: bird.primaryName,
                    nameType: "primaryName",
                  },
                ],
              }
            : p
        )
      );
    } else {
      // Free text entry (for when bird doesn't exist in database)
      if (photo.birds.some((b) => b.name === trimmedTag)) {
        alert(`"${trimmedTag}" is already tagged in this photo`);
        return;
      }

      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? {
                ...p,
                birds: [
                  ...p.birds,
                  {
                    name: trimmedTag,
                    scientificName: "",
                    isCustom: true,
                  },
                ],
              }
            : p
        )
      );
    }

    setTagInputs((prev) => ({ ...prev, [photoId]: "" }));
    setBirdSuggestions((prev) => ({ ...prev, [photoId]: [] }));
    setShowSearchResults((prev) => ({ ...prev, [photoId]: false }));
  };

  const removeTagFromPhoto = (photoId, birdToRemove) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? {
              ...p,
              birds: p.birds.filter((bird) =>
                bird.birdId
                  ? bird.birdId !== birdToRemove.birdId
                  : bird.name !== birdToRemove.name
              ),
            }
          : p
      )
    );
  };

  const handleCreatePost = async () => {
    if (photos.length === 0) {
      alert("Please add at least one photo");
      return;
    }

    // Validate that each photo has at least one bird tag
    for (const photo of photos) {
      if (!photo.birds || photo.birds.length === 0) {
        alert(`Please add at least one bird species to each photo`);
        return;
      }
    }

    setLoading(true);

    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        alert("Please login to create a post");
        return;
      }

      const user = JSON.parse(userData);
      console.log("User from localStorage:", user); // DEBUG: Check what's in user object

      // Get user ID - check your localStorage to see if it's _id or id
      const userId = user._id || user.id;
      console.log("User ID:", userId); // DEBUG: Make sure we have the ID

      // Prepare FormData for file upload
      const formData = new FormData();

      // Add images files
      photos.forEach((photo) => {
        formData.append("images", photo.file);
      });

      // Prepare images data with bird tags
      const imagesData = photos.map((photo) => ({
        birds: photo.birds.map((bird) => {
          if (bird.birdId) {
            return {
              birdId: bird.birdId,
              taggedName: bird.taggedName || bird.name,
              nameType: bird.nameType || "primaryName",
            };
          } else {
            return {
              taggedName: bird.name,
              nameType: "custom",
              isCustom: true,
            };
          }
        }),
        location: photo.location || null,
      }));

      // Add other post data - INCLUDING userId
      formData.append("userId", userId); // ADD THIS LINE!
      formData.append("caption", description);
      formData.append("hashtags", JSON.stringify([]));
      formData.append("imagesData", JSON.stringify(imagesData));

      console.log("FormData being sent - userId:", userId); // DEBUG

      // Make API call to create post
      const response = await axios.post(
        "http://localhost:3001/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // NO Authorization header needed since you don't use JWT
          },
        }
      );

      if (response.data.success) {
        onComplete?.();
      } else {
        throw new Error(response.data.error || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert(
        error.response?.data?.error || error.message || "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (photos.length === 0 && description.trim() === "") {
      onComplete?.();
    } else {
      setShowDiscardConfirm(true);
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const searchContainers = document.querySelectorAll(".search-container");
      let clickedOutside = true;

      searchContainers.forEach((container) => {
        if (container.contains(e.target)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        // Close all search results
        const newState = {};
        Object.keys(showSearchResults).forEach((key) => {
          newState[key] = false;
        });
        setShowSearchResults(newState);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-8 px-4">
      <div className="relative bg-[#F5F6F5] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <button
            onClick={handleDiscard}
            className="text-gray-600 hover:text-gray-900 p-2"
            disabled={loading}
          >
            <FaTimes size={20} />
          </button>

          <button
            onClick={handleCreatePost}
            disabled={photos.length === 0 || loading}
            className="bg-[#143829] hover:bg-[#143829] text-white px-8 py-2 rounded-full text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F5F6F5] rounded-b-2xl">
          {/* Photo Upload */}
          <div className="mb-4 bg-white rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
              <FaCamera size={22} className="text-gray-700" />
              <span className="text-md font-normal text-gray-900">
                Add Photos
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                disabled={photos.length >= 7 || loading}
              />
            </label>

            {photos.length > 0 && (
              <div className="mt-6 space-y-6">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`cursor-grab active:cursor-grabbing ${
                      draggedIndex === index ? "opacity-50" : ""
                    }`}
                  >
                    {/* Image with close button */}
                    <div className="relative rounded-lg overflow-hidden mb-3">
                      <img
                        src={photo.url}
                        alt={`Bird photo ${index + 1}`}
                        className="w-full h-80 object-cover"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg"
                        disabled={loading}
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>

                    {/* Bird Tags Section */}
                    <div className="space-y-3 search-container">
                      <label className="block text-sm font-medium text-gray-700">
                        Bird Species in this photo:
                      </label>

                      {photo.birds?.length > 0 ? (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {photo.birds.map((bird, idx) => (
                            <span
                              key={bird.birdId || bird.name + idx}
                              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                                bird.isCustom
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              <span className="font-medium">{bird.name}</span>
                              {bird.scientificName && (
                                <span className="text-xs italic text-gray-600">
                                  ({bird.scientificName})
                                </span>
                              )}
                              {bird.isCustom && (
                                <span className="text-xs text-gray-500 ml-1">
                                  (custom)
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  removeTagFromPhoto(photo.id, bird)
                                }
                                className="hover:text-red-600 font-bold text-lg ml-1"
                                disabled={loading}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">
                          No bird species tagged yet. Add at least one bird
                          species.
                        </p>
                      )}

                      <div className="relative">
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={tagInputs[photo.id] || ""}
                              onChange={(e) =>
                                handleTagInputChange(photo.id, e.target.value)
                              }
                              onFocus={() =>
                                tagInputs[photo.id] &&
                                setShowSearchResults((prev) => ({
                                  ...prev,
                                  [photo.id]: true,
                                }))
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTagToPhoto(photo.id);
                                }
                              }}
                              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#143829] focus:border-transparent"
                              placeholder="Search birds by name, scientific name, Sinhala or Tamil..."
                              disabled={loading}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                            {searching[photo.id] && (
                              <div className="absolute right-3 top-3">
                                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => addTagToPhoto(photo.id)}
                            className="bg-[#143829] hover:bg-[#0f2a1f] text-white px-4 py-2 text-sm font-medium rounded-lg"
                            disabled={loading}
                          >
                            Add
                          </button>
                        </div>

                        {/* Bird Suggestions Dropdown - Improved from checklist */}
                        {showSearchResults[photo.id] && (
                          <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                            {birdSuggestions[photo.id]?.length > 0 ? (
                              birdSuggestions[photo.id].map((bird) => (
                                <div
                                  key={bird._id}
                                  onClick={() => addTagToPhoto(photo.id, bird)}
                                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <p className="font-medium text-gray-800">
                                    {bird.primaryName}
                                  </p>
                                  {bird.otherNames &&
                                    bird.otherNames.length > 0 && (
                                      <p className="text-xs text-gray-400">
                                        {bird.otherNames.join(", ")}
                                      </p>
                                    )}
                                  <p className="text-sm text-gray-500 italic">
                                    {bird.scientificName}
                                  </p>
                                  {bird.sinhalaName && (
                                    <p className="text-xs text-gray-400">
                                      සිංහල: {bird.sinhalaName}
                                    </p>
                                  )}
                                  {bird.tamilName && (
                                    <p className="text-xs text-gray-400">
                                      தமிழ்: {bird.tamilName}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                {searching[photo.id]
                                  ? "Searching..."
                                  : tagInputs[photo.id]
                                  ? `No birds found matching "${
                                      tagInputs[photo.id]
                                    }"`
                                  : "Start typing to search for birds"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-gray-500">
                        Tip: Start typing to search for bird species. Add all
                        species visible in this photo.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-4">
            <label className="block mb-3 text-xs font-medium text-gray-700">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                e.target.value.length <= 800 && setDescription(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Share details about your birding experience, location, weather, behavior observed..."
              disabled={loading}
            />
            <div className="text-xs mt-2 text-right text-gray-500">
              {description.length}/800
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Discard Post?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to discard this post? This action cannot be
              undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="border border-gray-300 bg-white text-gray-900 py-3 rounded-full font-medium hover:bg-gray-50"
              >
                Discard Post
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="bg-gray-100 text-gray-900 py-3 rounded-full font-medium hover:bg-gray-200"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CreatePost;
