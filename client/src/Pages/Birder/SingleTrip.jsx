import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const TripOne = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch trip data from backend
  const fetchTrip = async () => {
    try {
      setLoading(true);
      console.log("Fetching trip with ID:", tripId);
      
      // Make API call to get trip details
      const response = await api.get(`/trips/${tripId}`);
      console.log("Trip API response:", response.data);
      
      if (response.data.trip) {
        setTrip(response.data.trip);
      } else {
        setError("Trip data not found");
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching trip:", err);
      setError(err.response?.data?.message || "Failed to load trip");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <UserSidebar />
        <div className="flex-1 ml-[20%] mr-[30%] p-8 text-center">
          <p className="text-gray-500">Loading trip...</p>
        </div>
        <UserSidebarRight />
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex-1 ml-[20%] mr-[30%]">
        {/* Header - Same as checklist page */}
        <div className="border-b border-gray-300 p-6 flex items-center">
          <FaArrowLeft 
            className="mr-4 cursor-pointer hover:text-gray-600" 
            onClick={() => navigate(-1)} 
          />
          <div className="w-8 h-8 bg-[#506142] rounded-full mr-3 flex items-center justify-center text-white text-sm">
            {trip?.title?.charAt(0) || trip?.location?.charAt(0) || "T"}
          </div>
          <div>
            <p className="text-lg text-[#143829] font-semibold">{trip?.title || "Untitled Trip"}</p>
            <p className="text-sm text-gray-500">{trip?.location || "No location specified"}</p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="m-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 p-4">
          <div className="p-4 bg-[#f5f6f5] w-full rounded-lg">
            <h1 className="text-xl font-semibold mb-6">Trip Details</h1>
            
            {trip ? (
              <div className="space-y-6">
                {/* Trip Information Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium mb-4 pb-2 border-b">Trip Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Trip Title</p>
                      <p className="font-medium text-gray-800">{trip.title}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-800">{trip.location}</p>
                      {trip.formattedAddress && (
                        <p className="text-xs text-gray-500 mt-1">{trip.formattedAddress}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-800">{formatDate(trip.date)}</p>
                      <p className="text-xs text-gray-500">{formatTime(trip.date)}</p>
                    </div>
                    
                    {trip.coordinates?.latitude && trip.coordinates?.longitude && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Coordinates</p>
                        <p className="font-medium text-gray-800">
                          {trip.coordinates.latitude.toFixed(6)}, {trip.coordinates.longitude.toFixed(6)}
                        </p>
                      </div>
                    )}
                    
                    {trip.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-500 mb-2">Notes</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">{trip.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos Section */}
                {trip.photos && trip.photos.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4 pb-2 border-b">Photos ({trip.photos.length})</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {trip.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`http://localhost:3001/${photo}`}
                            alt={`Trip photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/300x200?text=Photo+Not+Found";
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checklists Section */}
                {trip.checklists && trip.checklists.length > 0 && (
                  <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4 pb-2 border-b">Checklists ({trip.checklists.length})</h2>
                    <div className="space-y-3">
                      {trip.checklists.map((checklist, index) => (
                        <div 
                          key={checklist._id || index} 
                          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (checklist._id) {
                              navigate(`/checklists/${checklist._id}`);
                            }
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">
                                {checklist.title || `Checklist ${index + 1}`}
                              </p>
                              {checklist.createdAt && (
                                <p className="text-xs text-gray-500">
                                  Created: {new Date(checklist.createdAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {checklist.observations && (
                                <p className="text-sm text-gray-600">
                                  {checklist.observations.length} {checklist.observations.length === 1 ? 'bird' : 'birds'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trip Metadata */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-medium mb-4 pb-2 border-b">Trip Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-medium">
                        {trip.createdAt ? formatDate(trip.createdAt) : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {trip.updatedAt ? formatDate(trip.updatedAt) : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Place ID</p>
                      <p className="font-medium text-xs truncate">
                        {trip.placeId || "Not available"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Trip ID</p>
                      <p className="font-medium text-xs truncate">
                        {trip._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">No trip data found</p>
                <p className="text-gray-400 text-sm">The trip you're looking for doesn't exist or has been deleted.</p>
                <button
                  onClick={() => navigate(-1)}
                  className="mt-4 px-4 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3a4a32]"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <UserSidebarRight />
    </div>
  );
};

export default TripOne;