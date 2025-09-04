import React, { useState } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

//images import
import bannerimg from "../../assets/bannerimg.png";
import profilepic from "../../assets/default_profile_pic.png";

const Blog = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [lightbox, setLightbox] = useState({ isOpen: false, postId: null });
  const [showComments, setShowComments] = useState({});
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [replyTo, setReplyTo] = useState({});
  const [newReply, setNewReply] = useState({});

  const [activeTab, setActiveTab] = useState("Posts");

  // Sample blog posts data
  const posts = [
    {
      id: 1,
      username: "johndoe",
      profilePic: profilepic,
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
      username: "johndoe",
      profilePic: profilepic,
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
      description:
        "Beautiful birds i saw on the way home in galle.",
      tags: ["Crested Serpent Eagle", "Grey Heron"],
    },
  ];

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
          user: "currentuser",
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
                    user: "currentuser",
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowMenu(false);
    alert("Profile link copied to clipboard!");
  };

  const handleReport = () => {
    setShowMenu(false);
    alert("Report submitted. We'll review this account.");
  };

  const handleBlock = () => {
    setShowMenu(false);
    alert("This account has been blocked.");
  };

  // Prevent copying images
  const preventCopy = (e) => {
    e.preventDefault();
    alert("Copying is not allowed");
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className="bg-[white] w-full rounded-lg">
          {/* Profile Header */}
          <div className="flex items-center max-w-3xl w-full">
            <div className="overflow-hidden bg-white w-full">
              {/* Banner image with action buttons */}
              <div className="h-48 bg-gray-200 relative group">
                <img
                  src={bannerimg}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />

                {/* Action buttons in top right corner */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition text-sm">
                    Edit Profile
                  </button>
                  <div className="relative">
                    <button
                      className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {/* Dropdown menu */}
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={handleCopyLink}
                        >
                          Copy Link
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          onClick={handleReport}
                        >
                          Report
                        </button>
                        <button
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                          onClick={handleBlock}
                        >
                          Block Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile image - original position */}
                <div className="absolute left-6 bottom-0 translate-y-1/2 group">
                  <div className="relative w-36 h-36">
                    <img
                      src={profilepic}
                      alt="Profile"
                      className="w-36 h-36 rounded-full border-4 border-white object-cover bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Profile details - original position */}
              <div className="px-6 mt-20">
                {/* Name & Username */}
                <div>
                  <p className="text-2xl font-bold text-black">John Doe</p>
                  <p className="text-gray-500 text-sm">@johndoe</p>
                </div>

                {/* Bio */}
                <p className="mt-3 text-gray-800 text-sm leading-relaxed max-w-xl">
                  bio details Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Nobis illum gnissimos, illo vero hic magnam fuga tempora
                  assumenda inventore!
                </p>
                <br />

                {/* Followers & Following - centered */}
                <div className="flex justify-left gap-6 text-sm mb-2 text-gray-700">
                  <p>
                    <span className="font-semibold">150</span> Followers
                  </p>
                  <p>
                    <span className="font-semibold">120</span> Following
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* choosing for posts, articles and likes */}
          <div className="flex justify-around border-b border-gray-200">
            {["Posts", "Articles", "Likes"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-3 text-center font-medium transition ${
                  activeTab === tab
                    ? "text-[#143829] border-b-3 border-[#143829]"
                    : "text-gray-500 hover:text-[#143829]"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Post area */}
          <div className="space-y-6 p-4">
            {posts.map((post) => {
              const currentImg = currentImageIndex[post.id] || 0;
              const currentImage = post.images[currentImg];

              return (
                <div
                  key={post.id}
                  className="bg-[#f5f6f5] border  border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Post Header */}
                  <div className="flex items-center  justify-between p-4 border-b border-[#143829]">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.profilePic}
                        alt="Profile"
                        className="w-10 h-10 rounded-full  border-[#2b5b3f]"
                      />
                      <span className="font-semibold text-[#143829]">
                        @{post.username}
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
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                          >
                            ‹
                          </button>
                          <button
                            onClick={() =>
                              nextImage(post.id, post.images.length)
                            }
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
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
                              className={`w-1.5 h-1.5 rounded-full  ${
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
                      {/* Add comment */}
                      <div className="p-4 border-b border-[#2b5b3f]">
                        <div className="flex space-x-3">
                          <img
                            src={profilepic}
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
                                  src={profilepic}
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

                            {/* Reply form */}
                            {replyTo[`${post.id}-${comment.id}`] && (
                              <div className="mt-2 ml-4 flex space-x-2">
                                <img
                                  src={profilepic}
                                  alt="Your profile"
                                  className="w-6 h-6 rounded-full border border-[#2b5b3f]"
                                />
                                <div className="flex-1">
                                  <input
                                    value={
                                      newReply[`${postId}-${comment.id}`] || ""
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
                                      src={profilepic}
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
        </div>
      </div>
      <UserSidebarRight />

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
  );
};

export default Blog;
