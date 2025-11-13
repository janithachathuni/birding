import React, { useState, useEffect } from "react";
import { FaCamera, FaTimes } from "react-icons/fa";

const CreatePost = ({ onComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [tagInputs, setTagInputs] = useState({});

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [photos]);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.slice(0, 7 - photos.length).map((file, index) => ({
      id: Date.now() + index,
      file,
      url: URL.createObjectURL(file),
      tags: []
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
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const addTagToPhoto = (photoId) => {
    const tag = tagInputs[photoId] || "";
    if (!tag.trim()) return;
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId && !p.tags.includes(tag.trim())
          ? { ...p, tags: [...p.tags, tag.trim()] }
          : p
      )
    );
    setTagInputs((prev) => ({ ...prev, [photoId]: "" }));
  };

  const removeTagFromPhoto = (photoId, tagToRemove) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? { ...p, tags: p.tags.filter((t) => t !== tagToRemove) }
          : p
      )
    );
  };

  const handleCreatePost = () => {
    console.log("Creating post:", { photos, description });
    onComplete?.();
  };

  const handleDiscard = () => {
    if (photos.length === 0 && description.trim() === "") {
      onComplete?.();
    } else {
      setShowDiscardConfirm(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-8 px-4">
      <div className="relative bg-[#F5F6F5] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <button
            onClick={handleDiscard}
            className="text-gray-600 hover:text-gray-900 p-2"
          >
            <FaTimes size={20} />
          </button>

          <button
            onClick={handleCreatePost}
            disabled={photos.length === 0}
            className="bg-[#143829] hover:bg-[#143829] text-white px-8 py-2 rounded-full text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#F5F6F5] rounded-b-2xl">
          {/* Photo Upload */}
          <div className="mb-4 bg-white rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
              <FaCamera size={22} className="text-gray-700" />
              <span className="text-md font-normal text-gray-900">Add Photos</span>
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
              <div className="mt-6 space-y-6">
                {/* Photo list */}
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
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-3">
                      {photo.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {photo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-green-100 text-green-800 px-3 py-1 text-sm rounded-full flex items-center gap-2"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTagFromPhoto(photo.id, tag)}
                                className="hover:text-red-600 font-medium"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInputs[photo.id] || ""}
                          onChange={(e) =>
                            setTagInputs((prev) => ({
                              ...prev,
                              [photo.id]: e.target.value
                            }))
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTagToPhoto(photo.id);
                            }
                          }}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#143829] focus:border-transparent"
                          placeholder="Add bird species tag..."
                        />
                        <button
                          onClick={() => addTagToPhoto(photo.id)}
                          className="bg-[#143829] hover:bg-[#0f2a1f] text-white px-4 py-2 text-sm font-medium rounded-lg"
                        >
                          Add
                        </button>
                      </div>
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
              placeholder="Share details about your birding experience..."
            />
            <div className="text-xs mt-2 text-right text-gray-500">
              {description.length}/800
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-4 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2 text-gray-900">
              Save Progress?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Save as draft or discard completely.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  console.log("Saved as draft:", { photos, description });
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="bg-green-800 hover:bg-green-900 text-white py-3 rounded-full font-medium"
              >
                Save as Draft
              </button>
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
};

export default CreatePost;