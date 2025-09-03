import React, { useState, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";

const CreatePost = ({ onComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Cleanup preview URLs when unmounting
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [photos]);

  // Handle adding photos
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.slice(0, 7 - photos.length).map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  // Handle drag and drop
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
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // Tags
  const addTag = (e) => {
    e.preventDefault();
    const input = e.target.tagInput.value.trim();
    if (input && !tags.includes(input)) {
      setTags((prev) => [...prev, input]);
    }
    e.target.tagInput.value = "";
  };

  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  // Post actions
  const handleCreatePost = () => {
    console.log("Creating post:", { photos, description, tags });
    onComplete?.();
  };

  const handleDiscard = () => {
    if (photos.length === 0 && description.trim() === "" && tags.length === 0) {
      onComplete?.();
    } else {
      setShowDiscardConfirm(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-8 px-4 backdrop-blur-sm">
      {/* Main Popup */}
      <div className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <button
            onClick={handleDiscard}
            className="text-gray-500 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes size={18} />
          </button>

          <button
            onClick={handleCreatePost}
            disabled={photos.length === 0}
            className="bg-[#143829] hover:bg-[#0f2f22] disabled:bg-gray-300 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed"
          >
            Share Post
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Photo Upload */}
          <div className="mb-6">
            <label className="flex items-center gap-3 text-[#143829] hover:text-[#0f2f22] cursor-pointer transition-colors py-4">
              <FaCamera size={20} />
              <span className="text-md">Add photos</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden"
                disabled={photos.length >= 7}
              />
            </label>

            {photos.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-black">
                    Your Photos ({photos.length}/7)
                  </h3>
                  {photos.length < 7 && (
                    <label className="text-[#143829] hover:text-[#0f2f22] text-sm font-medium cursor-pointer">
                      + Add more
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Photo list */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`flex-shrink-0 w-72 bg-white rounded-xl border-2 border-gray-100 hover:border-[#2B5B3F] overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-grab active:cursor-grabbing ${
                        draggedIndex === index
                          ? "opacity-50 transform rotate-2 scale-105"
                          : ""
                      }`}
                    >
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={photo.url}
                          alt={`Bird photo ${index + 1}`}
                          className="w-full h-64 object-contain bg-gray-50"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30">
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-3 right-3 bg-[#C4501B] hover:bg-[#A0361B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm transition-colors shadow-lg"
                          >
                            ×
                          </button>
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            #{index + 1}
                          </div>
                          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            Drag to reorder
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block mb-3 text-sm font-medium text-black">
              Add a description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                e.target.value.length <= 800 && setDescription(e.target.value)
              }
              className="w-full border-2 border-gray-200 focus:border-[#2B5B3F] rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
              rows={3}
              placeholder="Share details about your birding experience..."
            />
            <div className="text-xs text-gray-500 mt-2 text-right">
              {description.length}/800 characters
            </div>
          </div>

          {/* Tags */}
          <div className="border-t border-gray-100 pt-6 mt-6">
            <label className="block mb-3 text-sm font-medium text-black">
              Bird Species Tags
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Add tags for all the bird species visible in your photos
            </p>

            {tags.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gradient-to-r from-[#143829] to-[#2B5B3F] text-white px-3 py-2 rounded-full text-sm flex items-center gap-2 shadow-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-[#C4501B] transition-colors font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <form onSubmit={addTag} className="flex gap-2">
              <input
                name="tagInput"
                type="text"
                className="flex-1 border-2 border-gray-200 focus:border-[#2B5B3F] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                placeholder="Enter bird species name (e.g., 'Sri Lankan Magpie')"
              />
              <button
                type="submit"
                disabled={photos.length === 0}
                className="bg-[#C4501B] hover:bg-[#A0361B] disabled:bg-gray-300 text-white px-6 py-3 rounded-xl text-sm font-medium transition-colors shadow-md disabled:cursor-not-allowed"
              >
                Add Tag
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl">
            <h3 className="text-lg font-medium mb-2 text-black">
              Save your progress?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              You can save this as a draft or discard it completely.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  console.log("Saved as draft:", { photos, description, tags });
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="bg-[#143829] hover:bg-[#0f2f22] text-white py-3 rounded-xl font-medium transition-colors"
              >
                Save as Draft
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="bg-[#C4501B] hover:bg-[#A0361B] text-white py-3 rounded-xl font-medium transition-colors"
              >
                Discard Post
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
