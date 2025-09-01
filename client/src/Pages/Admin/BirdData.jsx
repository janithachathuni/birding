import React, { useState, useEffect, useMemo } from "react";
import AdminSidebar from "../../Components/AdminSidebar";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const BirdData = () => {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBird, setSelectedBird] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [notification, setNotification] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // All bird families and their orders found in Sri Lanka
  const sriLankanBirdTaxonomy = [
    { order: "Accipitriformes", family: "Accipitridae", category: "Birds of Prey" },
    { order: "Passeriformes", family: "Aegithalidae", category: "Long-tailed Tits" },
    { order: "Passeriformes", family: "Alaudidae", category: "Larks" },
    { order: "Coraciiformes", family: "Alcedinidae", category: "Kingfishers" },
    { order: "Anseriformes", family: "Anatidae", category: "Ducks, Geese & Swans" },
    { order: "Apodiformes", family: "Apodidae", category: "Swifts" },
    { order: "Pelecaniformes", family: "Ardeidae", category: "Herons & Egrets" },
    { order: "Bucerotiformes", family: "Bucerotidae", category: "Hornbills" },
    { order: "Passeriformes", family: "Campephagidae", category: "Cuckoo-shrikes" },
    { order: "Caprimulgiformes", family: "Caprimulgidae", category: "Nightjars" },
    { order: "Charadriiformes", family: "Charadriidae", category: "Plovers" },
    { order: "Ciconiiformes", family: "Ciconiidae", category: "Storks" },
    { order: "Passeriformes", family: "Cisticolidae", category: "Cisticolas & Allies" },
    { order: "Columbiformes", family: "Columbidae", category: "Pigeons & Doves" },
    { order: "Coraciiformes", family: "Coraciidae", category: "Rollers" },
    { order: "Passeriformes", family: "Corvidae", category: "Crows, Jays & Magpies" },
    { order: "Cuculiformes", family: "Cuculidae", category: "Cuckoos" },
    { order: "Passeriformes", family: "Dicaeidae", category: "Flowerpeckers" },
    { order: "Passeriformes", family: "Dicruridae", category: "Drongos" },
    { order: "Passeriformes", family: "Estrildidae", category: "Estrildid Finches" },
    { order: "Falconiformes", family: "Falconidae", category: "Falcons & Caracaras" },
    { order: "Passeriformes", family: "Fringillidae", category: "Finches & Canaries" },
    { order: "Passeriformes", family: "Hirundinidae", category: "Swallows & Martins" },
    { order: "Passeriformes", family: "Laniidae", category: "Shrikes" },
    { order: "Charadriiformes", family: "Laridae", category: "Gulls, Terns & Skimmers" },
    { order: "Piciformes", family: "Megalaimidae", category: "Asian Barbets" },
    { order: "Coraciiformes", family: "Meropidae", category: "Bee-eaters" },
    { order: "Passeriformes", family: "Motacillidae", category: "Wagtails & Pipits" },
    { order: "Passeriformes", family: "Muscicapidae", category: "Old World Flycatchers" },
    { order: "Passeriformes", family: "Nectariniidae", category: "Sunbirds" },
    { order: "Passeriformes", family: "Oriolidae", category: "Orioles" },
    { order: "Pelecaniformes", family: "Pelecanidae", category: "Pelicans" },
    { order: "Galliformes", family: "Phasianidae", category: "Pheasants & Allies" },
    { order: "Piciformes", family: "Picidae", category: "Woodpeckers" },
    { order: "Passeriformes", family: "Pittidae", category: "Pittas" },
    { order: "Passeriformes", family: "Ploceidae", category: "Weavers" },
    { order: "Psittaciformes", family: "Psittacidae", category: "Parrots" },
    { order: "Passeriformes", family: "Pycnonotidae", category: "Bulbuls" },
    { order: "Gruiformes", family: "Rallidae", category: "Rails, Crakes & Coots" },
    { order: "Charadriiformes", family: "Scolopacidae", category: "Sandpipers & Allies" },
    { order: "Strigiformes", family: "Strigidae", category: "Owls" },
    { order: "Passeriformes", family: "Sturnidae", category: "Starlings" },
    { order: "Passeriformes", family: "Sylviidae", category: "Sylviid Warblers" },
    { order: "Pelecaniformes", family: "Threskiornithidae", category: "Ibises & Spoonbills" },
    { order: "Passeriformes", family: "Timaliidae", category: "Babblers" },
    { order: "Passeriformes", family: "Turdidae", category: "Thrushes" },
    { order: "Strigiformes", family: "Tytonidae", category: "Barn Owls" },
    { order: "Bucerotiformes", family: "Upupidae", category: "Hoopoes" },
    { order: "Passeriformes", family: "Vangidae", category: "Vangas" },
    { order: "Passeriformes", family: "Zosteropidae", category: "White-eyes" },
  ];

  // Extract unique orders from the taxonomy data
  const birdOrders = useMemo(() => {
    const orders = new Set(sriLankanBirdTaxonomy.map(item => item.order));
    return [...orders].sort();
  }, []);
 
  // Function to fetch birds
  const fetchBirds = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/birds/get");
      if (Array.isArray(response.data)) {
        setBirds(response.data);
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        setBirds(response.data.data);
      } else {
        setBirds([]);
        console.error("API response is not an array:", response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bird data:", err);
      setError("Failed to fetch bird data. Please check if the backend server is running.");
      setLoading(false);
    }
  };

  // Function to handle bird deletion
  const handleConfirmDelete = async () => {
    if (!selectedBird) return;
    try {
      const response = await axios.delete(`http://localhost:3001/api/birds/delete/${selectedBird._id}`);
      setNotification(response.data.message || "Bird deleted successfully.");
      console.log("Delete response:", response.data);
      // Refresh the bird list after successful deletion
      fetchBirds();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete bird.";
      setNotification(`Error: ${errorMessage}`);
      console.error("Error deleting bird:", error);
    } finally {
      setShowDeleteConfirm(false);
      setSelectedBird(null);
    }
  };

  // Initial data fetch and message handling
  useEffect(() => {
    if (location.state && location.state.message) {
      setNotification(location.state.message);
      window.history.replaceState({}, document.title);
    }
    fetchBirds();
  }, [location.state]);

  // Filter birds based on search term, family, and order
  const filteredBirds = useMemo(() => {
    return birds.filter(bird => {
      const matchesSearch = searchTerm === "" ||
        (bird.primaryName && bird.primaryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (bird.scientificName && bird.scientificName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFamily = selectedFamily === "" || (bird.family && bird.family === selectedFamily);

      const matchesOrder = selectedOrder === "" || (bird.order && bird.order === selectedOrder);

      return matchesSearch && matchesFamily && matchesOrder;
    });
  }, [birds, searchTerm, selectedFamily, selectedOrder]);

  const handleDeleteClick = (bird) => {
    setSelectedBird(bird);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedBird(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFamily("");
    setSelectedOrder("");
  };

  const handleEditClick = (birdId) => {
    navigate(`/admin/edit-bird/${birdId}`);
  };

  const handleAddBirdClick = () => {
    navigate("/admin/add-bird");
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="w-4/5 p-4 ml-auto">
        {/* Header Section */}
        <div className="bg-[#f5f6f5] rounded-lg p-6 mb-6">
          {notification && (
            <div className={`mb-4 p-4 rounded-lg flex justify-between items-center animate-fade-in-down ${notification.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              <p className="font-medium">{notification}</p>
              <button onClick={() => setNotification(null)} className={`transition-colors ${notification.includes("Error") ? 'text-red-700 hover:text-red-900' : 'text-green-700 hover:text-green-900'}`}>
                <FaTimes />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#314124] mb-2">
                Bird Data Management
              </h1>
              <p className="text-gray-600">
                Manage Sri Lankan bird species data
              </p>
            </div>
            <button
              onClick={handleAddBirdClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all duration-200"
            >
              <FaPlus className="text-sm" /> Add New Bird
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="flex gap-4 items-center mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search birds by name or scientific name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent transition-all bg-white"
              />
            </div>

            {/* Order Filter */}
            <div className="w-60">
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent bg-white"
              >
                <option value="">All Orders</option>
                {birdOrders.map((order) => (
                  <option key={order} value={order}>
                    {order}
                  </option>
                ))}
              </select>
            </div>

            {/* Family Filter */}
            <div className="w-80">
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent bg-white"
              >
                <option value="">All Families</option>
                {sriLankanBirdTaxonomy.map((familyObj) => (
                  <option key={familyObj.family} value={familyObj.family}>
                    {familyObj.family}: {familyObj.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedFamily || selectedOrder) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all"
              >
                Clear
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredBirds.length} of {birds.length} birds
            {(searchTerm || selectedFamily || selectedOrder) && (
              <span className="ml-2 text-[#506142] font-medium">
                (filtered)
              </span>
            )}
          </div>
        </div>

        {/* Bird Table */}
        <div className="bg-[#f5f6f5] rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <p>Loading bird data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[#506142] text-white">
                  <th className="px-6 py-4 text-left font-semibold">Image</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Scientific Name
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Order</th>
                  <th className="px-6 py-4 text-left font-semibold">Family</th>
                  <th className="px-6 py-4 text-center font-semibold w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBirds.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-gray-400 mb-4">
                          <svg
                            className="w-12 h-12 mx-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-gray-600 mb-1">
                          No birds found
                        </h3>
                        <p className="text-sm text-gray-500">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredBirds.map((bird, index) => (
                    <tr
                      key={bird._id} // Use MongoDB's _id as the unique key
                      className={`border-b border-gray-200 hover:bg-[#e8e9e8] transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-[#f5f6f5]"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <img
                          src={bird.image}
                          alt={bird.primaryName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {bird.primaryName}
                          </p>
                          {bird.otherNames && bird.otherNames.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                              Also known as: {bird.otherNames.join(", ")}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="italic text-gray-700">
                          {bird.scientificName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{bird.order}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700">{bird.family}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditClick(bird._id)}
                            className="p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
                            title="Edit Bird"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(bird)}
                            className="p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
                            title="Delete Bird"
                          >
                            <FaTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <FaTrash className="text-red-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong className="text-gray-800">
                  {selectedBird?.primaryName}
                </strong>
                ?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-medium"
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

export default BirdData;