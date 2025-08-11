import React, { useState } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { FaPlus, FaTimes, FaImage, FaArrowUp, FaRegComment } from "react-icons/fa";

const Forum = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: "Identifying this rare finch in my backyard",
      author: "BirdWatcher42",
      topic: "Identification",
      description: "I spotted this unusual finch in my backyard yesterday. It has distinctive yellow markings on its wings. Can anyone help identify the species?",
      images: ["finch.jpg"],
      timestamp: "2 hours ago",
      upvotes: 24,
      comments: 8
    },
    {
      id: 2,
      title: "Best birding spots in the Pacific Northwest",
      author: "NatureExplorer",
      topic: "Locations",
      description: "Planning a trip next month and looking for recommendations on where to see migratory birds in Washington and Oregon.",
      images: [],
      timestamp: "5 hours ago",
      upvotes: 15,
      comments: 12
    }
  ]);

  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    description: "",
    topic: "",
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (newDiscussion.images.length >= 3) {
      alert("Maximum 3 images allowed");
      return;
    }
    const files = Array.from(e.target.files).slice(0, 3 - newDiscussion.images.length);
    const newImages = files.map(file => ({
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    setNewDiscussion(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (index) => {
    const updatedImages = [...newDiscussion.images];
    updatedImages.splice(index, 1);
    setNewDiscussion(prev => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const discussion = {
      id: discussions.length + 1,
      title: newDiscussion.title,
      author: "CurrentUser", // Replace with actual user
      topic: newDiscussion.topic,
      description: newDiscussion.description,
      images: newDiscussion.images,
      timestamp: "Just now",
      upvotes: 0,
      comments: 0
    };
    setDiscussions([discussion, ...discussions]);
    setNewDiscussion({ title: "", description: "", topic: "", images: [] });
    setShowPopup(false);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="w-full space-y-4">
          {/* Create Discussion Card */}
          <div 
            className="p-4 bg-[#f5f6f5] rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => setShowPopup(true)}
          >
            <div className="flex items-center text-gray-500">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                <FaPlus />
              </div>
              <span>Start a new discussion...</span>
            </div>
          </div>

          {/* Recent Discussions Heading */}
          <p className="text-xl font-semibold mt-6">Recent Discussions</p>

          {/* Discussions List */}
          <div className="space-y-4">
            {discussions.map(discussion => (
              <div key={discussion.id} className="p-4 bg-[#f5f6f5] rounded-lg">
                <div className="rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-black]">{discussion.title}</h3>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                          {discussion.topic}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Posted by {discussion.author} • {discussion.timestamp}</p>
                      <p className="mt-2 text-gray-700">{discussion.description}</p>
                      {discussion.images.length > 0 && (
                        <div className="flex space-x-2 mt-3">
                          {discussion.images.map((img, i) => (
                            <div key={i} className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden" />
                          ))}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-sm">
                        <div className="flex space-x-4">
                          <button className="flex items-center text-gray-500 hover:text-[#506142]">
                            <FaArrowUp className="mr-1" />
                            <span>{discussion.upvotes}</span>
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-[#506142]">
                            <FaRegComment className="mr-1" />
                            <span>{discussion.comments} comments</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserSidebarRight />

      {/* Floating Button */}
      <button 
        onClick={() => setShowPopup(true)}
        className="fixed bottom-6 right-[30%] bg-[#506142] text-white p-3 rounded-full shadow-lg hover:bg-[#3a4a32] transition-colors z-40"
        style={{ marginRight: '1rem' }}
      >
        <FaPlus size={20} />
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative">
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Create New Discussion</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newDiscussion.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#506142]"
                    placeholder="What's your discussion about?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <select
                    name="topic"
                    value={newDiscussion.topic}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#506142]"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="Identification">Identification</option>
                    <option value="Locations">Locations</option>
                    <option value="Behavior">Behavior</option>
                    <option value="Photography">Photography</option>
                    <option value="Conservation">Conservation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newDiscussion.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#506142]"
                    placeholder="Describe your discussion in detail..."
                    required
                  />
                </div>

                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 3)</label>
  <div className="flex items-center gap-3 mt-2">
    {/* Add Image Button */}
    {newDiscussion.images.length < 3 && (
      <label className="w-16 h-16 flex items-center justify-center border border-gray-300 rounded-md text-gray-400 cursor-pointer hover:bg-gray-100">
        <FaImage />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </label>
    )}

    {/* Uploaded Thumbnails */}
    {newDiscussion.images.map((img, index) => (
      <div key={index} className="relative w-16 h-16">
        <img
          src={img.preview}
          alt={`Uploaded ${index + 1}`}
          className="w-full h-full object-cover rounded-md border border-gray-300"
        />
        <button
          type="button"
          onClick={() => removeImage(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
        >
          <FaTimes size={10} />
        </button>
      </div>
    ))}
  </div>
</div>


                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#506142] text-white rounded hover:bg-[#3a4a32]"
                  >
                    Post Discussion
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
