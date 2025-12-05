import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSearch, FaPlus, FaMinus, FaTrash, FaTimes } from "react-icons/fa";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarChecklist from "../../Components/UserSidebarChecklist";

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const BirderSingleChecklist = () => {
  const { checklistId } = useParams();
  const navigate = useNavigate();
  
  const [checklist, setChecklist] = useState(null);
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Bird search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  
  // Add observation states
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedBird, setSelectedBird] = useState(null);
  const [birdCount, setBirdCount] = useState(1);
  const [timeSeen, setTimeSeen] = useState("");
  const [fieldNotes, setFieldNotes] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch checklist data
  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/checklists/${checklistId}`);
      setChecklist(response.data.checklist);
      setObservations(response.data.checklist.observations || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching checklist:", err);
      setError(err.response?.data?.message || "Failed to load checklist");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checklistId) fetchChecklist();
  }, [checklistId]);

  // Search birds with improved filtering
  const searchBirds = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    try {
      setSearching(true);
      console.log('Searching for:', term);
      const response = await api.get('/birds');
      console.log('API Response:', response);
      console.log('Birds data:', response.data);
      
      const birds = Array.isArray(response.data) ? response.data : response.data.birds || [];
      console.log('Processed birds array:', birds);
      
      const searchLower = term.toLowerCase().trim();
      
      // Improved filter logic
      const filtered = birds.filter(bird => {
        // Check primary name
        if (bird.primaryName?.toLowerCase().includes(searchLower)) return true;
        
        // Check other names array
        if (bird.otherNames && Array.isArray(bird.otherNames)) {
          if (bird.otherNames.some(name => name?.toLowerCase().includes(searchLower))) return true;
        }
        
        // Check scientific name
        if (bird.scientificName?.toLowerCase().includes(searchLower)) return true;
        
        // Check Sinhala name
        if (bird.sinhalaName?.toLowerCase().includes(searchLower)) return true;
        
        // Check Tamil name
        if (bird.tamilName?.toLowerCase().includes(searchLower)) return true;
        
        return false;
      });
      
      // Sort results: exact matches first, then partial matches
      const sorted = filtered.sort((a, b) => {
        const aNameMatch = a.primaryName?.toLowerCase() === searchLower;
        const bNameMatch = b.primaryName?.toLowerCase() === searchLower;
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        return a.primaryName.localeCompare(b.primaryName);
      });
      
      setSearchResults(sorted.slice(0, 10));
      setShowSearchResults(true);
      setSearching(false);
      console.log('Search results:', sorted.slice(0, 10));
    } catch (err) {
      console.error("Error searching birds:", err);
      console.error("Error details:", err.response?.data);
      setSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounce = setTimeout(() => searchBirds(searchTerm), 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Select bird from search
  const handleSelectBird = (bird) => {
    setSelectedBird(bird);
    setSearchTerm("");
    setShowSearchResults(false);
    setBirdCount(1);
    setTimeSeen(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    setFieldNotes("");
    setShowAddPopup(true);
  };

  // Add observation
  const handleAddObservation = async () => {
    if (!selectedBird || !birdCount || !timeSeen) {
      setError("Please fill in all required fields");
      return;
    }
    
    try {
      setSaving(true);
      setError("");
      
      await api.post(`/checklists/${checklistId}/observations`, {
        birdId: selectedBird._id,
        count: birdCount,
        timeSeen,
        fieldNotes
      });
      
      await fetchChecklist();
      setShowAddPopup(false);
      setSelectedBird(null);
      setSaving(false);
    } catch (err) {
      console.error("Error adding observation:", err);
      setError(err.response?.data?.message || "Failed to add observation");
      setSaving(false);
    }
  };

  // Update observation count
  const handleUpdateCount = async (observationId, newCount) => {
    if (newCount < 0) return;
    
    try {
      await api.put(`/checklists/${checklistId}/observations/${observationId}`, {
        count: newCount
      });
      
      // Update local state immediately for better UX
      setObservations(prev => prev.map(obs => 
        obs._id === observationId ? { ...obs, count: newCount } : obs
      ));
    } catch (err) {
      console.error("Error updating count:", err);
      setError(err.response?.data?.message || "Failed to update count");
      // Refetch to get correct state
      await fetchChecklist();
    }
  };

  // Delete observation
  const handleDeleteObservation = async (observationId) => {
    try {
      await api.delete(`/checklists/${checklistId}/observations/${observationId}`);
      
      // Update local state
      setObservations(prev => prev.filter(obs => obs._id !== observationId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting:", err);
      setError(err.response?.data?.message || "Failed to delete observation");
      setDeleteConfirm(null);
      // Refetch to get correct state
      await fetchChecklist();
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSearchResults && !e.target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchResults]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white">
        <UserSidebar />
        <div className="flex-1 ml-[20%] mr-[30%] p-8 text-center">
          <p className="text-gray-500">Loading checklist...</p>
        </div>
        <UserSidebarChecklist checklistId={checklistId} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex-1 ml-[20%] mr-[30%]">
        {/* Header */}
        <div className="border-b border-gray-300 p-6 flex items-center">
          <FaArrowLeft 
            className="mr-4 cursor-pointer hover:text-gray-600" 
            onClick={() => navigate(-1)} 
          />
          <div className="w-8 h-8 bg-[#506142] rounded-full mr-3 flex items-center justify-center text-white text-sm">
            {checklist?.title?.charAt(0) || "C"}
          </div>
          <div>
            <p className="text-lg text-[#143829] font-semibold">{checklist?.title}</p>
            <p className="text-sm text-gray-500">{checklist?.tripPlace}</p>
          </div>
        </div>

        {/* Search Area */}
        <div className="p-4 m-4 rounded-lg relative search-container">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search birds by name, scientific name, Sinhala or Tamil..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm && setShowSearchResults(true)}
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              {searching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
              {searchResults.map(bird => (
                <div
                  key={bird._id}
                  onClick={() => handleSelectBird(bird)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <p className="font-medium text-gray-800">{bird.primaryName}</p>
                  {bird.otherNames && bird.otherNames.length > 0 && (
                    <p className="text-xs text-gray-400">{bird.otherNames.join(', ')}</p>
                  )}
                  <p className="text-sm text-gray-500 italic">{bird.scientificName}</p>
                  {bird.sinhalaName && <p className="text-xs text-gray-400">සිංහල: {bird.sinhalaName}</p>}
                  {bird.tamilName && <p className="text-xs text-gray-400">தமிழ்: {bird.tamilName}</p>}
                </div>
              ))}
            </div>
          )}
          {showSearchResults && searchResults.length === 0 && searchTerm && !searching && (
            <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 text-center text-gray-500">
              No birds found matching "{searchTerm}"
            </div>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-700 hover:text-red-900">
              <FaTimes />
            </button>
          </div>
        )}

        {/* Observations List */}
        <div className="px-8 pb-4">
          <div className="bg-white rounded-lg">
            {observations.length > 0 ? (
              <table className="w-full">
                <tbody>
                  {observations.map((obs) => (
                    <tr key={obs._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="text-gray-800 font-semibold">{obs.birdName}</p>
                        <p className="text-xs text-gray-500 italic">{obs.scientificName}</p>
                        {obs.fieldNotes && (
                          <p className="text-xs text-gray-600 mt-1">Note: {obs.fieldNotes}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateCount(obs._id, obs.count - 1)}
                            disabled={obs.count <= 0}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-8 text-center text-gray-700 font-medium">{obs.count}</span>
                          <button
                            onClick={() => handleUpdateCount(obs._id, obs.count + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400 text-sm">{obs.timeSeen}</td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => setDeleteConfirm(obs._id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500 bg-[#f5f6f5] rounded-lg">
                No birds added yet. Search and add birds above!
              </div>
            )}
          </div>
        </div>
      </div>

      <UserSidebarChecklist checklistId={checklistId} />

      {/* Add Observation Popup */}
      {showAddPopup && selectedBird && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Bird Observation</h3>
              <button 
                onClick={() => setShowAddPopup(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="mb-4">
              <p className="font-medium text-gray-800">{selectedBird.primaryName}</p>
              {selectedBird.otherNames && selectedBird.otherNames.length > 0 && (
                <p className="text-xs text-gray-500">{selectedBird.otherNames.join(', ')}</p>
              )}
              <p className="text-sm text-gray-500 italic">{selectedBird.scientificName}</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Count</label>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setBirdCount(Math.max(1, birdCount - 1))} 
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <FaMinus className="mx-auto text-xs" />
                </button>
                <input 
                  type="number" 
                  value={birdCount} 
                  onChange={(e) => setBirdCount(Math.max(1, parseInt(e.target.value) || 1))} 
                  className="w-20 text-center p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="1"
                />
                <button 
                  onClick={() => setBirdCount(birdCount + 1)} 
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  <FaPlus className="mx-auto text-xs" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Time Seen</label>
              <input 
                type="time" 
                value={timeSeen} 
                onChange={(e) => setTimeSeen(e.target.value)} 
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Field Notes (optional)</label>
              <textarea 
                value={fieldNotes} 
                onChange={(e) => setFieldNotes(e.target.value)} 
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
                rows="2" 
                placeholder="Any observations..."
                maxLength="500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setShowAddPopup(false)} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddObservation} 
                disabled={saving || !birdCount || !timeSeen} 
                className="px-4 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3a4a32] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? "Adding..." : "Add Bird"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm">
            <p className="font-medium mb-2">Delete Observation</p>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to remove this bird from the checklist?
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)} 
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteObservation(deleteConfirm)} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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

export default BirderSingleChecklist;