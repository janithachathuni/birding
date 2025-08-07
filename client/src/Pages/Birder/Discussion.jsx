import React, { useState } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { FaArrowLeft, FaEllipsisH, FaReply, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Discussion = () => {
  // Sample discussion data
  const [discussion, setDiscussion] = useState({
    title: "Who is this bird",
    author: {
      name: "BirdWatcher42",
      username: "@birdlover123",
      avatar: "data:image/jpeg;base64,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"
    },
    description: "I saw this bird in my backyard and I'm not sure what it is. Can anyone help identify it?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Pyrrhula_pyrrhula_female_2.jpg/500px-Pyrrhula_pyrrhula_female_2.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Bullfinch_male.jpg/500px-Bullfinch_male.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Euphonia_laniirostris_%28Eufonia_gorgiamarilla%29_-_Macho_%2814010810322%29.jpg/500px-Euphonia_laniirostris_%28Eufonia_gorgiamarilla%29_-_Macho_%2814010810322%29.jpg"
    ],
    timestamp: "2 hours ago"
  });

  // Sample comments data
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "OrnithologyExpert",
        username: "@birdpro",
        avatar: "/expert-avatar.jpg"
      },
      content: "This appears to be a rare yellow-bellied finch variant. Where exactly did you spot it?",
      timestamp: "1 hour ago",
      replies: [
        {
          id: 101,
          author: {
            name: "BirdWatcher42",
            username: "@birdlover123",
            avatar: "/default-avatar.jpg"
          },
          content: "In my backyard in Portland, near the oak tree.",
          timestamp: "45 minutes ago"
        }
      ]
    },
    {
      id: 2,
      author: {
        name: "NaturePhotographer",
        username: "@lensmaster",
        avatar: "/photographer-avatar.jpg"
      },
      content: "Great sighting! The second photo clearly shows the wing pattern that helps identify it.",
      timestamp: "30 minutes ago",
      replies: []
    }
  ]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  // Image navigation
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === discussion.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? discussion.images.length - 1 : prev - 1
    );
  };

  // Comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObj = {
      id: comments.length + 1,
      author: {
        name: "CurrentUser",
        username: "@currentuser",
        avatar: "/current-avatar.jpg"
      },
      content: newComment,
      timestamp: "Just now",
      replies: []
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  // Reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyingTo.content.trim()) return;

    const newReply = {
      id: Math.floor(Math.random() * 1000),
      author: {
        name: "CurrentUser",
        username: "@currentuser",
        avatar: "/current-avatar.jpg"
      },
      content: replyingTo.content,
      timestamp: "Just now"
    };

    setComments(prev =>
      prev.map(comment =>
        comment.id === replyingTo.commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
    setReplyingTo(null);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="w-full space-y-4">
          {/* Discussion Header */}
          <div className="p-4 bg-[#f5f6f5] rounded-lg">
            {/* Discussion Content */}
            <div className="rounded-lg">
              {/* Author Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={discussion.author.avatar} 
                    alt={discussion.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{discussion.author.name}</h3>
                    <p className="text-xs text-gray-500">{discussion.author.username}</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-[#506142]">
                  <FaEllipsisH />
                </button>
              </div>

              {/* Discussion Title */}
              <p className="text-xl font-semibold text-[#506142] mb-3">{discussion.title}</p>

              {/* Discussion Description */}
              <p className="text-gray-700 mb-4">{discussion.description}</p>

              {/* Image Gallery */}
              {discussion.images.length > 0 && (
                <div className="relative mb-4">
                  <div className="relative w-full max-h-96 bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center">
                    <img 
                      src={discussion.images[currentImageIndex]} 
                      alt="Discussion visual"
                      className="max-w-full max-h-full object-contain"
                    />
                    
                    {/* Navigation arrows */}
                    {discussion.images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                          <FaChevronLeft />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Image counter */}
                  {discussion.images.length > 1 && (
                    <div className="text-center text-sm text-gray-500 mt-2">
                      Image {currentImageIndex + 1} of {discussion.images.length}
                    </div>
                  )}
                </div>
              )}

              {/* Discussion Timestamp */}
              <div className="text-sm text-gray-500 pt-3 border-t border-gray-200">
                {discussion.timestamp}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-4 bg-[#f5f6f5] rounded-lg">
            <h3 className="font-semibold text-lg mb-4">Comments ({comments.length})</h3>
            
            {/* New Comment Form (Moved to top) */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#506142]"
                  placeholder="Add a comment..."
                />
                <button 
                  type="submit"
                  className="px-4 py-3 bg-[#506142] text-white rounded-lg hover:bg-[#3a4a32]"
                >
                  Post
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="bg-white p-4 rounded-lg ">
                  {/* Comment Author */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={comment.author.avatar} 
                        alt={comment.author.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium text-sm">{comment.author.name}</h4>
                        <p className="text-xs text-gray-500">{comment.author.username}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                  </div>

                  {/* Comment Content */}
                  <p className="text-gray-700 mb-3">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4 text-sm border-t border-gray-100 pt-3">
                    <button 
                      onClick={() => setReplyingTo({
                        commentId: comment.id,
                        content: `@${comment.author.username} `
                      })}
                      className="flex items-center space-x-1 text-gray-500 hover:text-[#506142]"
                    >
                      <FaReply size={14} />
                      <span>Reply</span>
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 pl-6 border-l-2 border-gray-200 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="pt-3">
                          {/* Reply Author */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <img 
                                src={reply.author.avatar} 
                                alt={reply.author.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="font-medium text-xs">{reply.author.name}</span>
                            </div>
                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                          </div>

                          {/* Reply Content */}
                          <p className="text-gray-700 text-sm mb-2">{reply.content}</p>

                          {/* Reply Actions */}
                          <div className="flex items-center space-x-3 text-xs">
                            <button 
                              onClick={() => setReplyingTo({
                                commentId: comment.id,
                                content: `@${reply.author.username} `
                              })}
                              className="text-gray-500 hover:text-[#506142]"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Form */}
                  {replyingTo?.commentId === comment.id && (
                    <form onSubmit={handleReplySubmit} className="mt-3 pl-6">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={replyingTo.content}
                          onChange={(e) => setReplyingTo({
                            ...replyingTo,
                            content: e.target.value
                          })}
                          className="flex-1 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#506142]"
                          placeholder="Write your reply..."
                        />
                        <button 
                          type="submit"
                          className="px-3 py-2 bg-[#506142] text-white text-sm rounded hover:bg-[#3a4a32]"
                        >
                          Post
                        </button>
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <UserSidebarRight />
    </div>
  );
};

export default Discussion;