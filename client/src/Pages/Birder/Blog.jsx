import React from 'react';
import UserSidebar from '../../Components/UserSidebar';

const Blog = () => {
  // Sample blog posts data
  const posts = [
    {
      id: 1,
      type: 'text',
      username: 'digital-dreamer',
      avatar: 'https://i.imgur.com/8Km9tLL.jpg',
      content: 'Just had the most incredible idea for a new project. The kind that keeps you up at night with excitement. Going to start sketching it out tomorrow!',
      tags: ['creativity', 'inspiration', 'design'],
      timestamp: '2 hours ago',
      likes: 24,
      reblogs: 5,
      comments: 3
    },
    {
      id: 2,
      type: 'image',
      username: 'urban-explorer',
      avatar: 'https://i.imgur.com/JNc0VXr.jpg',
      content: 'https://i.imgur.com/nN5XUf9.jpg',
      caption: 'Found this hidden alleyway today. The graffiti artists in this city are next level.',
      tags: ['photography', 'streetart', 'citylife'],
      timestamp: '5 hours ago',
      likes: 142,
      reblogs: 28,
      comments: 12
    },
    {
      id: 3,
      type: 'quote',
      username: 'bookworm',
      avatar: 'https://i.imgur.com/3JHeIIh.jpg',
      content: '"The only way to do great work is to love what you do."',
      source: 'Steve Jobs',
      tags: ['inspiration', 'motivation'],
      timestamp: '1 day ago',
      likes: 89,
      reblogs: 17,
      comments: 4
    }
  ];

  const Post = ({ post }) => {
    return (
      <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
        <div className="flex items-center mb-3">
          <img 
            src={post.avatar} 
            alt={post.username} 
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{post.username}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        
        {post.type === 'text' && (
          <p className="mb-3 text-gray-800">{post.content}</p>
        )}
        
        {post.type === 'image' && (
          <div className="mb-3">
            <img 
              src={post.content} 
              alt={post.caption} 
              className="w-full rounded-md"
            />
            {post.caption && <p className="mt-2 text-gray-700">{post.caption}</p>}
          </div>
        )}
        
        {post.type === 'quote' && (
          <blockquote className="mb-3 border-l-4 border-gray-300 pl-4 italic text-gray-700">
            <p className="text-lg">"{post.content}"</p>
            {post.source && <p className="mt-1 text-sm">— {post.source}</p>}
          </blockquote>
        )}
        
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(tag => (
            <span 
              key={tag} 
              className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-gray-500 text-sm border-t pt-3">
          <button className="flex items-center mr-4 hover:text-pink-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </button>
          <button className="flex items-center mr-4 hover:text-green-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {post.reblogs}
          </button>
          <button className="flex items-center hover:text-blue-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen ">
      <UserSidebar />
      <div className="flex-1 p-8 ml-[20%] mr-[30%]">
        <div className="max-w-2xl mx-auto">
          {/* Create Post Button */}
          <button className="w-full mb-6 bg-white p-4 rounded-lg  border border-gray-200 text-left hover:bg-gray-50">
            <p className="text-gray-500">What's on your mind?</p>
          </button>
          
          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;