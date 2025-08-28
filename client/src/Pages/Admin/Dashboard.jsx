import React, { useState } from "react";
import UserSidebar from "../../Components/AdminSidebar";
import { Users, Camera, MessageSquare, Bird, Flag, TrendingUp, Eye, UserCheck, UserX, Settings, Database, AlertTriangle } from "lucide-react";

// Mock UserSidebar component (replace with your actual import)


const Dashboard = () => {
  const [selectedSection, setSelectedSection] = useState('overview');

  // Mock data
  const stats = {
    totalUsers: 2847,
    activeUsers: 1293,
    totalPosts: 8965,
    pendingReports: 23,
    birdSpecies: 1842,
    fieldTrips: 5631
  };

  const recentActivity = [
    { id: 1, type: 'user', action: 'New user registration', user: 'sarah_birder', time: '2 minutes ago' },
    { id: 2, type: 'report', action: 'Content reported', content: 'Inappropriate photo comment', time: '15 minutes ago' },
    { id: 3, type: 'post', action: 'New field trip log', user: 'mike_ornithologist', time: '1 hour ago' },
    { id: 4, type: 'bird', action: 'New species added', species: 'Himalayan Monal', time: '3 hours ago' }
  ];

  const pendingReports = [
    { id: 1, type: 'Spam', content: 'Photo post: "Amazing Robin shot"', reporter: 'user123', status: 'pending' },
    { id: 2, type: 'Inappropriate Content', content: 'Comment on discussion thread', reporter: 'birdlover99', status: 'pending' },
    { id: 3, type: 'Copyright', content: 'Photo claimed to be stolen', reporter: 'photographer_pro', status: 'pending' }
  ];

  const topBirders = [
    { name: 'Alex Rodriguez', species: 284, trips: 47, posts: 156 },
    { name: 'Maria Chen', species: 271, trips: 52, posts: 203 },
    { name: 'David Wilson', species: 259, trips: 39, posts: 98 },
    { name: 'Emma Thompson', species: 245, trips: 41, posts: 187 }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "#506142" }) => (
    <div className="bg-[#f5f6f5] rounded-lg p-6 shadow-sm    -gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'user': return <UserCheck className="w-4 h-4 text-blue-500" />;
        case 'report': return <Flag className="w-4 h-4 text-red-500" />;
        case 'post': return <Camera className="w-4 h-4 text-green-500" />;
        case 'bird': return <Bird className="w-4 h-4 text-[#506142]" />;
        default: return <Eye className="w-4 h-4 text-gray-500" />;
      }
    };

    return (
      <div className="flex items-center space-x-2 p-3 hover:bg-gray-100 rounded-lg">
        {getIcon(activity.type)}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
          <p className="text-xs text-gray-500">
            {activity.user && `by ${activity.user} • `}
            {activity.species && `${activity.species} • `}
            {activity.time}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex flex-1 p-4 ml-[20%]">
        <div className="p-4 bg-white w-full rounded-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with Kurullo today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon={Users} 
              title="Total Users" 
              value={stats.totalUsers.toLocaleString()} 
              subtitle={`${stats.activeUsers.toLocaleString()} active this month`}
              color="#506142"
            />
            <StatCard 
              icon={Camera} 
              title="Total Posts" 
              value={stats.totalPosts.toLocaleString()} 
              subtitle="Photos & field trip logs"
              color="#506142"
            />
            <StatCard 
              icon={Bird} 
              title="Bird Species" 
              value={stats.birdSpecies.toLocaleString()} 
              subtitle="In database"
              color="#506142"
            />
            <StatCard 
              icon={TrendingUp} 
              title="Field Trips" 
              value={stats.fieldTrips.toLocaleString()} 
              subtitle="Logged by users"
              color="#506142"
            />
            <StatCard 
              icon={Flag} 
              title="Pending Reports" 
              value={stats.pendingReports} 
              subtitle="Require attention"
              color="#dc2626"
            />
            <StatCard 
              icon={MessageSquare} 
              title="Discussions" 
              value="1,247" 
              subtitle="Active threads"
              color="#506142"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-[#f5f6f5] rounded-lg p-6 shadow-sm    -gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-1">
                {recentActivity.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <button className="w-full mt-4 text-[#506142] text-sm font-medium hover:bg-[#506142] hover:text-white py-2 px-4 rounded-lg transition-colors">
                View All Activity
              </button>
            </div>

            {/* Pending Reports */}
            <div className="bg-[#f5f6f5] rounded-lg p-6 shadow-sm    -gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pending Reports</h3>
                <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {pendingReports.length} pending
                </div>
              </div>
              <div className="space-y-3">
                {pendingReports.map(report => (
                  <div key={report.id} className="   -gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                        {report.type}
                      </span>
                      <span className="text-xs text-gray-500">by {report.reporter}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{report.content}</p>
                    <div className="flex space-x-2">
                      <button className="bg-[#506142] text-white px-3 py-1 rounded text-xs hover:bg-[#3d4a32]">
                        Review
                      </button>
                      <button className="   -gray-300 text-gray-700 px-3 py-1 rounded text-xs hover:bg-gray-50">
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Birders and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Top Birders */}
            <div className="bg-[#f5f6f5] rounded-lg p-6 shadow-sm    -gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Birders This Month</h3>
              <div className="space-y-3">
                {topBirders.map((birder, index) => (
                  <div key={birder.name} className="flex items-center justify-between p-3 hover:bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-[#506142] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{birder.name}</p>
                        <p className="text-xs text-gray-500">{birder.species} species • {birder.trips} trips</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{birder.posts}</p>
                      <p className="text-xs text-gray-500">posts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#f5f6f5] rounded-lg p-6 shadow-sm    -gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center space-x-2 p-3    -gray-300 rounded-lg hover:bg-[#506142] hover:text-white hover: -[#506142] transition-colors bg-white">
                  <Database className="w-4 h-4" />
                  <span className="text-sm font-medium">Update Bird DB</span>
                </button>
                <button className="flex items-center space-x-2 p-3    -gray-300 rounded-lg hover:bg-[#506142] hover:text-white hover: -[#506142] transition-colors bg-white">
                  <UserX className="w-4 h-4" />
                  <span className="text-sm font-medium">Manage Users</span>
                </button>
                <button className="flex items-center space-x-2 p-3    -gray-300 rounded-lg hover:bg-[#506142] hover:text-white hover: -[#506142] transition-colors bg-white">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Moderators</span>
                </button>
                <button className="flex items-center space-x-2 p-3    -gray-300 rounded-lg hover:bg-[#506142] hover:text-white hover: -[#506142] transition-colors bg-white">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Content Review</span>
                </button>
              </div>
              
              {/* System Status */}
              <div className="mt-6 pt-4  -t  -gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Database</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Image Storage</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">API Services</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs text-yellow-600">Slow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;