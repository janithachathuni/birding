import React, { useState } from "react";
import UserSidebar from "../../Components/AdminSidebar";
import { FaUsers, FaImages, FaHeart, FaEye, FaComments, FaCalendarAlt, FaArrowUp, FaArrowDown } from "react-icons/fa";

const Statistics = () => {
  // Sample data for posts per month
  const postsData = [
    { month: 'Jan', posts: 45, change: 12 },
    { month: 'Feb', posts: 62, change: 38 },
    { month: 'Mar', posts: 38, change: -39 },
    { month: 'Apr', posts: 71, change: 87 },
    { month: 'May', posts: 89, change: 25 },
    { month: 'Jun', posts: 95, change: 7 },
    { month: 'Jul', posts: 103, change: 8 },
    { month: 'Aug', posts: 87, change: -16 },
    { month: 'Sep', posts: 76, change: -13 },
    { month: 'Oct', posts: 82, change: 8 },
    { month: 'Nov', posts: 91, change: 11 },
    { month: 'Dec', posts: 108, change: 19 }
  ];

  // Sample data for new users
  const usersData = [
    { month: 'Jan', users: 12, change: 20 },
    { month: 'Feb', users: 18, change: 50 },
    { month: 'Mar', users: 9, change: -50 },
    { month: 'Apr', users: 23, change: 156 },
    { month: 'May', users: 31, change: 35 },
    { month: 'Jun', users: 28, change: -10 },
    { month: 'Jul', users: 35, change: 25 },
    { month: 'Aug', users: 29, change: -17 },
    { month: 'Sep', users: 22, change: -24 },
    { month: 'Oct', users: 26, change: 18 },
    { month: 'Nov', users: 33, change: 27 },
    { month: 'Dec', users: 41, change: 24 }
  ];

  // Sample data for bird categories
  const categoryData = [
    { name: 'Endemic Birds', count: 156, percentage: 35, color: '#506142' },
    { name: 'Migratory Birds', count: 124, percentage: 28, color: '#6b7c5a' },
    { name: 'Resident Birds', count: 187, percentage: 42, color: '#859772' },
    { name: 'Vagrant Birds', count: 35, percentage: 8, color: '#a0b38a' }
  ];

  // Sample popular posts data
  const popularPosts = [
    {
      id: 1,
      title: "Sri Lanka Blue Magpie in Sinharaja",
      author: "NaturePhotoLK",
      likes: 342,
      comments: 28,
      views: 1250,
      date: "2024-12-15"
    },
    {
      id: 2,
      title: "Serendib Scops Owl - First Sighting",
      author: "BirdWatcher92",
      likes: 298,
      comments: 45,
      views: 980,
      date: "2024-12-10"
    },
    {
      id: 3,
      title: "Ceylon Junglefowl Family",
      author: "WildlifeSL",
      likes: 287,
      comments: 32,
      views: 1100,
      date: "2024-12-08"
    },
    {
      id: 4,
      title: "Crimson-fronted Barbet Feeding",
      author: "AvianExplorer",
      likes: 245,
      comments: 19,
      views: 890,
      date: "2024-12-05"
    },
    {
      id: 5,
      title: "White-eye Flock in Horton Plains",
      author: "MountainBirds",
      likes: 203,
      comments: 24,
      views: 750,
      date: "2024-12-03"
    }
  ];

  // Monthly engagement data
  const engagementData = [
    { month: 'Jan', likes: 1250, comments: 340, views: 8900 },
    { month: 'Feb', likes: 1680, comments: 420, views: 11200 },
    { month: 'Mar', likes: 1190, comments: 285, views: 7800 },
    { month: 'Apr', likes: 2100, comments: 580, views: 14500 },
    { month: 'May', likes: 2850, comments: 720, views: 18900 },
    { month: 'Jun', likes: 3200, comments: 840, views: 22100 },
    { month: 'Jul', likes: 3650, comments: 950, views: 25800 },
    { month: 'Aug', likes: 3100, comments: 810, views: 21300 },
    { month: 'Sep', likes: 2750, comments: 690, views: 18700 },
    { month: 'Oct', likes: 2950, comments: 740, views: 20200 },
    { month: 'Nov', likes: 3350, comments: 880, views: 23600 },
    { month: 'Dec', likes: 3800, comments: 1020, views: 28900 }
  ];

  // Calculate totals
  const totalPosts = postsData.reduce((sum, item) => sum + item.posts, 0);
  const totalUsers = usersData.reduce((sum, item) => sum + item.users, 0);
  const totalLikes = engagementData.reduce((sum, item) => sum + item.likes, 0);
  const totalViews = engagementData.reduce((sum, item) => sum + item.views, 0);

  const [selectedPeriod, setSelectedPeriod] = useState('year');

  // Simple bar chart component with axes
  const SimpleBarChart = ({ data, dataKey, color, height = 250, title }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    const minValue = Math.min(...data.map(item => item[dataKey]));
    const range = maxValue - minValue;
    const chartHeight = height - 80; // Reserve space for labels
    
    // Generate Y-axis labels (5 evenly spaced values)
    const yAxisLabels = [];
    for (let i = 0; i <= 4; i++) {
      const value = Math.round(minValue + (range * i / 4));
      yAxisLabels.push(value);
    }
    yAxisLabels.reverse(); // Top to bottom
    
    return (
      <div className="w-full">
        <div className="flex">
          {/* Y-axis */}
          <div className="flex flex-col justify-between mr-3" style={{ height: `${chartHeight}px` }}>
            {yAxisLabels.map((label, index) => (
              <div key={index} className="text-xs text-gray-500 text-right w-8">
                {label}
              </div>
            ))}
          </div>
          
          {/* Chart area */}
          <div className="flex-1">
            {/* Grid lines */}
            <div className="relative" style={{ height: `${chartHeight}px` }}>
              {/* Horizontal grid lines */}
              {yAxisLabels.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-gray-200"
                  style={{
                    top: `${(index * chartHeight) / 4}px`
                  }}
                />
              ))}
              
              {/* Bars */}
              <div className="flex items-end justify-between h-full relative">
                {data.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1 h-full justify-end">
                    <div
                      className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 relative"
                      style={{
                        backgroundColor: color,
                        height: `${((item[dataKey] - minValue) / range) * chartHeight}px`,
                        minHeight: '4px'
                      }}
                      title={`${item.month}: ${item[dataKey]}`}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-2">
              {data.map((item, index) => (
                <div key={index} className="text-xs text-gray-600 text-center flex-1">
                  {item.month}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* X-axis title */}
        <div className="text-center mt-2">
          <span className="text-xs text-gray-500">Months</span>
        </div>
        
        {/* Y-axis title */}
        <div className="absolute left-2 top-1/2 transform -rotate-90 -translate-y-1/2">
          <span className="text-xs text-gray-500">{title}</span>
        </div>
      </div>
    );
  };

  // Simple progress bar for categories
  const ProgressBar = ({ percentage, color }) => (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full transition-all duration-500"
        style={{ 
          width: `${percentage}%`, 
          backgroundColor: color 
        }}
      />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%]">
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="bg-[#f5f6f5] rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Statistics</h1>
                <p className="text-gray-600">Overview of platform activity and engagement</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-[#506142]" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent bg-white"
                >
                  <option value="year">This Year</option>
                  <option value="month">This Month</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#f5f6f5] rounded-lg p-6 border-l-4 border-[#506142]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-800">{totalPosts.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                    <span className="text-sm text-green-600">+12% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-[#506142] rounded-full">
                  <FaImages className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-[#f5f6f5] rounded-lg p-6 border-l-4 border-[#506142]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Users</p>
                  <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                    <span className="text-sm text-green-600">+24% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-[#506142] rounded-full">
                  <FaUsers className="text-white text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-[#f5f6f5] rounded-lg p-6 border-l-4 border-[#506142]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-800">{totalLikes.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                    <span className="text-sm text-green-600">+18% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-[#506142] rounded-full">
                  <FaHeart className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* <div className="bg-[#f5f6f5] rounded-lg p-6 border-l-4 border-[#506142]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-800">{(totalViews / 1000).toFixed(1)}K</p>
                  <div className="flex items-center mt-2">
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                    <span className="text-sm text-green-600">+15% this month</span>
                  </div>
                </div>
                <div className="p-3 bg-[#506142] rounded-full">
                  <FaEye className="text-white text-xl" />
                </div>
              </div>
            </div> */}
          </div>

          {/* Bar Charts - Stacked Vertically */}
          <div className="space-y-6">
            {/* Posts Per Month */}
            <div className="bg-[#f5f6f5] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Posts Per Month</h3>
              <div className="relative">
                <SimpleBarChart 
                  data={postsData} 
                  dataKey="posts" 
                  color="#506142" 
                  height={300}
                  title="Posts"
                />
              </div>
            </div>

            {/* New Users Per Month */}
            <div className="bg-[#f5f6f5] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">New Users Per Month</h3>
              <div className="relative">
                <SimpleBarChart 
                  data={usersData} 
                  dataKey="users" 
                  color="#6b7c5a" 
                  height={300}
                  title="Users"
                />
              </div>
            </div>
          </div>

          {/* Post Categories Distribution */}
          <div className="bg-[#f5f6f5] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Categories Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                      <span className="text-sm text-gray-600">{category.count} posts ({category.percentage}%)</span>
                    </div>
                    <ProgressBar percentage={category.percentage} color={category.color} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Engagement Table */}
          <div className="bg-[#f5f6f5] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Engagement Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#506142] text-white">
                    <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Month</th>
                    <th className="px-4 py-3 text-center font-semibold">Likes</th>
                    <th className="px-4 py-3 text-center font-semibold">Comments</th>
                    <th className="px-4 py-3 text-center font-semibold rounded-tr-lg">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {engagementData.map((data, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-200 hover:bg-[#e8e9e8] transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#f5f6f5]'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">{data.month}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHeart className="text-red-500 text-sm" />
                          <span className="text-gray-700">{data.likes.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaComments className="text-blue-500 text-sm" />
                          <span className="text-gray-700">{data.comments}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaEye className="text-green-500 text-sm" />
                          <span className="text-gray-700">{data.views.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Most Popular Posts */}
          <div className="bg-[#f5f6f5] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Popular Posts</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#506142] text-white">
                    <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Post Title</th>
                    <th className="px-4 py-3 text-left font-semibold">Author</th>
                    <th className="px-4 py-3 text-center font-semibold">Likes</th>
                    <th className="px-4 py-3 text-center font-semibold">Comments</th>
                    <th className="px-4 py-3 text-center font-semibold rounded-tr-lg">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {popularPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`border-b border-gray-200 hover:bg-[#e8e9e8] transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#f5f6f5]'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-800 truncate max-w-xs">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500">{post.date}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">{post.author}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaHeart className="text-red-500 text-sm" />
                          <span className="text-gray-700">{post.likes}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaComments className="text-blue-500 text-sm" />
                          <span className="text-gray-700">{post.comments}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FaEye className="text-green-500 text-sm" />
                          <span className="text-gray-700">{post.views}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;