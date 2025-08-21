"use client"

import { useState } from "react"
import UserSidebar from "../../Components/UserSidebar"
import UserSidebarRight from "../../Components/UserSidebarRight"

import {
  Heart,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Reply,
  Flag,
  UserPlus,
  UserMinus,
  Shield,
  Link2,
} from "lucide-react"

const Blog = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("posts")
  const [expandedPost, setExpandedPost] = useState(null)
  const [replyContent, setReplyContent] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [showCopyMessage, setShowCopyMessage] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [followingUsers, setFollowingUsers] = useState(new Set())
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: {
        name: "Kaveesha",
        username: "@avianenthusiast",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      birds: [
        {
          name: "Painted Stork",
          image:
            "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTuPJjCJyaDMrQB_4-FHVZ3QYPIMzvxELY_ajAROFMLY-_CWqcm-WELSnlaCa0s1wsaROF7roXhwPXZ00buC8EqCQ5ekt6cS4kNEf4QBFj_",
        },
        {
          name: "Blue Jay",
          image:
            "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSaCecebnmCXtFlsEJASqOoRe903fAjZQNXT0FtS1unDP61pLi1FNmZrPol0aI4MNIgO0DyB8Zoe8wFdXbTPoCDyzJvr02FrALS5XENjGQh",
        },
        {
          name: "Cardinal",
          image:
            "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTI5oXaG381DBsfDMlUwdwjRSLbFrBn71d63sOOkxSxKOkWCfR-6stVk-pNct9UeW_0HCMcji60yDbzpz_KMLFcowoL6iyb08YHULtbtwkh",
        },
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
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          },
          content: "Great sighting! Was this at Yala National Park?",
          timestamp: "1 day ago",
          likes: 5,
          isLiked: false,
          replies: [],
        },
      ],
    },
    {
      id: 2,
      author: {
        name: "Kaveesha",
        username: "@avianenthusiast",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      birds: [
        {
          name: "Crested Serpent Eagle",
          image:
            "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTI5oXaG381DBsfDMlUwdwjRSLbFrBn71d63sOOkxSxKOkWCfR-6stVk-pNct9UeW_0HCMcji60yDbzpz_KMLFcowoL6iyb08YHULtbtwkh",
        },
        {
          name: "Sea Eagle",
          image:
            "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSaCecebnmCXtFlsEJASqOoRe903fAjZQNXT0FtS1unDP61pLi1FNmZrPol0aI4MNIgO0DyB8Zoe8wFdXbTPoCDyzJvr02FrALS5XENjGQh",
        },
      ],
      description: "Eagle watching in Alaska was incredible! Saw both Bald and Golden Eagles in their natural habitat.",
      timestamp: "1 week ago",
      likes: 89,
      isLiked: true,
      comments: 12,
      replies: [],
    },
  ])

  const nextImage = (postId) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    setCurrentImageIndex((prev) => (prev === post.birds.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (postId) => {
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    setCurrentImageIndex((prev) => (prev === 0 ? post.birds.length - 1 : prev - 1))
  }

  const toggleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post,
      ),
    )
  }

  const toggleReplyLike = (postId, replyId, isNested = false) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (isNested) {
            return {
              ...post,
              replies: post.replies.map((reply) => ({
                ...reply,
                replies: reply.replies.map((nestedReply) =>
                  nestedReply.id === replyId
                    ? {
                        ...nestedReply,
                        likes: nestedReply.isLiked ? nestedReply.likes - 1 : nestedReply.likes + 1,
                        isLiked: !nestedReply.isLiked,
                      }
                    : nestedReply,
                ),
              })),
            }
          } else {
            return {
              ...post,
              replies: post.replies.map((reply) =>
                reply.id === replyId
                  ? {
                      ...reply,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      isLiked: !reply.isLiked,
                    }
                  : reply,
              ),
            }
          }
        }
        return post
      }),
    )
  }

  const handleImageClick = (post) => {
    setSelectedImage(post)
    setCurrentImageIndex(0)
  }

  const handleCopy = (e) => {
    e.preventDefault()
    setShowCopyMessage(true)
    setTimeout(() => setShowCopyMessage(false), 2000)
    return false
  }

  const preventDragHandler = (e) => {
    e.preventDefault()
  }

  const handleReplySubmit = (postId, parentReplyId = null) => {
    if (!replyContent.trim()) return

    const newReply = {
      id: Math.floor(Math.random() * 10000),
      author: {
        name: "You",
        username: "@currentuser",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      content: replyContent,
      timestamp: "Just now",
      likes: 0,
      isLiked: false,
      replies: [],
    }

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          if (parentReplyId) {
            return {
              ...post,
              replies: post.replies.map((reply) =>
                reply.id === parentReplyId ? { ...reply, replies: [...reply.replies, newReply] } : reply,
              ),
            }
          } else {
            return { ...post, replies: [...post.replies, newReply] }
          }
        }
        return post
      }),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const toggleExpandPost = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId)
  }

  const startReply = (replyId) => {
    setReplyingTo(replyId)
  }

  const cancelReply = () => {
    setReplyingTo(null)
    setReplyContent("")
  }

  const toggleDropdown = (postId) => {
    setActiveDropdown(activeDropdown === postId ? null : postId)
  }

  const toggleFollow = (username) => {
    setFollowingUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(username)) {
        newSet.delete(username)
      } else {
        newSet.add(username)
      }
      return newSet
    })
    setActiveDropdown(null)
  }

  const handleDropdownAction = (action, post) => {
    switch (action) {
      case "report":
        alert("Post reported")
        break
      case "block":
        alert(`User ${post.author.username} blocked`)
        break
      case "copy":
        navigator.clipboard.writeText(window.location.href)
        setShowCopyMessage(true)
        setTimeout(() => setShowCopyMessage(false), 2000)
        break
      default:
        break
    }
    setActiveDropdown(null)
  }

  const ReplyComponent = ({ reply, postId, depth = 0 }) => {
    const isReplying = replyingTo === reply.id
    const [localReplyContent, setLocalReplyContent] = useState("")

    const handleLocalReplySubmit = () => {
      if (!localReplyContent.trim()) return

      const newReply = {
        id: Math.floor(Math.random() * 10000),
        author: {
          name: "You",
          username: "@currentuser",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        content: localReplyContent,
        timestamp: "Just now",
        likes: 0,
        isLiked: false,
        replies: [],
      }

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              replies: post.replies.map((r) => (r.id === reply.id ? { ...r, replies: [...r.replies, newReply] } : r)),
            }
          }
          return post
        }),
      )

      setLocalReplyContent("")
      setReplyingTo(null)
    }

    return (
      <div className={`${depth > 0 ? "ml-8 mt-2" : ""}`}>
        <div className="flex space-x-3">
          <img
            src={reply.author.avatar || "/placeholder.svg"}
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
              <div className="flex items-center justify-end mt-2 space-x-4 text-xs">
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
                  className="flex items-center space-x-1 text-gray-500 hover:text-[#506142]"
                  onClick={() => startReply(reply.id)}
                >
                  <Reply size={14} />
                  <span>Reply</span>
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
                  value={localReplyContent}
                  onChange={(e) => setLocalReplyContent(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#506142]"
                  placeholder="Write a reply..."
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button className="px-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300" onClick={cancelReply}>
                    Cancel
                  </button>
                  <button
                    className="px-3 bg-[#506142] text-white rounded-lg hover:bg-[#3d4a32]"
                    onClick={handleLocalReplySubmit}
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
            {reply.replies.map((nestedReply) => (
              <ReplyComponent key={nestedReply.id} reply={nestedReply} postId={postId} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      {showCopyMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow-lg z-50">
          Link copied to clipboard
        </div>
      )}

      <UserSidebar />
      <div className="flex flex-1 ml-[20%] mr-[30%]">
        <div className="w-full p-4 bg-[#f5f6f5]">
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            {/* Cover Image - no padding to container walls */}
            <div className="relative h-48">
              <img
                src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&h=400"
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex items-start justify-between -mt-16 mb-4">
                {/* Profile Picture */}
                <img
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                />

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-16">
                  <button className="px-6 py-2 bg-[#506142] text-white rounded-full font-medium hover:bg-[#3d4a32] transition-colors">
                    Follow
                  </button>
                  <button className="px-6 py-2 border-2 border-[#506142] text-[#506142] rounded-full font-medium hover:bg-[#506142] hover:text-white transition-colors">
                    Message
                  </button>
                </div>
              </div>

              {/* Name and Bio */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Kaveesha</h1>
                <p className="text-[#506142] font-medium mb-3">@avianenthusiast</p>
                <p className="text-gray-700 max-w-md">
                  Passionate birdwatcher and photographer 📸 Documenting my avian adventures around the world 🌍 Nature
                  enthusiast
                </p>
              </div>

              {/* Stats */}
              <div className="flex space-x-8 text-sm">
                <div>
                  <span className="font-bold text-gray-900">142</span>
                  <span className="text-gray-500 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900">1.2k</span>
                  <span className="text-gray-500 ml-1">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-[#506142]">5.7k</span>
                  <span className="text-gray-500 ml-1">Bird Points</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm mb-4">
            <div className="flex">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
                  activeTab === "posts" ? "bg-[#506142] text-white" : "text-gray-600 hover:text-[#506142]"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Your Posts
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
                  activeTab === "articles" ? "bg-[#506142] text-white" : "text-gray-600 hover:text-[#506142]"
                }`}
                onClick={() => setActiveTab("articles")}
              >
                Articles
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium rounded-lg transition-colors ${
                  activeTab === "likes" ? "bg-[#506142] text-white" : "text-gray-600 hover:text-[#506142]"
                }`}
                onClick={() => setActiveTab("likes")}
              >
                Likes
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                {/* Post Header with Dropdown */}
                <div className="pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.author.avatar || "/placeholder.svg"}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{post.author.name}</h3>
                        <p className="text-sm text-gray-500">{post.timestamp}</p>
                      </div>
                    </div>
                    {/* Dropdown Menu */}
                    <div className="relative">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                        onClick={() => toggleDropdown(post.id)}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {activeDropdown === post.id && (
                        <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border py-1 z-10">
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            onClick={() => toggleFollow(post.author.username)}
                          >
                            {followingUsers.has(post.author.username) ? (
                              <>
                                <UserMinus size={14} />
                                <span>Unfollow {post.author.username}</span>
                              </>
                            ) : (
                              <>
                                <UserPlus size={14} />
                                <span>Follow {post.author.username}</span>
                              </>
                            )}
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            onClick={() => handleDropdownAction("copy", post)}
                          >
                            <Link2 size={14} />
                            <span>Copy link</span>
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                            onClick={() => handleDropdownAction("report", post)}
                          >
                            <Flag size={14} />
                            <span>Report post</span>
                          </button>
                          <button
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            onClick={() => handleDropdownAction("block", post)}
                          >
                            <Shield size={14} />
                            <span>Block {post.author.username}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {post.birds.length > 0 && (
                  <div className="relative my-4">
                    <div className="relative w-full max-h-96 bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center">
                      <img
                        src={post.birds[currentImageIndex].image || "/placeholder.svg"}
                        alt={post.birds[currentImageIndex].name}
                        className="max-w-full max-h-full object-contain cursor-pointer select-none"
                        onClick={() => handleImageClick(post)}
                        onContextMenu={handleCopy}
                        onDragStart={preventDragHandler}
                      />

                      {/* Navigation arrows - matching discussion style */}
                      {post.birds.length > 1 && (
                        <>
                          <button
                            onClick={() => prevImage(post.id)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 bg-opacity-50 text-white p-2 rounded-full"
                          >
                            <ChevronLeft />
                          </button>
                          <button
                            onClick={() => nextImage(post.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 bg-opacity-50 text-white p-2 rounded-full"
                          >
                            <ChevronRight />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Image counter - matching discussion style */}
                    {post.birds.length > 1 && (
                      <div className="text-center text-sm text-gray-500 mt-2">
                        Image {currentImageIndex + 1} of {post.birds.length}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-gray-800 mb-3">{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.birds.map((bird, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-[#506142] text-white text-sm rounded-full cursor-pointer hover:bg-[#3d4a32] transition-colors"
                      >
                        {bird.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Likes/Comments */}
                <div className="pt-3 border-t border-gray-100 flex justify-end">
                  <div className="flex items-center space-x-4">
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart
                        className={`transition-colors ${post.isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                        size={20}
                      />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      className="flex items-center space-x-1 text-gray-500 hover:text-[#506142]"
                      onClick={() => toggleExpandPost(post.id)}
                    >
                      <MessageCircle size={20} />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </div>

                {expandedPost === post.id && (
                  <div className="border-t border-gray-100 bg-[#f5f6f5] p-4 mt-4 rounded-lg max-h-96 overflow-y-auto">
                    {/* Only show main reply input if not replying to a specific reply */}
                    {!replyingTo && (
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
                              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#506142]"
                              placeholder="Write a reply..."
                            />
                            <button
                              className="px-4 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3d4a32] transition-colors"
                              onClick={() => handleReplySubmit(post.id)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {post.replies.length > 0 ? (
                      <div className="space-y-3">
                        {post.replies.map((reply) => (
                          <ReplyComponent key={reply.id} reply={reply} postId={post.id} />
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

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-screen">
            <img
              src={selectedImage.birds[currentImageIndex].image || "/placeholder.svg"}
              alt={selectedImage.birds[currentImageIndex].name}
              className="max-w-full max-h-screen object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              onContextMenu={handleCopy}
              onDragStart={preventDragHandler}
            />
            {selectedImage.birds.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 bg-opacity-50 text-white p-3 rounded-full"
                  onClick={() => prevImage(selectedImage.id)}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 bg-opacity-50 text-white p-3 rounded-full"
                  onClick={() => nextImage(selectedImage.id)}
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                  Image {currentImageIndex + 1} of {selectedImage.birds.length}
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

      {/* Click outside to close dropdown */}
      {activeDropdown && <div className="fixed inset-0 z-5" onClick={() => setActiveDropdown(null)} />}
    </div>
  )
}

export default Blog
