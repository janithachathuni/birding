import React, { useState, useEffect } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";
import { Trash2, Calendar, MapPin } from "lucide-react";
import {Link} from "react-router-dom";

const API_BASE_URL = 'http://localhost:3001/api';

const Checklists = () => {
  const [checklists, setChecklists] = useState([]);
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [checklistToDelete, setChecklistToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [checklistTitle, setChecklistTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingChecklist, setSavingChecklist] = useState(false);
  
  const checklistsPerPage = 8;

  // Get userId
  const getUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.id || user._id;
    }
    return null;
  };

  // Fetch checklists from backend
  const fetchChecklists = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = getUserId();
      
      if (!userId) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("Fetching checklists for user:", userId);
      const response = await fetch(`${API_BASE_URL}/checklists/user/${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Checklists fetched:", data);
      
      setChecklists(data.checklists || data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching checklists:", err);
      setError("Failed to load checklists. Please try again.");
      setLoading(false);
    }
  };

  // Fetch trips for dropdown
  const fetchTrips = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const response = await fetch(`${API_BASE_URL}/trips/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips || data || []);
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchChecklists();
    fetchTrips();
  }, []);

  // Get unique places for dropdown
  const uniquePlaces = ["all", ...new Set(checklists.map((c) => c.tripPlace).filter(Boolean))];

  // Filtering logic
  const filteredChecklists = checklists.filter((cl) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      cl.title?.toLowerCase().includes(searchLower) ||
      cl.tripPlace?.toLowerCase().includes(searchLower);

    const matchesPlace = filterPlace === "all" || cl.tripPlace === filterPlace;
    const matchesDate = !filterDate || 
      new Date(cl.date).toISOString().split('T')[0] === filterDate;

    return matchesSearch && matchesPlace && matchesDate;
  });

  // Pagination
  const indexOfLast = currentPage * checklistsPerPage;
  const indexOfFirst = indexOfLast - checklistsPerPage;
  const currentChecklists = filteredChecklists.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredChecklists.length / checklistsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate default title when trip or date changes
  useEffect(() => {
    if (selectedTrip && selectedDate) {
      const selectedTripData = trips.find(trip => trip._id === selectedTrip);
      if (selectedTripData) {
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        const defaultTitle = `${selectedTripData.title} ${formattedDate}`;
        setChecklistTitle(defaultTitle);
      }
    } else {
      setChecklistTitle("");
    }
  }, [selectedTrip, selectedDate, trips]);

  // Reset form when popup is opened/closed
  useEffect(() => {
    if (showPopup) {
      // Set default values when opening popup
      setSelectedTrip("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setChecklistTitle("");
      setError("");
    }
  }, [showPopup]);

  const handleSaveChecklist = async () => {
    if (!selectedTrip || !checklistTitle || !selectedDate) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSavingChecklist(true);
      setError("");
      const userId = getUserId();

      if (!userId) {
        setError("User not logged in");
        setSavingChecklist(false);
        return;
      }

      const selectedTripData = trips.find(trip => trip._id === selectedTrip);
      if (!selectedTripData) {
        setError("Selected trip not found");
        setSavingChecklist(false);
        return;
      }

      const checklistData = {
        userId: userId,
        tripId: selectedTrip,
        title: checklistTitle,
        tripPlace: selectedTripData.title,
        date: selectedDate,
        startTime: "",
        endTime: ""
      };

      console.log("Saving checklist:", checklistData);

      const response = await fetch(`${API_BASE_URL}/checklists/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checklistData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save checklist');
      }

      const result = await response.json();
      console.log("Checklist created:", result);
      
      // Refresh checklists list
      await fetchChecklists();
      
      // Close popup and reset
      setShowPopup(false);
      setSelectedTrip("");
      setChecklistTitle("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setSavingChecklist(false);
      
    } catch (err) {
      console.error("Error saving checklist:", err);
      setError(err.message || "Failed to save checklist");
      setSavingChecklist(false);
    }
  };

  const handleDeleteClick = (checklist) => {
    setChecklistToDelete(checklist);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    if (!checklistToDelete) return;

    try {
      setError("");
      const response = await fetch(`${API_BASE_URL}/checklists/${checklistToDelete._id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete checklist');
      }
      
      console.log("Checklist deleted successfully");
      
      // Refresh checklists list
      await fetchChecklists();
      
      // Close popup
      setShowDeletePopup(false);
      setChecklistToDelete(null);
      
    } catch (err) {
      console.error("Error deleting checklist:", err);
      setError(err.message || "Failed to delete checklist");
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPlace, filterDate]);

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />

      <div className="flex-1 ml-[20%] mr-[30%]">
        {/* Sticky top section */}
        <div className="bg-white z-10 border-b border-gray-300">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-bold">Checklists</p>
              <button
                onClick={() => setShowPopup(true)}
                className="flex items-center gap-2 p-2 bg-[#2b5b3f] text-white rounded-full hover:bg-[#3a4a32] transition-colors"
              >
                <span className="w-6 h-6 flex items-center justify-center">+</span>
                <span className="pr-2">Add New Checklist</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 my-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by checklist or trip name..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                value={filterPlace}
                onChange={(e) => setFilterPlace(e.target.value)}
              >
                <option value="all">All Places</option>
                {uniquePlaces.filter(place => place !== "all").map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Checklist Listings */}
        <div className="p-4">
          <div className="space-y-4 mb-16">
            {loading ? (
              <div className="p-8 text-center bg-[#eef7f1] rounded-lg">
                <p className="text-gray-500">Loading checklists...</p>
              </div>
            ) : currentChecklists.length > 0 ? (
              currentChecklists.map((cl) => (
                <div
                  key={cl._id}
                  className="pr-4 pl-4 pt-4 bg-[#eef7f1] rounded-lg hover:bg-[#f6f9f6] transition-colors relative"
                >
                  {/* Timestamp - Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateTime(cl.createdAt)}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-black pr-16">
                    {cl.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-900 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{cl.tripPlace}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm mb-4 text-gray-600">
                      Species Count: {cl.totalSpecies || 0}
                    </p>
 
                  </div>

                  {/* Delete Button - Bottom Right */}
                  <button
                    onClick={() => handleDeleteClick(cl)}
                    className="absolute bottom-3 right-3 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete checklist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[#eef7f1] rounded-lg">
                <p className="text-gray-500">
                  {searchTerm || filterPlace !== "all" || filterDate 
                    ? "No checklists found matching your criteria" 
                    : "No checklists found. Click 'Add New Checklist' to get started!"}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredChecklists.length > checklistsPerPage && (
            <div className="flex justify-center items-center mt-8 mb-16 gap-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#a0361b] text-white hover:bg-[#862b15]"
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
                className={`w-10 h-10 flex items-center justify-center rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#a0361b] text-white hover:bg-[#862b15]"
                }`}
              >
                →
              </button>
            </div>
          )}

          {/* Floating Add Button */}
          <div className="fixed bottom-8 right-8">
            <button
              onClick={() => setShowPopup(true)}
              className="w-14 h-14 flex items-center justify-center bg-[#506142] text-white rounded-full hover:bg-[#3a4a32] transition-colors shadow-lg text-2xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <UserSidebarRight />

      {/* Add Checklist Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Checklist</h3>
              <button
                onClick={() => setShowPopup(false)}
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
              <label className="block text-gray-700 mb-2">Select Trip</label>
              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a trip</option>
                {trips.map((trip) => (
                  <option key={trip._id} value={trip._id}>
                    {trip.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Don't see your trip? <a href="/trips" className="text-green-600 hover:underline">Create a new trip first</a>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Checklist Title</label>
              <input
                type="text"
                placeholder="Enter checklist title"
                value={checklistTitle}
                onChange={(e) => setChecklistTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Default name generated from trip location and date. You can edit this.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                disabled={savingChecklist}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChecklist}
                disabled={!selectedTrip || !checklistTitle || savingChecklist}
                className={`px-4 py-2 rounded-lg ${
                  selectedTrip && checklistTitle && !savingChecklist
                    ? "bg-[#506142] text-white hover:bg-[#3a4a32]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {savingChecklist ? "Saving..." : "Save Checklist"}
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Checklist</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{checklistToDelete?.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setChecklistToDelete(null);
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

export default Checklists;