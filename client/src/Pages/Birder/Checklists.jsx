import React, { useState, useEffect } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

const mockChecklists = [
  {
    id: 1,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },
  {
    id: 2,
    title: "Wetland Observation",
    tripPlace: "Jaffna Lagoon",
    speciesCount: 8,
    date: "2024-07-05",
  },
  {
    id: 3,
    title: "Mammals at Dawn",
    tripPlace: "Wilpattu National Park",
    speciesCount: 5,
    date: "2024-08-01",
  },
  {
    id: 4,
    title: "Butterfly Walk",
    tripPlace: "Sinharaja Forest Reserve",
    speciesCount: 20,
    date: "2024-06-20",
  },

  {
    id: 5,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },

  {
    id: 6,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },

  {
    id: 7,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },

  {
    id: 8,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },

  {
    id: 9,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },

  {
    id: 10,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },

  {
    id: 11,
    title: "Morning Bird Survey",
    tripPlace: "Thalangama Wetland",
    speciesCount: 12,
    date: "2024-07-10",
  },
];

const Checklists = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlace, setFilterPlace] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [checklistTitle, setChecklistTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const checklistsPerPage = 8;

  // get unique places for dropdown
  const uniquePlaces = ["all", ...new Set(mockChecklists.map((c) => c.tripPlace))];

  // filtering logic
  const filteredChecklists = mockChecklists.filter((cl) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      cl.title.toLowerCase().includes(searchLower) ||
      cl.tripPlace.toLowerCase().includes(searchLower);

    const matchesPlace = filterPlace === "all" || cl.tripPlace === filterPlace;
    const matchesDate = !filterDate || cl.date === filterDate;

    return matchesSearch && matchesPlace && matchesDate;
  });

  // pagination
  const indexOfLast = currentPage * checklistsPerPage;
  const indexOfFirst = indexOfLast - checklistsPerPage;
  const currentChecklists = filteredChecklists.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredChecklists.length / checklistsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterPlace, filterDate]);

  // Generate default title when place or date changes
  useEffect(() => {
    if (selectedPlace && selectedDate) {
      const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      setChecklistTitle(`${selectedPlace} ${formattedDate}`);
    }
  }, [selectedPlace, selectedDate]);

  // Reset form when popup is opened/closed
  useEffect(() => {
    if (showPopup) {
      // Set default values when opening popup
      setSelectedPlace("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
    } else {
      // Clear form when closing popup
      setSelectedPlace("");
      setChecklistTitle("");
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  }, [showPopup]);

  const handleSaveChecklist = () => {
    // Here you would typically save the checklist to your database
    console.log("Saving checklist:", {
      title: checklistTitle,
      place: selectedPlace,
      date: selectedDate
    });
    
    // Close the popup
    setShowPopup(false);
  };

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
                {uniquePlaces.map((place) => (
                  <option key={place} value={place}>
                    {place === "all" ? "All Places" : place}
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
            {currentChecklists.length > 0 ? (
              currentChecklists.map((cl) => (
                <div
                  key={cl.id}
                  className="pr-4 pl-4 pt-4 bg-[#eef7f1] rounded-lg hover:bg-[#f6f9f6] transition-colors"
                >
                  <h3 className="text-lg  font-semibold text-black">
                    {cl.title}
                  </h3>
                  <p className="text-gray-900">{cl.tripPlace}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm mb-4 text-gray-600">
                      Species Count: {cl.speciesCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {cl.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-[#f5f6f5] rounded-lg">
                <p className="text-gray-500">
                  No checklists found matching your criteria
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

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Trip Location</label>
              <select
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a location</option>
                {uniquePlaces.filter(place => place !== "all").map((place) => (
                  <option key={place} value={place}>
                    {place}
                  </option>
                ))}
              </select>
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
              <p className="text-xs text-gray-400 mt-1">
                Default name generated from location and date. You can edit this.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChecklist}
                disabled={!selectedPlace || !checklistTitle}
                className={`px-4 py-2 rounded-lg ${
                  !selectedPlace || !checklistTitle
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#506142] text-white hover:bg-[#3a4a32]"
                }`}
              >
                Save Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checklists;