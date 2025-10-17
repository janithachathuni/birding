import React, { useState, useEffect } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

//images import
import profileimg from "../../assets/default_profile_pic.png";

const Posts = () => {
  // State variables from Blog.jsx
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [lightbox, setLightbox] = useState({ isOpen: false, postId: null });
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [replyTo, setReplyTo] = useState({});
  const [newReply, setNewReply] = useState({});
  const [profile, setProfile] = useState({});
  const [profileUser, setProfileUser] = useState({});

  // Get current logged-in user
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  // Sample posts data (from Blog.jsx)
  const posts = [
    {
      id: 1,
      username: profileUser.username || "user",
      profileimg: profileimg,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg/500px-Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg",
          aspectRatio: "landscape",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Little_egret_%28Egretta_garzetta%29_Photograph_by_Shantanu_Kuveskar.jpg/500px-Little_egret_%28Egretta_garzetta%29_Photograph_by_Shantanu_Kuveskar.jpg",
          aspectRatio: "portrait",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Spilornis_cheela_%28Bandipur%2C_2008%29.jpg/500px-Spilornis_cheela_%28Bandipur%2C_2008%29.jpg",
          aspectRatio: "square",
        },
      ],
      description:
        "Here are some of the birds i saw in wilpattu national park.",
      tags: ["Sri Lanka Jungle-fowl", "Little Egret", "Crested Serpent Eagle"],
    },
    {
      id: 2,
      username: profileUser.username || "user",
      profileimg: profileimg,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      images: [
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Spilornis_cheela_%28Bandipur%2C_2008%29.jpg/500px-Spilornis_cheela_%28Bandipur%2C_2008%29.jpg",
          aspectRatio: "portrait",
        },
        {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Graureiher_Grey_Heron.jpg/500px-Graureiher_Grey_Heron.jpg",
          aspectRatio: "landscape",
        },
      ],
      description: "Beautiful birds i saw on the way home in galle.",
      tags: ["Crested Serpent Eagle", "Grey Heron"],
    },
  ];

  // Methods from Blog.jsx
  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const nextImage = (postId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (postId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [postId]: ((prev[postId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const addComment = (postId) => {
    if (!newComment[postId]?.trim()) return;

    setComments((prev) => ({
      ...prev,
      [postId]: [
        ...(prev[postId] || []),
        {
          id: Date.now(),
          text: newComment[postId],
          user: currentUser?.username || "currentuser",
          date: new Date(),
          likes: 0,
          replies: [],
        },
      ],
    }));

    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  const addReply = (postId, commentId) => {
    if (!newReply[`${postId}-${commentId}`]?.trim()) return;

    setComments((prev) => ({
      ...prev,
      [postId]:
        prev[postId]?.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  {
                    id: Date.now(),
                    text: newReply[`${postId}-${commentId}`],
                    user: currentUser?.username || "currentuser",
                    date: new Date(),
                    likes: 0,
                  },
                ],
              }
            : comment
        ) || [],
    }));

    setNewReply((prev) => ({ ...prev, [`${postId}-${commentId}`]: "" }));
    setReplyTo((prev) => ({ ...prev, [`${postId}-${commentId}`]: false }));
  };

  // Prevent copying images
  const preventCopy = (e) => {
    e.preventDefault();
    alert("Copying is not allowed");
  };

  return (
    <div className="flex min-h-screen bg-white">
      
      {/* Main content with proper spacing to match Blog.jsx layout */}
      <div className="flex flex-1 ">
        <div className="bg-white w-full">
          <div className="space-y-6 p-4">
            {posts.map((post) => {
              const currentImg = currentImageIndex[post.id] || 0;
              const currentImage = post.images[currentImg];

              return (
                <div
                  key={post.id}
                  className="bg-[#f5f6f5] border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#143829]">
                    <div className="flex items-center space-x-3">
                      {profile.profilePic ? (
                        <img
                          src={`http://localhost:3001/${profile.profilePic}`}
                          className="w-10 h-10 rounded-full object-cover border-[#2b5b3f]"
                        />
                      ) : (
                        <img
                          src={profileimg}
                          className="w-10 h-10 rounded-full object-cover border-[#2b5b3f]"
                        />
                      )}
                      <span className="font-semibold text-[#143829]">
                        {profileUser.username || "user"}
                      </span>
                    </div>
                    <span className="text-sm text-[#2b5b3f]">
                      {formatDate(post.date)}
                    </span>
                  </div>


                  {/* Image Container */}
                  <div className="relative bg-[#143829]">
                    <div className="relative w-full">
                      <img
                        src={currentImage.url}
                        alt="Post"
                        className="w-full h-auto object-contain select-none pointer-events-auto"
                        onContextMenu={preventCopy}
                        onDragStart={preventCopy}
                        onClick={() =>
                          setLightbox({ isOpen: true, postId: post.id })
                        }
                      />

                      {/* Navigation buttons */}
                      {post.images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              prevImage(post.id, post.images.length)
                            }
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() =>
                              nextImage(post.id, post.images.length)
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                          >
                            ›
                          </button>
                        </>
                      )}

                      {/* Image indicators */}
                      {post.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 gap-3 transform -translate-x-1/2 flex space-x-1">
                          {post.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 rounded-full ${
                                index === currentImg
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4">
                    <p className="text-[#143829] mb-3">{post.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-[black] text-sm underline font-medium hover:text-[#c4501b] transition cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Border */}
                  <div className="border-t border-[#143829]"></div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end space-x-6 p-4">
                    <button className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span>Comment</span>
                    </button>

                    <button className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#c4501b] transition">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span>Like</span>
                    </button>
                  </div>

                  {/* Comments section */}
                  {showComments[post.id] && (
                    <div className="border-t-2 border-[#143829] bg-yellow-100">
                      {/* Add comment - only show if user is logged in */}
                      {currentUser && (
                        <div className="p-4 border-b border-[#2b5b3f]">
                          <div className="flex space-x-3">
                            <img
                              src={profileimg}
                              alt="Your profile"
                              className="w-8 h-8 rounded-full border border-[#2b5b3f]"
                            />
                            <div className="flex-1">
                              <textarea
                                value={newComment[post.id] || ""}
                                onChange={(e) =>
                                  setNewComment((prev) => ({
                                    ...prev,
                                    [post.id]: e.target.value,
                                  }))
                                }
                                placeholder="Write a comment..."
                                className="w-full p-2 border border-[#2b5b3f] rounded resize-none focus:outline-none focus:border-[#a0361b]"
                                rows="2"
                              />
                              <button
                                onClick={() => addComment(post.id)}
                                className="mt-2 px-4 py-1 bg-[#143829] text-white rounded hover:bg-[#2b5b3f] transition text-sm"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Comments list */}
                      <div className="max-h-96 overflow-y-auto">
                        {(comments[post.id] || []).map((comment) => (
                          <div
                            key={comment.id}
                            className="p-4 border-b border-gray-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center space-x-2">
                                <img
                                  src={profileimg}
                                  alt="Commenter"
                                  className="w-6 h-6 rounded-full border border-[#2b5b3f]"
                                />
                                <span className="text-sm font-medium text-[#143829]">
                                  @{comment.user}
                                </span>
                                <span className="text-xs text-[#2b5b3f]">
                                  {formatDate(comment.date)}
                                </span>
                              </div>
                              <button className="text-[#a0361b] hover:text-[#c4501b] transition text-sm">
                                ♡ {comment.likes}
                              </button>
                            </div>

                            <p className="text-[#143829] text-sm mb-2">
                              {comment.text}
                            </p>

                            {currentUser && (
                              <button
                                onClick={() =>
                                  setReplyTo((prev) => ({
                                    ...prev,
                                    [`${post.id}-${comment.id}`]:
                                      !prev[`${post.id}-${comment.id}`],
                                  }))
                                }
                                className="text-[#2b5b3f] hover:text-[#a0361b] transition text-xs"
                              >
                                Reply
                              </button>
                            )}

                            {/* Reply form */}
                            {currentUser &&
                              replyTo[`${post.id}-${comment.id}`] && (
                                <div className="mt-2 ml-4 flex space-x-2">
                                  <img
                                    src={profileimg}
                                    alt="Your profile"
                                    className="w-6 h-6 rounded-full border border-[#2b5b3f]"
                                  />
                                  <div className="flex-1">
                                    <input
                                      value={
                                        newReply[`${post.id}-${comment.id}`] ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setNewReply((prev) => ({
                                          ...prev,
                                          [`${post.id}-${comment.id}`]:
                                            e.target.value,
                                        }))
                                      }
                                      placeholder="Write a reply..."
                                      className="w-full p-1 border border-[#2b5b3f] rounded text-sm focus:outline-none focus:border-[#a0361b]"
                                    />
                                    <button
                                      onClick={() =>
                                        addReply(post.id, comment.id)
                                      }
                                      className="mt-1 px-3 py-1 bg-[#2b5b3f] text-white rounded hover:bg-[#a0361b] transition text-xs"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              )}

                            {/* Replies */}
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                className="ml-6 mt-2 p-2 bg-yellow-200 rounded border border-gray-200"
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={profileimg}
                                      alt="Replier"
                                      className="w-5 h-5 rounded-full border border-[#2b5b3f]"
                                    />
                                    <span className="text-xs font-medium text-[#143829]">
                                      @{reply.user}
                                    </span>
                                    <span className="text-xs text-[#2b5b3f]">
                                      {formatDate(reply.date)}
                                    </span>
                                  </div>
                                  <button className="text-[#a0361b] hover:text-[#c4501b] transition text-xs">
                                    ♡ {reply.likes}
                                  </button>
                                </div>
                                <p className="text-[#143829] text-xs">
                                  {reply.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Lightbox Modal */}
          {lightbox.isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              {/* Close button (top-right corner of screen) */}
              <button
                className="fixed top-6 right-6 text-white text-4xl font-bold z-50 hover:text-gray-300 transition"
                onClick={() => setLightbox({ isOpen: false, postId: null })}
              >
                ×
              </button>

              {/* Enlarged Image */}
              <img
                src={
                  posts.find((p) => p.id === lightbox.postId).images[
                    currentImageIndex[lightbox.postId] || 0
                  ].url
                }
                alt="Enlarged"
                className="max-h-[95vh] w-auto object-contain"
                onContextMenu={preventCopy}
                onDragStart={preventCopy}
              />

              {/* Prev/Next buttons pinned to far left/right */}
              {posts.find((p) => p.id === lightbox.postId).images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      prevImage(
                        lightbox.postId,
                        posts.find((p) => p.id === lightbox.postId).images.length
                      )
                    }
                    className="fixed left-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/70 transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      nextImage(
                        lightbox.postId,
                        posts.find((p) => p.id === lightbox.postId).images.length
                      )
                    }
                    className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/70 transition"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default Posts;