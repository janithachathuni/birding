import React, { useState, useEffect, useRef } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { Trash2, Calendar, MapPin, Search } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const API_BASE_URL = "http://localhost:3001/api";

// Component to update map center when location changes
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

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

  // Location search state
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [mapZoom, setMapZoom] = useState(8);

  const tripsPerPage = 10;
  const searchTimeoutRef = useRef(null);

  const getUserId = () => {
    const userData = localStorage.getItem("user");
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

  useEffect(() => {
    fetchTrips();
  }, []);

  // Search location using Nominatim (OpenStreetMap)
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setLocationSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setSearching(true);
      console.log("Searching for:", query);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `format=json&q=${encodeURIComponent(query)}&` +
          `countrycodes=lk&limit=10&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search results from Nominatim:", data);

      if (data && data.length > 0) {
        const results = data.map((place) => ({
          displayName: place.display_name,
          name: place.name || place.display_name.split(",")[0],
          formattedAddress: place.display_name,
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          placeId: place.place_id.toString(),
          type: place.type,
          class: place.class,
        }));

        console.log("Processed results:", results);
        setLocationSearchResults(results);
        setShowSearchResults(true);
      } else {
        console.log("No results found");
        setLocationSearchResults([]);
        setShowSearchResults(true);
      }

      setSearching(false);
    } catch (err) {
      console.error("Error searching location:", err);
      setSearching(false);
      setLocationSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (locationSearchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(locationSearchQuery);
      }, 500);
    } else {
      setLocationSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [locationSearchQuery]);

  const handleSelectLocation = (location) => {
    console.log("Location selected:", location);
    setPlaceDetails({
      displayName: location.name,
      formattedAddress: location.formattedAddress,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      placeId: location.placeId,
    });
    setSelectedLocation(location.name);
    setLocationSearchQuery("");
    setShowSearchResults(false);

    // Update map center and zoom
    setMapCenter([location.lat, location.lng]);
    setMapZoom(15);
  };

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
        return (
          new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
        );
      } else if (sortBy === "date-desc") {
        return (
          new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );
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

  const handleAddTripClick = () => {
    setShowPopup(true);
    setSelectedLocation("");
    setPlaceDetails(null);
    setLocationSearchQuery("");
    setLocationSearchResults([]);
    setError("");
    setMapCenter([7.8731, 80.7718]);
    setMapZoom(8);
  };

  const handleSaveTrip = async () => {
    if (!placeDetails) {
      setError("Please select a location from the search results");
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
        date: new Date().toISOString(),
      };

      console.log("Saving trip:", tripData);

      const response = await fetch(`${API_BASE_URL}/trips/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save trip");
      }

      const result = await response.json();
      console.log("Trip created:", result);

      await fetchTrips();

      setShowPopup(false);
      setSelectedLocation("");
      setPlaceDetails(null);
      setLocationSearchQuery("");
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
      const response = await fetch(
        `${API_BASE_URL}/trips/${tripToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      console.log("Trip deleted successfully");

      await fetchTrips();

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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showSearchResults &&
        !e.target.closest(".location-search-container")
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearchResults]);

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

                  <div
                    className="flex flex-col md:flex-row gap-4"
                    onClick={() =>
                      (window.location.href = `/birder/trip/${trip._id}`)
                    }
                  >
                    <div className="flex-1 pr-8">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {trip.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-1">{trip.location}</p>
                      {trip.formattedAddress && (
                        <p className="text-sm text-gray-500 mt-1">
                          {trip.formattedAddress}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span>Checklists: {trip.checklists?.length || 0}</span>
                        {trip.notes && (
                          <span>
                            Notes: {trip.notes.substring(0, 50)}
                            {trip.notes.length > 50 ? "..." : ""}
                          </span>
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
                  {searchTerm
                    ? "No trips found matching your search"
                    : "No trips found. Click 'Add New Trip' to get started!"}
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

      {/* Add Trip Popup with OpenStreetMap */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Trip</h3>
              <button
                onClick={() => {
                  setShowPopup(false);
                  setError("");
                  setSelectedLocation("");
                  setPlaceDetails(null);
                  setLocationSearchQuery("");
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

            <div className="mb-4 location-search-container relative">
              <label className="block text-gray-700 mb-2">
                Search Location in Sri Lanka
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a location..."
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoComplete="off"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                {searching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && locationSearchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                  {locationSearchResults.map((result, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectLocation(result)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {result.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {result.formattedAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showSearchResults &&
                locationSearchResults.length === 0 &&
                locationSearchQuery &&
                !searching && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
                    No locations found matching "{locationSearchQuery}"
                  </div>
                )}
            </div>

            {/* Spacing to push map down when search results are showing */}
            {showSearchResults && locationSearchResults.length > 0 && (
              <div
                style={{
                  height: `${Math.min(
                    locationSearchResults.length * 70,
                    256
                  )}px`,
                }}
                className="mb-4"
              ></div>
            )}

            {/* Map Container */}
            <div className="mb-4">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: "300px", width: "100%", borderRadius: "8px" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {placeDetails && (
                  <Marker
                    position={[
                      placeDetails.location.lat,
                      placeDetails.location.lng,
                    ]}
                  />
                )}
                <MapUpdater center={mapCenter} zoom={mapZoom} />
              </MapContainer>
            </div>

            {/* Selected Location Details */}
            {placeDetails && (
              <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-1">
                  Selected Location:
                </h4>
                <p className="text-green-700">{placeDetails.displayName}</p>
                <p className="text-sm text-green-600">
                  {placeDetails.formattedAddress}
                </p>
                {placeDetails.location && (
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {placeDetails.location.lat.toFixed(6)},{" "}
                    {placeDetails.location.lng.toFixed(6)}
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
                  setLocationSearchQuery("");
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
                    ? "bg-[#506142] text-white hover:bg-[#3a4a32]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {savingTrip ? "Saving..." : "Save Trip"}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Delete Trip
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{tripToDelete?.title}"? This
                action cannot be undone.
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
