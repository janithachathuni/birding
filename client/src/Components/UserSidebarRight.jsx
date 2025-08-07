import React from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaArrowUp, FaArrowDown, FaRegComment } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

const UserSidebarRight = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Sample data for search topics (categories/tags)
  const searchTopics = [
    { id: 1, name: "Bird Identification", count: 245 },
    { id: 2, name: "Bird Photography", count: 189 },
    { id: 3, name: "Birdwatching Tips", count: 132 },
    { id: 4, name: "Birding Equipment", count: 76 }
  ];

  // Sample data for popular discussions
  const popularDiscussions = [
    {
      id: 1,
      title: "Is this a juvenile Bald Eagle or Golden Eagle?",
      author: "EagleWatcher",
      replies: 42,
      upvotes: 156,
      downvotes: 5,
      topic: "Bird Identification",
      timestamp: "3 hours ago"
    },
    {
      id: 2,
      title: "Best locations for shorebird photography in Florida",
      author: "ShoreBirdLover",
      replies: 28,
      upvotes: 112,
      downvotes: 3,
      topic: "Bird Photography",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      title: "Unusual crow behavior - should I be concerned?",
      author: "UrbanBirdObserver",
      replies: 35,
      upvotes: 98,
      downvotes: 7,
      topic: "Birdwatching Tips",
      timestamp: "1 day ago"
    }
  ];

  const [discussions, setDiscussions] = React.useState(popularDiscussions);

  const handleVote = (id, type) => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === id) {
        return {
          ...discussion,
          upvotes: type === 'up' ? discussion.upvotes + 1 : discussion.upvotes,
          downvotes: type === 'down' ? discussion.downvotes + 1 : discussion.downvotes
        };
      }
      return discussion;
    }));
  };

  // Page-specific content
  const renderPageSpecificContent = () => {
    switch(currentPath) {
      case '/birder/forum':
        return (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#506142]"
              />
              <FaSearch className="absolute right-3 top-3.5 text-gray-400" />
            </div>

            {/* Search Topics Section */}
            <div>
              <h3 className="font-medium text-sm mb-2 text-gray-500">SEARCH TOPICS</h3>
              <div className="space-y-2">
                {searchTopics.map(topic => (
                  <div key={topic.id} className="flex justify-between items-center p-2 hover:bg-[#f5f6f5] rounded-lg cursor-pointer">
                    <span className="text-sm font-medium">{topic.name}</span>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">{topic.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Discussions Section */}
            <div>
              <h3 className="font-medium text-sm mb-2 text-gray-500">POPULAR DISCUSSIONS</h3>
              <div className="space-y-3">
                {discussions.map(discussion => (
                  <div key={discussion.id} className="bg-[#f5f6f5] p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#506142] hover:underline cursor-pointer text-sm">
                          {discussion.title}
                        </h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>by {discussion.author}</span>
                          <span className="mx-1">•</span>
                          <span>{discussion.timestamp}</span>
                        </div>
                        <div className="mt-2">
                          <span className="px-2 py-0.5 bg-gray-200 text-xs rounded-full">
                            {discussion.topic}
                          </span>
                        </div>
                      </div>
                      
                      {/* Voting UI */}
                      <div className="flex flex-col items-center ml-2">
                        <button 
                          onClick={() => handleVote(discussion.id, 'up')}
                          className="p-1 text-gray-500 hover:text-green-500"
                        >
                          <FaArrowUp size={14} />
                        </button>
                        <span className="my-1 text-xs font-medium">
                          {discussion.upvotes - discussion.downvotes}
                        </span>
                        <button 
                          onClick={() => handleVote(discussion.id, 'down')}
                          className="p-1 text-gray-500 hover:text-red-500"
                        >
                          <FaArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 text-xs">
                      <div className="flex items-center text-gray-500">
                        <FaRegComment className="mr-1" size={12} />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <button className="flex items-center text-gray-500 hover:text-[#506142]">
                        <FiShare2 className="mr-1" size={12} />
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case '/messages':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <button className="w-full bg-[#506142] text-white py-2 rounded-lg">
              New Message
            </button>
          </div>
        );
      case '/profile':
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Profile Stats</h3>
            <div className="flex justify-between text-sm">
              <span>Posts: 24</span>
              <span>Followers: 156</span>
              <span>Following: 89</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/birder/forum" className="text-[#506142] hover:underline">Go to Forum</a></li>
              <li><a href="/profile" className="text-[#506142] hover:underline">View Profile</a></li>
              <li><a href="/settings" className="text-[#506142] hover:underline">Account Settings</a></li>
            </ul>
          </div>
        );
    }
  };

  return (
  <div className="fixed top-0 right-0 h-screen w-[30%] bg-white flex flex-col border-l border-gray-200">
    {/* Scrollable content area */}
    <div className="flex-1 overflow-y-auto p-4">
      {renderPageSpecificContent()}
    </div>
    
    {/* Sticky footer */}
    <div className="border-t border-gray-200 p-4 bg-white">
      <p className="text-xs text-gray-500">© 2025 Kurullo</p>
    </div>
  </div>
);
};

export default UserSidebarRight;