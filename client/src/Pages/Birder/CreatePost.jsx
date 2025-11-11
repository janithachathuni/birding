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
    <div className="fixed inset-0 bg-black flex items-start justify-center z-50 pt-8 px-4">
      <div className="relative bg-white border-4 border-black w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-gray-100">
          <button
            onClick={handleDiscard}
            className="border-2 border-black bg-white hover:bg-black hover:text-white p-2"
          >
            <FaTimes size={18} />
          </button>

          <button
            onClick={handleCreatePost}
            disabled={photos.length === 0}
            className="border-2 border-black bg-black text-white px-6 py-2 text-sm font-bold disabled:bg-gray-400 disabled:border-gray-400"
          >
            SHARE POST
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {/* Photo Upload */}
          <div className="mb-6 border-2 border-black p-4">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-3 border-2 border-black">
              <FaCamera size={20} />
              <span className="text-md font-bold">ADD PHOTOS</span>
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
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <h3 className="text-lg font-bold">
                    PHOTOS ({photos.length}/7)
                  </h3>
                  {photos.length < 7 && (
                    <label className="text-sm font-bold cursor-pointer underline">
                      + ADD MORE
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
                <div className="space-y-6">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`border-4 border-black bg-white cursor-grab active:cursor-grabbing ${
                        draggedIndex === index ? "opacity-50" : ""
                      }`}
                    >
                      {/* Photo Header */}
                      <div className="flex items-center justify-between p-3 border-b-4 border-black bg-gray-100">
                        <span className="font-bold">PHOTO #{index + 1}</span>
                        <button
                          onClick={() => removePhoto(photo.id)}
                          className="border-2 border-black bg-white hover:bg-red-500 hover:text-white hover:border-red-500 px-3 py-1 font-bold"
                        >
                          REMOVE
                        </button>
                      </div>

                      <div className="p-4">
                        {/* Image */}
                        <div className="border-4 border-black mb-4">
                          <img
                            src={photo.url}
                            alt={`Bird photo ${index + 1}`}
                            className="w-full h-64 object-contain bg-gray-50"
                          />
                        </div>

                        {/* Tags Section */}
                        <div className="border-2 border-black p-3 bg-gray-50">
                          <label className="block mb-2 text-xs font-bold">
                            BIRD SPECIES TAGS
                          </label>

                          {photo.tags.length > 0 && (
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {photo.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-black text-white px-3 py-1 text-sm flex items-center gap-2 border-2 border-black"
                                >
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => removeTagFromPhoto(photo.id, tag)}
                                    className="hover:text-red-400 font-bold"
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
                              className="flex-1 border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-4"
                              placeholder="e.g., Sri Lankan Magpie"
                            />
                            <button
                              onClick={() => addTagToPhoto(photo.id)}
                              className="border-2 border-black bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800"
                            >
                              ADD
                            </button>
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
          <div className="border-2 border-black p-4">
            <label className="block mb-3 text-xs font-bold">
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                e.target.value.length <= 800 && setDescription(e.target.value)
              }
              className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-4 resize-none"
              rows={4}
              placeholder="Share details about your birding experience..."
            />
            <div className="text-xs mt-2 text-right font-bold">
              {description.length}/800
            </div>
          </div>
        </div>
      </div>

      {/* Discard Confirmation */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-[60]">
          <div className="bg-white border-4 border-white p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-2 border-b-2 border-black pb-2">
              SAVE PROGRESS?
            </h3>
            <p className="text-sm mb-6">
              Save as draft or discard completely.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  console.log("Saved as draft:", { photos, description });
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="border-2 border-black bg-black text-white py-3 font-bold hover:bg-gray-800"
              >
                SAVE AS DRAFT
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onComplete?.();
                }}
                className="border-2 border-black bg-white text-black py-3 font-bold hover:bg-gray-100"
              >
                DISCARD POST
              </button>
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="border-2 border-black bg-gray-100 text-black py-3 font-bold hover:bg-gray-200"
              >
                KEEP EDITING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;