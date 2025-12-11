import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import {
  HiOutlineShare,
  HiOutlineChatAlt,
  HiOutlineHeart,
  HiHeart,
  HiOutlineTrash,
} from "react-icons/hi";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import profileimg from "../../assets/default_profile_pic.png";

const SinglePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState({});
  const [newReply, setNewReply] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Get current logged-in user
  const userData = localStorage.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;

  // Fetch single post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3001/api/posts/${postId}`
        );
        
        if (response.data.success) {
          setPost(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

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

  const nextImage = () => {
    if (post && post.images) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post && post.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + post.images.length) % post.images.length
      );
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newComment,
        user: currentUser?.username || "currentuser",
        date: new Date(),
        likes: 0,
        replies: [],
      },
    ]);

    setNewComment("");
  };

  const addReply = (commentId) => {
    if (!newReply[commentId]?.trim()) return;

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  id: Date.now(),
                  text: newReply[commentId],
                  user: currentUser?.username || "currentuser",
                  date: new Date(),
                  likes: 0,
                },
              ],
            }
          : comment
      )
    );

    setNewReply((prev) => ({ ...prev, [commentId]: "" }));
    setReplyTo((prev) => ({ ...prev, [commentId]: false }));
  };

  const handleLike = async () => {
    if (!currentUser || !post) {
      alert("Please login to like posts");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/posts/${post._id}/like`,
        { userId: currentUser._id || currentUser.id }
      );

      if (response.data.success) {
        setPost((prevPost) => ({
          ...prevPost,
          likes: response.data.data.liked
            ? [...prevPost.likes, currentUser._id || currentUser.id]
            : prevPost.likes.filter(
                (id) => id !== (currentUser._id || currentUser.id)
              ),
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!post) return;

    try {
      const response = await axios.delete(
        `http://localhost:3001/api/posts/${post._id}`,
        {
          data: { userId: currentUser._id || currentUser.id },
        }
      );

      if (response.data.success) {
        setShowDeletePopup(false);
        navigate(-1); // Go back after deletion
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.error || "Failed to delete post");
      setShowDeletePopup(false);
    }
  };

  const preventCopy = (e) => {
    e.preventDefault();
    alert("Copying is not allowed");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <UserSidebar />
        <div className="flex flex-1 ml-[20%] mr-[30%] items-center justify-center">
          <div className="text-[#143829] text-lg">Loading post...</div>
        </div>
        <UserSidebarRight />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen bg-white">
        <UserSidebar />
        <div className="flex flex-1 ml-[20%] mr-[30%] items-center justify-center">
          <div className="text-center">
            <div className="text-[#143829] text-lg mb-4">
              {error || "Post not found"}
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#143829] text-white rounded-lg hover:bg-[#2b5b3f]"
            >
              Go Back
            </button>
          </div>
        </div>
        <UserSidebarRight />
      </div>
    );
  }

  const currentImage = post.images[currentImageIndex];
  const isLiked = post.likes?.includes(currentUser?._id || currentUser?.id);

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className="bg-white w-full">
          {/* Back Button Header */}
          <div className="border-b border-gray-300 p-6 flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <FaArrowLeft className="text-[#143829]" />
            </button>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <div className="bg-[#f5f6f5] border border-gray-200 rounded-lg overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#143829]">
                <div 
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                  onClick={() => navigate(`/${post.user?.username}`)}
                >
                  <img
                    src={
                      post.user?.profilePic
                        ? `http://localhost:3001${post.user.profilePic}`
                        : profileimg
                    }
                    className="w-10 h-10 rounded-full object-cover border-[#2b5b3f]"
                    alt="Profile"
                  />
                  <span className="font-semibold text-[#143829]">
                    {post.user?.username || "user"}
                  </span>
                </div>
                <span className="text-sm text-[#2b5b3f]">
                  {formatDate(post.createdAt)}
                </span>
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
                    onClick={() => setLightbox(true)}
                  />

                  {/* Navigation buttons */}
                  {post.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                      >
                        ‹
                      </button>
                      <button
                        onClick={nextImage}
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
                            index === currentImageIndex
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

              {/* Border */}
              <div className="border-t border-[#143829]"></div>

              {/* Action buttons */}
              <div className="flex items-center justify-end space-x-6 p-4">
                <button className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition">
                  <HiOutlineShare className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition"
                >
                  <HiOutlineChatAlt className="w-5 h-5" />
                </button>

                <button
                  onClick={handleLike}
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

                {/* Delete button */}
                {currentUser &&
                  (currentUser._id === post.user._id ||
                    currentUser.id === post.user._id) && (
                    <button
                      onClick={() => setShowDeletePopup(true)}
                      className="flex items-center space-x-1 text-[#2b5b3f] hover:text-[#a0361b] transition"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  )}
              </div>

              {/* Comments section */}
              {showComments && (
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
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 border border-[#2b5b3f] rounded resize-none focus:outline-none focus:border-[#a0361b]"
                            rows="2"
                          />
                          <button
                            onClick={addComment}
                            className="mt-2 px-4 py-1 bg-[#143829] text-white rounded hover:bg-[#2b5b3f] transition text-sm"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="max-h-96 overflow-y-auto">
                    {comments.map((comment) => (
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
                                [comment.id]: !prev[comment.id],
                              }))
                            }
                            className="text-[#2b5b3f] hover:text-[#a0361b] transition text-xs"
                          >
                            Reply
                          </button>
                        )}

                        {currentUser && replyTo[comment.id] && (
                          <div className="mt-2 ml-4 flex space-x-2">
                            <img
                              src={profileimg}
                              alt="Your profile"
                              className="w-6 h-6 rounded-full border border-[#2b5b3f]"
                            />
                            <div className="flex-1">
                              <input
                                value={newReply[comment.id] || ""}
                                onChange={(e) =>
                                  setNewReply((prev) => ({
                                    ...prev,
                                    [comment.id]: e.target.value,
                                  }))
                                }
                                placeholder="Write a reply..."
                                className="w-full p-1 border border-[#2b5b3f] rounded text-sm focus:outline-none focus:border-[#a0361b]"
                              />
                              <button
                                onClick={() => addReply(comment.id)}
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
          </div>

          {/* Lightbox Modal */}
          {lightbox && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <button
                className="fixed top-6 right-6 text-white text-4xl font-bold z-50 hover:text-gray-300 transition"
                onClick={() => setLightbox(false)}
              >
                ×
              </button>

              <img
                src={`http://localhost:3001${post.images[currentImageIndex].imageUrl}`}
                alt="Enlarged"
                className="max-h-[95vh] w-auto object-contain"
                onContextMenu={preventCopy}
                onDragStart={preventCopy}
              />

              {post.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="fixed left-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/70 transition"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/70 transition"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          )}

          {/* Delete popup */}
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
                    onClick={() => setShowDeletePopup(false)}
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
      </div>
      <UserSidebarRight />
    </div>
  );
};

export default SinglePost;