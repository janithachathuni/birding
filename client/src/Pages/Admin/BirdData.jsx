import React, { useState, useMemo } from "react";
import AdminSidebar from "../../Components/AdminSidebar";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const BirdData = () => {
  // Enhanced bird data with families
  const initialBirds = [
    {
      id: 1,
      name: ["Sri Lanka Junglefowl", "Ceylon Junglefowl"],
      scientific_name: "Gallus lafayettii",
      family: "Phasianidae",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg/500px-Flickr_-_Rainbirder_-_Ceylon_Junglefowl_%28Gallus_lafayetii%29_Male.jpg",
    },
    {
      id: 2,
      name: ["Crimson-fronted Barbet", "Ceylon Small Barbet"],
      scientific_name: "Psilopogon rubricapillus",
      family: "Megalaimidae",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/1/1e/Ceylon_Small_Barbet_MSW.jpg",
    },
    {
      id: 3,
      name: ["Serendib Scops Owl"],
      scientific_name: "Otus thilohoffmanni",
      family: "Strigidae",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Serendib_Scops-owl.jpg/375px-Serendib_Scops-owl.jpg",
    },
    {
      id: 4,
      name: ["Sri Lanka Blue Magpie", "Ceylon Blue Magpie"],
      scientific_name: "Urocissa ornata",
      family: "Corvidae",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    },
    {
      id: 5,
      name: ["Sri Lanka White-eye", "Ceylon White-eye"],
      scientific_name: "Zosterops ceylonensis",
      family: "Zosteropidae",
      image: "https://images.unsplash.com/photo-1597149604924-d8f84c804f15?w=400&h=400&fit=crop",
    },
    {
      id: 6,
      name: ["Sri Lanka Spurfowl", "Ceylon Spurfowl"],
      scientific_name: "Galloperdix bicalcarata",
      family: "Phasianidae",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    }
  ];

  // All bird families found in Sri Lanka with their categories
  const sriLankanBirdFamilies = [
    { family: "Accipitridae", category: "Birds of Prey" },
    { family: "Aegithalidae", category: "Long-tailed Tits" },
    { family: "Alaudidae", category: "Larks" },
    { family: "Alcedinidae", category: "Kingfishers" },
    { family: "Anatidae", category: "Ducks, Geese & Swans" },
    { family: "Apodidae", category: "Swifts" },
    { family: "Ardeidae", category: "Herons & Egrets" },
    { family: "Bucerotidae", category: "Hornbills" },
    { family: "Campephagidae", category: "Cuckoo-shrikes" },
    { family: "Caprimulgidae", category: "Nightjars" },
    { family: "Charadriidae", category: "Plovers" },
    { family: "Ciconiidae", category: "Storks" },
    { family: "Cisticolidae", category: "Cisticolas & Allies" },
    { family: "Columbidae", category: "Pigeons & Doves" },
    { family: "Coraciidae", category: "Rollers" },
    { family: "Corvidae", category: "Crows, Jays & Magpies" },
    { family: "Cuculidae", category: "Cuckoos" },
    { family: "Dicaeidae", category: "Flowerpeckers" },
    { family: "Dicruridae", category: "Drongos" },
    { family: "Estrildidae", category: "Estrildid Finches" },
    { family: "Falconidae", category: "Falcons & Caracaras" },
    { family: "Fringillidae", category: "Finches & Canaries" },
    { family: "Hirundinidae", category: "Swallows & Martins" },
    { family: "Laniidae", category: "Shrikes" },
    { family: "Laridae", category: "Gulls, Terns & Skimmers" },
    { family: "Megalaimidae", category: "Asian Barbets" },
    { family: "Meropidae", category: "Bee-eaters" },
    { family: "Motacillidae", category: "Wagtails & Pipits" },
    { family: "Muscicapidae", category: "Old World Flycatchers" },
    { family: "Nectariniidae", category: "Sunbirds" },
    { family: "Oriolidae", category: "Orioles" },
    { family: "Pelecandiae", category: "Pelicans" },
    { family: "Phasianidae", category: "Pheasants & Allies" },
    { family: "Picidae", category: "Woodpeckers" },
    { family: "Pittidae", category: "Pittas" },
    { family: "Ploceidae", category: "Weavers" },
    { family: "Psittacidae", category: "Parrots" },
    { family: "Pycnonotidae", category: "Bulbuls" },
    { family: "Rallidae", category: "Rails, Crakes & Coots" },
    { family: "Scolopacidae", category: "Sandpipers & Allies" },
    { family: "Strigidae", category: "Owls" },
    { family: "Sturnidae", category: "Starlings" },
    { family: "Sylviidae", category: "Sylviid Warblers" },
    { family: "Threskiornithidae", category: "Ibises & Spoonbills" },
    { family: "Timaliidae", category: "Babblers" },
    { family: "Turdidae", category: "Thrushes" },
    { family: "Tytonidae", category: "Barn Owls" },
    { family: "Upupidae", category: "Hoopoes" },
    { family: "Vangidae", category: "Vangas" },
    { family: "Zosteropidae", category: "White-eyes" }
  ];

  const [birds] = useState(initialBirds);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedBird, setSelectedBird] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFamily, setSelectedFamily] = useState("");

  // Filter birds based on search term and family
  const filteredBirds = useMemo(() => {
    return birds.filter(bird => {
      const matchesSearch = searchTerm === "" || 
        bird.name.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        bird.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFamily = selectedFamily === "" || bird.family === selectedFamily;
      
      return matchesSearch && matchesFamily;
    });
  }, [birds, searchTerm, selectedFamily]);

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
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="w-4/5 p-6 ml-auto">
        {/* Header Section */}
        <div className="bg-[#f5f6f5] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#314124] mb-2">
                Bird Data Management
              </h1>
              <p className="text-gray-600">Manage Sri Lankan bird species data</p>
            </div>
            <button
              onClick={() => (window.location.href = "/admin/add-bird")}
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

            {/* Family Filter */}
            <div className="w-80">
              <select
                value={selectedFamily}
                onChange={(e) => setSelectedFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent bg-white"
              >
                <option value="">All Families</option>
                {sriLankanBirdFamilies.map(familyObj => (
                  <option key={familyObj.family} value={familyObj.family}>
                    {familyObj.family}: {familyObj.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedFamily) && (
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
            {(searchTerm || selectedFamily) && (
              <span className="ml-2 text-[#506142] font-medium">
                (filtered)
              </span>
            )}
          </div>
        </div>

        {/* Bird Table */}
        <div className="bg-[#f5f6f5] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#506142] text-white">
                <th className="px-6 py-4 text-left font-semibold">Image</th>
                <th className="px-6 py-4 text-left font-semibold">Name</th>
                <th className="px-6 py-4 text-left font-semibold">Scientific Name</th>
                <th className="px-6 py-4 text-left font-semibold">Family</th>
                <th className="px-6 py-4 text-center font-semibold w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBirds.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-600 mb-1">No birds found</h3>
                      <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBirds.map((bird, index) => (
                  <tr
                    key={bird.id}
                    className={`border-b border-gray-200 hover:bg-[#e8e9e8] transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-[#f5f6f5]'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <img
                        src={bird.image}
                        alt={bird.name[0]}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{bird.name[0]}</p>
                        {bird.name.length > 1 && (
                          <p className="text-sm text-gray-500 mt-1">
                            Also known as: {bird.name.slice(1).join(", ")}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="italic text-gray-700">{bird.scientific_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{bird.family}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => (window.location.href = "/admin/edit-bird")}
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <strong className="text-gray-800">{selectedBird?.name[0]}</strong>?
              </p>
              <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={cancelDelete}
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