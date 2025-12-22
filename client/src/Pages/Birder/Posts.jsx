import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  HiOutlineShare,
  HiOutlineChatAlt,
  HiOutlineHeart,
  HiHeart,
  HiOutlineTrash,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import profileimg from "../../assets/default_profile_pic.png";

const Posts = ({ userId = null, showAllPosts = true }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [lightbox, setLightbox] = useState({ isOpen: false, postId: null });
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [replyTo, setReplyTo] = useState({});
  const [newReply, setNewReply] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState({});

  const navigate = useNavigate();

  // Get current logged-in user
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [userId, showAllPosts]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let response;

      if (showAllPosts) {
        response = await axios.get("http://localhost:3001/api/posts");
      } else if (userId) {
        response = await axios.get(
          `http://localhost:3001/api/posts/user/${userId}`
        );
      }

      if (response.data.success) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
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

  const togglePostMenu = (postId) => {
    setShowPostMenu((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCopyPostLink = (post) => {
    const url = `${window.location.origin}/${post.user?.username}/${post._id}`;
    navigator.clipboard.writeText(url);
    setShowPostMenu({});
    alert("Post link copied to clipboard!");
  };

  const handleReportPost = (post) => {
    setShowPostMenu({});
    alert("Post reported. We'll review this content.");
  };

  const handleBlockUser = (post) => {
    setShowPostMenu({});
    alert(`User @${post.user?.username} has been blocked.`);
  };

  const handleFollowUser = async (post) => {
    if (!currentUser) {
      alert("Please login to follow users");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3001/api/profiles/follow/${post.user._id}`,
        { currentUserId: currentUser._id || currentUser.id }
      );
      setShowPostMenu({});
      alert(`You are now following @${post.user?.username}`);
    } catch (error) {
      console.error("Error following user:", error);
      alert(error.response?.data?.message || "Failed to follow user");
    }
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

  const handleDeleteClick = (e, post) => {
    e.preventDefault();
    e.stopPropagation();
    setPostToDelete(post);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/posts/${postToDelete._id}`,
        {
          data: { userId: currentUser._id || currentUser.id },
        }
      );

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postToDelete._id)
        );
        setShowDeletePopup(false);
        setPostToDelete(null);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.error || "Failed to delete post");
      setShowDeletePopup(false);
    }
  };

  const handleLike = async (postId) => {
    if (!currentUser) {
      alert("Please login to like posts");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${postId}/like`,
        { userId: currentUser._id || currentUser.id }
      );

      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  likes: response.data.data.liked
                    ? [...post.likes, currentUser._id || currentUser.id]
                    : post.likes.filter(
                        (id) => id !== (currentUser._id || currentUser.id)
                      ),
                }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const preventCopy = (e) => {
    e.preventDefault();
    alert("Copying is not allowed");
  };

  const handleBirdTagClick = async (taggedName) => {
    try {
      // Fetch all birds to find the one with matching name
      const response = await axios.get("http://localhost:3001/api/birds/get");
      const birds = response.data;

      // Find bird by primaryName or scientificName
      const bird = birds.find(
        (b) => b.primaryName === taggedName || b.scientificName === taggedName
      );

      if (bird) {
        navigate(`/bird/${bird._id}`);
      } else {
        alert("Bird not found in database");
      }
    } catch (error) {
      console.error("Error finding bird:", error);
      alert("Could not navigate to bird page");
    }
  };

  // Close post menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".post-menu-container")) {
        setShowPostMenu({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <div className="text-[#143829] text-lg">Loading posts...</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <div className="text-[#143829] text-lg">No posts yet</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1">
        <div className="bg-white w-full">
          <div className="space-y-6 p-4">
            {posts.map((post) => {
              const currentImg = currentImageIndex[post._id] || 0;
              const currentImage = post.images[currentImg];
              const isLiked = post.likes?.includes(
                currentUser?._id || currentUser?.id
              );
              const isOwnPost =
                currentUser &&
                (currentUser._id === post.user._id ||
                  currentUser.id === post.user._id);

              return (
                <div
                  key={post._id}
                  className="bg-[#f5f6f5] border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4 border-b border-[#143829]">
                    <div
                      className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                      onClick={() =>
                        navigate(`/${post.user?.username}/${post._id}`)
                      }
                    >
                      {/* profile pic */}
                      <img
                        src={
                          post.user?.profile?.profilePic
                            ? `http://localhost:3001${post.user.profile.profilePic}`
                            : profileimg
                        }
                        className="w-10 h-10 rounded-full object-cover border-[#2b5b3f]"
                        alt="Profile"
                        onError={(e) => {
                          console.log(
                            "Image failed to load, falling back to default"
                          );
                          e.target.src = profileimg;
                        }}
                      />

                      <span className="font-semibold text-[#143829]">
                        {post.user?.username || "user"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#2b5b3f]">
                        {formatDate(post.createdAt)}
                      </span>

                      {/* Three-dot menu - only show if not own post */}
                      {!isOwnPost && (
                        <div className="relative post-menu-container">
                          <button
                            className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center transition"
                            onClick={() => togglePostMenu(post._id)}
                          >
                            <svg
                              className="w-5 h-5 text-[#143829]"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>

                          {/* Dropdown menu */}
                          {showPostMenu[post._id] && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleCopyPostLink(post)}
                              >
                                Copy Post Link
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleFollowUser(post)}
                              >
                                Follow @{post.user?.username}
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleReportPost(post)}
                              >
                                Report Post
                              </button>
                              <button
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                onClick={() => handleBlockUser(post)}
                              >
                                Block User
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="relative bg-[#143829]">
                    <div className="relative w-full">
                      <img
                        src={`http://localhost:3001${currentImage.imageUrl}`}
                        alt="Post"
                        className="w-full h-auto object-contain select-none pointer-events-auto"
                        onContextMenu={preventCopy}
                        onDragStart={preventCopy}
                        onClick={() =>
                          setLightbox({ isOpen: true, postId: post._id })
                        }
                      />

                      {post.images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              prevImage(post._id, post.images.length)
                            }
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() =>
                              nextImage(post._id, post.images.length)
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                          >
                            ›
                          </button>
                        </>
                      )}

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
                    {post.caption && (
                      <p className="text-[#143829] mb-3">{post.caption}</p>
                    )}

                    {/* Bird Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentImage.birds?.map((bird, index) => (
                        <span
                          key={index}
                          onClick={() => handleBirdTagClick(bird.taggedName)}
                          className="text-[black] text-sm underline font-medium hover:text-[#c4501b] transition cursor-pointer"
                        >
                          {bird.taggedName}
                          {bird.isCustom && (
                            <span className="text-xs text-gray-500 ml-1">
                              (custom)
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#143829]"></div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end space-x-6 p-4">
                    <button className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition">
                      <HiOutlineShare className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => toggleComments(post._id)}
                      className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition"
                    >
                      <HiOutlineChatAlt className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => handleLike(post._id)}
                      className={`flex items-center space-x-1 transition ${
                        isLiked
                          ? "text-[#c4501b]"
                          : "text-[#2b5b3f] hover:text-[#c4501b]"
                      }`}
                    >
                      {isLiked ? (
                        <HiHeart className="w-5 h-5" />
                      ) : (
                        <HiOutlineHeart className="w-5 h-5" />
                      )}
                      <span>{post.likes?.length || 0}</span>
                    </button>

                    {/* Delete button - only show if user owns the post */}
                    {isOwnPost && (
                      <button
                        onClick={(e) => handleDeleteClick(e, post)}
                        className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Comments section */}
                  {showComments[post._id] && (
                    <div className="border-t-2 border-[#143829] bg-yellow-100">
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
                                value={newComment[post._id] || ""}
                                onChange={(e) =>
                                  setNewComment((prev) => ({
                                    ...prev,
                                    [post._id]: e.target.value,
                                  }))
                                }
                                placeholder="Write a comment..."
                                className="w-full p-2 border border-[#2b5b3f] rounded resize-none focus:outline-none focus:border-[#a0361b]"
                                rows="2"
                              />
                              <button
                                onClick={() => addComment(post._id)}
                                className="mt-2 px-4 py-1 bg-[#143829] text-white rounded hover:bg-[#2b5b3f] transition text-sm"
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="max-h-96 overflow-y-auto">
                        {(comments[post._id] || []).map((comment) => (
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
                                    [`${post._id}-${comment.id}`]:
                                      !prev[`${post._id}-${comment.id}`],
                                  }))
                                }
                                className="text-[#2b5b3f] hover:text-[#a0361b] transition text-xs"
                              >
                                Reply
                              </button>
                            )}

                            {currentUser &&
                              replyTo[`${post._id}-${comment.id}`] && (
                                <div className="mt-2 ml-4 flex space-x-2">
                                  <img
                                    src={profileimg}
                                    alt="Your profile"
                                    className="w-6 h-6 rounded-full border border-[#2b5b3f]"
                                  />
                                  <div className="flex-1">
                                    <input
                                      value={
                                        newReply[`${post._id}-${comment.id}`] ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        setNewReply((prev) => ({
                                          ...prev,
                                          [`${post._id}-${comment.id}`]:
                                            e.target.value,
                                        }))
                                      }
                                      placeholder="Write a reply..."
                                      className="w-full p-1 border border-[#2b5b3f] rounded text-sm focus:outline-none focus:border-[#a0361b]"
                                    />
                                    <button
                                      onClick={() =>
                                        addReply(post._id, comment.id)
                                      }
                                      className="mt-1 px-3 py-1 bg-[#2b5b3f] text-white rounded hover:bg-[#a0361b] transition text-xs"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              )}

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
              <button
                className="fixed top-6 right-6 text-white text-4xl font-bold z-50 hover:text-gray-300 transition"
                onClick={() => setLightbox({ isOpen: false, postId: null })}
              >
                ×
              </button>

              <img
                src={`http://localhost:3001${
                  posts.find((p) => p._id === lightbox.postId).images[
                    currentImageIndex[lightbox.postId] || 0
                  ].imageUrl
                }`}
                alt="Enlarged"
                className="max-h-[95vh] w-auto object-contain"
                onContextMenu={preventCopy}
                onDragStart={preventCopy}
              />

              {posts.find((p) => p._id === lightbox.postId).images.length >
                1 && (
                <>
                  <button
                    onClick={() =>
                      prevImage(
                        lightbox.postId,
                        posts.find((p) => p._id === lightbox.postId).images
                          .length
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
                        posts.find((p) => p._id === lightbox.postId).images
                          .length
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

      {/* delete popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Post
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setPostToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
