import React, { useState, useEffect, useRef } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { Trash2, Calendar } from "lucide-react";

const GOOGLE_MAPS_API_KEY = 'AIzaSyCFbprhDc_fKXUHl-oYEVGXKD1HciiAsz0';
const API_BASE_URL = 'http://localhost:3001/api'; // Changed to match Profile

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingTrip, setSavingTrip] = useState(false);
  const tripsPerPage = 10;
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Get userId consistently with Profile page
  const getUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id || user._id;
    }
    return null;
  };

  // Fetch trips from backend
  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = getUserId();
      
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("Fetching trips for user:", userId);
      const response = await fetch(`${API_BASE_URL}/trips/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Trips fetched:", data);
      
      setTrips(data.trips || data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError("Failed to load trips. Please try again.");
      setLoading(false);
    }
  };

  // Fetch trips on component mount
  useEffect(() => {
    fetchTrips();
  }, []);

  const filteredTrips = trips
    .filter((trip) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        trip.title?.toLowerCase().includes(searchLower) ||
        trip.location?.toLowerCase().includes(searchLower) ||
        trip.formattedAddress?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt);
      } else if (sortBy === "date-desc") {
        return new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt);
      } else if (sortBy === "popular") {
        return (b.checklists?.length || 0) - (a.checklists?.length || 0);
      }
      return 0;
    });

  // Pagination
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const loadGoogleMaps = () => {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        console.log("Google Maps loaded successfully");
        resolve();
      };
      script.onerror = () => {
        reject(new Error("Failed to load Google Maps"));
      };
      document.head.appendChild(script);
    });
  };

  const initializeAutocomplete = () => {
    const input = document.getElementById('location-search');
    if (!input || !mapContainerRef.current || !window.google) {
      console.log("Missing dependencies for autocomplete");
      return;
    }

    // Clear previous map
    if (mapInstanceRef.current) {
      mapContainerRef.current.innerHTML = '';
    }

    // Initialize map
    const map = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: 7.8731, lng: 80.7718 }, // Sri Lanka center
      zoom: 8,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    });
    mapInstanceRef.current = map;

    // Initialize marker
    const marker = new window.google.maps.Marker({
      map: map,
      visible: false
    });
    markerInstanceRef.current = marker;

    // Initialize autocomplete
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['establishment', 'geocode'],
      componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka
      fields: ['name', 'formatted_address', 'geometry', 'place_id', 'types']
    });
    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      
      if (!place.geometry) {
        console.log("No geometry for place");
        marker.setVisible(false);
        setPlaceDetails(null);
        return;
      }

      const locationData = {
        displayName: place.name || place.formatted_address,
        formattedAddress: place.formatted_address,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        placeId: place.place_id
      };

      console.log("Place selected:", locationData);
      setSelectedLocation(place.name || place.formatted_address);
      setPlaceDetails(locationData);

      // Update map
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      }

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
    });
  };

  const handleAddTripClick = async () => {
    try {
      await loadGoogleMaps();
      setShowPopup(true);
      setSelectedLocation("");
      setPlaceDetails(null);
      setError("");
      
      // Initialize autocomplete after popup is shown
      setTimeout(() => {
        initializeAutocomplete();
      }, 200);
    } catch (err) {
      console.error("Error loading Google Maps:", err);
      setError("Failed to load map. Please try again.");
    }
  };

  const handleSaveTrip = async () => {
    if (!placeDetails) {
      setError("Please select a location from the suggestions");
      return;
    }

    try {
      setSavingTrip(true);
      setError("");
      const userId = getUserId();

      if (!userId) {
        setError("User not logged in");
        setSavingTrip(false);
        return;
      }

      const tripData = {
        userId: userId,
        title: placeDetails.displayName,
        location: placeDetails.displayName,
        formattedAddress: placeDetails.formattedAddress,
        latitude: placeDetails.location.lat,
        longitude: placeDetails.location.lng,
        placeId: placeDetails.placeId,
        date: new Date().toISOString()
      };

      console.log("Saving trip:", tripData);

      const response = await fetch(`${API_BASE_URL}/trips/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save trip');
      }

      const result = await response.json();
      console.log("Trip created:", result);
      
      // Refresh trips list
      await fetchTrips();
      
      // Close popup and reset
      setShowPopup(false);
      setSelectedLocation("");
      setPlaceDetails(null);
      setSavingTrip(false);
      
    } catch (err) {
      console.error("Error saving trip:", err);
      setError(err.message || "Failed to save trip");
      setSavingTrip(false);
    }
  };

  const handleDeleteClick = (trip) => {
    setTripToDelete(trip);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/trips/${tripToDelete._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }
      
      console.log("Trip deleted successfully");
      
      // Refresh trips list
      await fetchTrips();
      
      // Close popup
      setShowDeletePopup(false);
      setTripToDelete(null);
      
    } catch (err) {
      console.error("Error deleting trip:", err);
      setError(err.message || "Failed to delete trip");
      setShowDeletePopup(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
      mapInstanceRef.current = null;
      markerInstanceRef.current = null;
      autocompleteRef.current = null;
    };
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />

      <div className="flex-1 ml-[20%] mr-[30%]">
        {/* Sticky top section */}
        <div className="bg-white z-10 border-b border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">Track your trips</p>
              <button
                onClick={handleAddTripClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#506142] text-white rounded-full hover:bg-[#3a4a32] transition-colors"
              >
                <span className="text-xl">+</span>
                <span>Add New Trip</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 my-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search trips by title or location..."
                  className="w-full p-2 pl-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <select
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Trip listings */}
        <div className="p-4">
          <div className="space-y-4 mb-16">
            {loading ? (
              <div className="p-8 text-center bg-[#f5f6f5] rounded-lg">
                <p className="text-gray-500">Loading trips...</p>
              </div>
            ) : currentTrips.length > 0 ? (
              currentTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="p-4 bg-[#f5f6f5] rounded-lg hover:bg-[#e5e9e5] transition-colors relative"
                >
                  {/* Timestamp - Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(trip.createdAt || trip.date)}</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 pr-8">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {trip.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-1">{trip.location}</p>
                      {trip.formattedAddress && (
                        <p className="text-sm text-gray-500 mt-1">{trip.formattedAddress}</p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span>Checklists: {trip.checklists?.length || 0}</span>
                        {trip.notes && (
                          <span>Notes: {trip.notes.substring(0, 50)}{trip.notes.length > 50 ? '...' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button - Bottom Right */}
                  <button
                    onClick={() => handleDeleteClick(trip)}
                    className="absolute bottom-3 right-3 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[#f5f6f5] rounded-lg">
                <p className="text-gray-500">
                  {searchTerm ? "No trips found matching your search" : "No trips found. Click 'Add New Trip' to get started!"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTrips.length > tripsPerPage && (
            <div className="flex justify-center items-center mt-8 mb-16 gap-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#506142] text-white hover:bg-[#3a4a32]"
                }`}
              >
                ←
              </button>

              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 font-extrabold flex items-center justify-center rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#506142] text-white hover:bg-[#3a4a32]"
                }`}
              >
                →
              </button>
            </div>
          )}

          {/* Floating Add Trip Button */}
          <div className="fixed bottom-8 right-8">
            <button
              onClick={handleAddTripClick}
              className="w-14 h-14 flex items-center justify-center bg-[#506142] text-white rounded-full hover:bg-[#3a4a32] transition-colors shadow-lg text-2xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <UserSidebarRight />

      {/* Add Trip Popup with Google Maps */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Trip</h3>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setError("");
                  setSelectedLocation("");
                  setPlaceDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Select Location
              </label>
              <input
                type="text"
                id="location-search"
                placeholder="Search for a location in Sri Lanka..."
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                autoComplete="off"
              />
            </div>

            {/* Map Container */}
            <div className="mb-4">
              <div 
                ref={mapContainerRef} 
                className="w-full h-64 bg-gray-200 rounded-lg"
                style={{ minHeight: '256px' }}
              ></div>
            </div>

            {/* Selected Location Details */}
            {placeDetails && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-1">Selected Location:</h4>
                <p className="text-green-700">{placeDetails.displayName}</p>
                <p className="text-sm text-green-600">{placeDetails.formattedAddress}</p>
                {placeDetails.location && (
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {placeDetails.location.lat.toFixed(6)}, {placeDetails.location.lng.toFixed(6)}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setError("");
                  setSelectedLocation("");
                  setPlaceDetails(null);
                }}
                disabled={savingTrip}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveTrip}
                disabled={!placeDetails || savingTrip}
                className={`px-4 py-2 rounded-lg ${
                  placeDetails && !savingTrip
                    ? 'bg-[#506142] text-white hover:bg-[#3a4a32]' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {savingTrip ? 'Saving...' : 'Save Trip'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Trip</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{tripToDelete?.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setTripToDelete(null);
                }}
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
  );
};

export default Trips;