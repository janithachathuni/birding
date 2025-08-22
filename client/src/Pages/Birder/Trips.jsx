import React, { useState } from "react";
import UserSidebar from "../../Components/UserSidebar";
import UserSidebarRight from "../../Components/UserSidebarRight";

const mockTrips = [
  {
    id: 1,
    title: "Thalangama",
    location: "Central Park, NY",
    checklists: 5,
    speciesSpotted: 12,
    image: "https://via.placeholder.com/150",
    status: "completed",
    date: "2024-07-10",
  },
  {
    id: 2,
    title: "Jaffna",
    location: "Cape May, NJ",
    checklists: 8,
    speciesSpotted: 24,
    image: "https://via.placeholder.com/150",
    status: "completed",
    date: "2024-07-05",
  },
  {
    id: 3,
    title: "Wilpattu National Park",
    location: "Adirondacks, NY",
    checklists: 3,
    speciesSpotted: 18,
    image: "https://via.placeholder.com/150",
    status: "upcoming",
    date: "2024-08-01",
  },
  {
    id: 4,
    title: "Bundala National Park",
    location: "Bundala, Sri Lanka",
    checklists: 2,
    speciesSpotted: 8,
    image: "https://via.placeholder.com/150",
    status: "upcoming",
    date: "2024-08-15",
  },
];

const Trips = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showPopup, setShowPopup] = useState(false);

  const filteredTrips = mockTrips
    .filter((trip) => {
      if (filter !== "all" && trip.status !== filter) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        trip.title.toLowerCase().includes(searchLower) ||
        (trip.location && trip.location.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortBy === "date-asc") {
        return new Date(a.date) - new Date(b.date);
      } else if (sortBy === "date-desc") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "popular") {
        return b.checklists - a.checklists;
      }
      return 0;
    });

  const loadGoogleMaps = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCFbprhDc_fKXUHl-oYEVGXKD1HciiAsz0&libraries=places`;
      document.head.appendChild(script);
    }
  };

  const handleAddTripClick = () => {
    loadGoogleMaps();
    setShowPopup(true);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex-1 p-4 ml-[20%] mr-[30%]">
        <div className="pt-4 mb-4 w-full rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-bold">Track your trips</p>
            <button
              onClick={handleAddTripClick}
              className="flex items-center gap-2 p-2 bg-[#506142] text-white rounded-full hover:bg-[#3a4a32] transition-colors"
            >
              <span className="w-6 h-6 flex items-center justify-center">+</span>
              <span className="pr-2">Add New Trip</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 my-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search trips by title or location..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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

        <div className="space-y-4 mb-16">
          {filteredTrips.length > 0 ? (
            filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 bg-[#f5f6f5] rounded-lg hover:bg-[#e5e9e5]"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {trip.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mt-1">{trip.location}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>Checklists: {trip.checklists}</span>
                      {trip.status === "completed" && (
                        <span>Species Spotted: {trip.speciesSpotted}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-[#f5f6f5] rounded-lg">
              <p className="text-gray-500">
                No trips found matching your criteria
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleAddTripClick}
            className="w-14 h-14 flex items-center justify-center bg-[#506142] text-white rounded-full hover:bg-[#3a4a32] transition-colors shadow-lg text-2xl"
          >
            +
          </button>
        </div>
      </div>
      <UserSidebarRight />

      {showPopup && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Trip</h3>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Location</label>
              <input
                type="text"
                id="location-search"
                placeholder="Search for a location..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-[#506142] text-white rounded-lg hover:bg-[#3a4a32]">
                Save Trip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;