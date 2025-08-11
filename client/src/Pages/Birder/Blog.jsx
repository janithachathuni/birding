import React, { useState } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, MoreHorizontal, Reply } from "lucide-react";

const Blog = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("posts");
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false); // Added back this line
  
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Kaveesha",
        username: "@avianenthusiast",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      birds: [
        {
          name: "Painted Stork",
          image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTuPJjCJyaDMrQB_4-FHVZ3QYPIMzvxELY_ajAROFMLY-_CWqcm-WELSnlaCa0s1wsaROF7roXhwPXZ00buC8EqCQ5ekt6cS4kNEf4QBFj_"
        }
      ],
      description: "Saw a beautiful Painted Stork today! Its colors were stunning.",
      timestamp: "2 days ago",
      likes: 124,
      isLiked: false,
      comments: 23,
      replies: [
        {
          id: 1,
          author: {
            name: "BirdExpert",
            username: "@ornithologist",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          content: "Great sighting! Was this at Yala National Park?",
          timestamp: "1 day ago",
          likes: 5,
          isLiked: false,
          replies: []
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "Kaveesha",
        username: "@avianenthusiast",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      birds: [
        {
          name: "Crested Serpent Eagle",
          image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTI5oXaG381DBsfDMlUwdwjRSLbFrBn71d63sOOkxSxKOkWCfR-6stVk-pNct9UeW_0HCMcji60yDbzpz_KMLFcowoL6iyb08YHULtbtwkh"
        },
        {
          name: "Sea Eagle",
          image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSaCecebnmCXtFlsEJASqOoRe903fAjZQNXT0FtS1unDP61pLi1FNmZrPol0aI4MNIgO0DyB8Zoe8wFdXbTPoCDyzJvr02FrALS5XENjGQh"
        }
      ],
      description: "Eagle watching in Alaska was incredible! Saw both Bald and Golden Eagles in their natural habitat.",
      timestamp: "1 week ago",
      likes: 89,
      isLiked: true,
      comments: 12,
      replies: []
    }
  ]);

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          } 
        : post
    ));
  };

  const toggleReplyLike = (postId, replyId, isNested = false) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (isNested) {
          return {
            ...post,
            replies: post.replies.map(reply => ({
              ...reply,
              replies: reply.replies.map(nestedReply => 
                nestedReply.id === replyId
                  ? {
                      ...nestedReply,
                      likes: nestedReply.isLiked ? nestedReply.likes - 1 : nestedReply.likes + 1,
                      isLiked: !nestedReply.isLiked
                    }
                  : nestedReply
              )
            }))
          };
        } else {
          return {
            ...post,
            replies: post.replies.map(reply => 
              reply.id === replyId
                ? {
                    ...reply,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                    isLiked: !reply.isLiked
                  }
                : reply
            )
          };
        }
      }
      return post;
    }));
  };

  const nextImage = (e, post) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === post.birds.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e, post) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => 
      prev === 0 ? post.birds.length - 1 : prev - 1
    );
  };

  const handleImageClick = (post) => {
    setSelectedImage(post);
    setCurrentImageIndex(0);
  };

  const handleCopy = (e) => {
    e.preventDefault();
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 2000);
    return false;
  };

  const preventDragHandler = (e) => {
    e.preventDefault();
  };

  const handleReplySubmit = (postId, parentReplyId = null) => {
    if (!replyContent.trim()) return;

    const newReply = {
      id: Math.floor(Math.random() * 10000),
      author: {
        name: "You",
        username: "@currentuser",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      content: replyContent,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      replies: []
    };

    setPosts(posts.map(post => {
      if (post.id === postId) {
        if (parentReplyId) {
          return {
            ...post,
            replies: post.replies.map(reply => 
              reply.id === parentReplyId
                ? { ...reply, replies: [...reply.replies, newReply] }
                : reply
            )
          };
        } else {
          return { ...post, replies: [...post.replies, newReply] };
        }
      }
      return post;
    }));

    setReplyContent("");
    setReplyingTo(null);
  };

  const toggleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const startReply = (replyId) => {
    setReplyingTo(replyId);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent("");
  };

  const ReplyComponent = ({ reply, postId, depth = 0 }) => {
    const isReplying = replyingTo === reply.id;
    
    return (
      <div className={`${depth > 0 ? 'ml-8 mt-2' : ''}`}>
        <div className="flex space-x-3">
          <img 
            src={reply.author.avatar} 
            alt={reply.author.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <div className="bg-white p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-sm">{reply.author.name}</span>
                  <span className="text-xs text-gray-500 ml-2">{reply.author.username}</span>
                </div>
                <span className="text-xs text-gray-500">{reply.timestamp}</span>
              </div>
              <p className="text-sm mt-1">{reply.content}</p>
              <div className="flex items-center mt-2 space-x-4 text-xs">
                <button 
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                  onClick={() => toggleReplyLike(postId, reply.id, depth > 0)}
                >
                  <Heart
                    className={`transition-colors ${reply.isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-gray-800"}`}
                    size={14}
                  />
                  <span>{reply.likes}</span>
                </button>
                <button 
                  className="text-gray-500 hover:text-amber-600"
                  onClick={() => startReply(reply.id)}
                >
                  <Reply size={14} className="mr-1" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {isReplying && (
          <div className="mt-3 ml-8">
            <div className="flex items-start space-x-3">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Your profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                  placeholder="Write a reply..."
                />
                <div className="flex space-x-2">
                  <button 
                    className="px-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    onClick={cancelReply}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                    onClick={() => handleReplySubmit(postId, reply.id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {reply.replies?.length > 0 && (
          <div className="space-y-3 mt-2">
            {reply.replies.map(nestedReply => (
              <ReplyComponent 
                key={nestedReply.id} 
                reply={nestedReply} 
                postId={postId}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      {showCopyMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          Copying images is not allowed
        </div>
      )}

      <UserSidebar />
      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className="w-full p-4">
          {/* Header Image */}
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=400" 
              alt="Blog Header" 
              className="w-full h-48 object-cover rounded-lg"
            />
            
            {/* Profile Picture */}
            <div className="absolute -bottom-16 left-4">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-16 pt-2">
            <p className="text-2xl font-bold text-gray-800">Kaveesha</p>
            <p className="text-gray-500">@avianenthusiast</p>
            <p className="mt-2 text-gray-700">
              Passionate birdwatcher and photographer. Documenting my avian adventures around the world.
            </p>
            
            <div className="flex mt-3 space-x-6">
              <div>
                <span className="font-bold">142</span> <span className="text-gray-500">Following</span>
              </div>
              <div>
                <span className="font-bold">1.2k</span> <span className="text-gray-500">Followers</span>
              </div>
              <div>
                <span className="font-bold">5.7k</span> <span className="text-gray-500">Bird Points</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-amber-200 mt-4">
            <button
              className={`w-1/3 py-4 text-center font-medium ${activeTab === "posts" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("posts")}
            >
              Your Posts
            </button>
            <button
              className={`w-1/3 py-4 text-center font-medium ${activeTab === "articles" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("articles")}
            >
              Articles
            </button>
            <button
              className={`w-1/3 py-4 text-center font-medium ${activeTab === "likes" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("likes")}
            >
              Likes
            </button>
          </div>

          {/* Posts */}
          <div className="mt-2 space-y-8">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{post.author.name}</h3>
                      <p className="text-xs text-gray-500">{post.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Bird Images */}
                <div className="relative">
                  <div 
                    className="relative w-full aspect-square bg-gray-100 cursor-pointer"
                    onClick={() => handleImageClick(post)}
                  >
                    <img 
                      src={post.birds[currentImageIndex].image} 
                      alt={post.birds[currentImageIndex].name}
                      className="w-full h-full object-cover select-none"
                      onContextMenu={handleCopy}
                      onDragStart={preventDragHandler}
                    />
                    
                    {post.birds.length > 1 && (
                      <>
                        <button 
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                          onClick={(e) => prevImage(e, post)}
                        >
                          <ChevronLeft />
                        </button>
                        <button 
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                          onClick={(e) => nextImage(e, post)}
                        >
                          <ChevronRight />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Post Description and Bird Tags */}
                <div className="p-4">
                  <p className="text-gray-800 mb-3">{post.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.birds.map((bird, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-amber-600 text-white text-sm rounded-full cursor-pointer hover:bg-amber-700"
                      >
                        {bird.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Likes/Comments */}
                <div className="p-4 border-t border-gray-200 flex justify-end">
                  <div className="flex items-center space-x-4">
                    <button 
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-800"
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart
                        className={`transition-colors ${post.isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-gray-800"}`}
                        size={20}
                      />
                      <span>{post.likes}</span>
                    </button>
                    <button 
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-800"
                      onClick={() => toggleExpandPost(post.id)}
                    >
                      <MessageCircle size={20} />
                      <span>{post.comments}</span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-800">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                {/* Replies Section */}
                {expandedPost === post.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 max-h-96 overflow-y-auto">
                    <div className="mb-4">
                      <div className="flex items-start space-x-3">
                        <img 
                          src="https://randomuser.me/api/portraits/women/44.jpg" 
                          alt="Your profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 flex space-x-2">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600"
                            placeholder="Write a reply..."
                          />
                          <button 
                            className="px-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                            onClick={() => handleReplySubmit(post.id)}
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>

                    {post.replies.length > 0 ? (
                      <div className="space-y-3">
                        {post.replies.map(reply => (
                          <ReplyComponent 
                            key={reply.id} 
                            reply={reply} 
                            postId={post.id}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No replies yet</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <UserSidebarRight />

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img 
              src={selectedImage.birds[currentImageIndex].image} 
              alt={selectedImage.birds[currentImageIndex].name}
              className="max-w-full max-h-screen object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={handleCopy}
              onDragStart={preventDragHandler}
            />
            
            {selectedImage.birds.length > 1 && (
              <>
                <button 
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(e, selectedImage);
                  }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(e, selectedImage);
                  }}
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  {currentImageIndex + 1} of {selectedImage.birds.length}
                </div>
              </>
            )}
            
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;