import React, { useState, useMemo } from "react";
import UserSidebar from "../../Components/AdminSidebar";
import { FaPlus, FaTimes, FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Static data for orders and families in Sri Lanka
const sriLankanBirdOrders = [
  "Accipitriformes",
  "Anseriformes",
  "Apodiformes",
  "Bucerotiformes",
  "Caprimulgiformes",
  "Charadriiformes",
  "Ciconiiformes",
  "Columbiformes",
  "Coraciiformes",
  "Cuculiformes",
  "Falconiformes",
  "Galliformes",
  "Pelecaniformes",
  "Piciformes",
  "Psittaciformes",
  "Strigiformes",
  "Upupiformes",
  "Passeriformes",
];

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
  { family: "Pelecanidae", category: "Pelicans" },
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
  { family: "Zosteropidae", category: "White-eyes" },
];

const AddNewBirdData = () => {
  const [formData, setFormData] = useState({
    primaryName: "",
    otherNames: [""],
    scientificName: "",
    order: "", // ADDED ORDER FIELD
    family: "",
    description: "",
    sinhalaName: "",
    tamilName: "",
    image: "",
    habitatMap: "",
    frequency: "",
    residency: "",
    endemic: false,
    places: [""],
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderSuggestions, setShowOrderSuggestions] = useState(false);
  const [showFamilySuggestions, setShowFamilySuggestions] = useState(false);
  const navigate = useNavigate();

  // Filtered lists for suggestions
  const filteredOrders = useMemo(() => {
    if (!formData.order) return [];
    return sriLankanBirdOrders.filter((order) =>
      order.toLowerCase().includes(formData.order.toLowerCase())
    );
  }, [formData.order]);

  const filteredFamilies = useMemo(() => {
    if (!formData.family) return [];
    return sriLankanBirdFamilies.filter((familyObj) =>
      familyObj.family.toLowerCase().includes(formData.family.toLowerCase()) ||
      familyObj.category.toLowerCase().includes(formData.family.toLowerCase())
    );
  }, [formData.family]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOtherNameChange = (index, value) => {
    const newNames = [...formData.otherNames];
    newNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      otherNames: newNames,
    }));
  };

  const addOtherNameField = () => {
    setFormData((prev) => ({
      ...prev,
      otherNames: [...prev.otherNames, ""],
    }));
  };

  const removeOtherNameField = (index) => {
    if (formData.otherNames.length > 1) {
      const newNames = formData.otherNames.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        otherNames: newNames,
      }));
    }
  };

  const handlePlaceChange = (index, value) => {
    const newPlaces = [...formData.places];
    newPlaces[index] = value;
    setFormData((prev) => ({
      ...prev,
      places: newPlaces,
    }));
  };

  const addPlaceField = () => {
    setFormData((prev) => ({
      ...prev,
      places: [...prev.places, ""],
    }));
  };

  const removePlaceField = (index) => {
    if (formData.places.length > 1) {
      const newPlaces = formData.places.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        places: newPlaces,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const {
      primaryName,
      scientificName,
      order, // ADDED ORDER HERE
      family,
      description,
      image,
      frequency,
      residency,
    } = formData;

    if (
      !primaryName ||
      !scientificName ||
      !order || // ADDED ORDER TO VALIDATION
      !family ||
      !description ||
      !image ||
      !frequency ||
      !residency
    ) {
      setError("Please fill all required fields (marked with *)");
      setIsSubmitting(false);
      return;
    }

    const filteredOtherNames = formData.otherNames.filter(
      (name) => name.trim() !== ""
    );
    const filteredPlaces = formData.places.filter(
      (place) => place.trim() !== ""
    );

    const submissionData = {
      ...formData,
      otherNames: filteredOtherNames,
      places: filteredPlaces,
    };

    axios
      .post("http://localhost:3001/api/birds/add", submissionData)
      .then((result) => {
        console.log(result);
        if (result.data.message === "Bird added successfully") {
          navigate("/admin/bird-data");
        } else {
          setError(result.data.message || "Failed to add bird");
        }
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.log("Full error object:", err);
        if (err.response) {
          setError(err.response.data.message || "Server error occurred");
        } else if (err.request) {
          setError("No response from server. Check if server is running.");
        } else {
          setError("Failed to add bird. Please try again.");
        }
        setIsSubmitting(false);
      });
  };

  const showPlaces =
    formData.frequency === "Uncommon" ||
    formData.frequency === "Rare" ||
    formData.frequency === "Very Rare";

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex pl-8 pb-15 pt-4 pr-20 bg-[#f5f6f5] flex-1 ml-[20%]">
        <div className="w-full rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#253518]">
                  Add New Bird Data
                </h1>
                <p className="text-gray-600">
                  Enter information about a new bird species
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bird Names
              </h3>
              <div className="space-y-3">
                {/* Primary Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Name *
                  </label>
                  <input
                    type="text"
                    value={formData.primaryName}
                    onChange={(e) =>
                      handleInputChange("primaryName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter primary bird name"
                  />
                </div>

                {/* Other Names */}
                {formData.otherNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {`Alternative Name ${index + 1}`}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleOtherNameChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                        placeholder="Enter alternative name"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeOtherNameField(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200 mt-5"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addOtherNameField}
                  className="flex items-center gap-2 px-4 py-2 text-[#506142] border border-[#506142] rounded-lg hover:bg-[#506142] hover:text-white transition-all duration-200"
                >
                  <FaPlus className="text-sm" /> Add Alternative Name
                </button>
              </div>
            </div>

            {/* Local Names */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Local Names
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sinhala Name
                  </label>
                  <input
                    type="text"
                    value={formData.sinhalaName}
                    onChange={(e) =>
                      handleInputChange("sinhalaName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter Sinhala name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamil Name
                  </label>
                  <input
                    type="text"
                    value={formData.tamilName}
                    onChange={(e) =>
                      handleInputChange("tamilName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter Tamil name"
                  />
                </div>
              </div>
            </div>

            {/* Scientific Classification */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Scientific Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scientific Name *
                  </label>
                  <input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) =>
                      handleInputChange("scientificName", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter scientific name"
                  />
                </div>
                {/* ADDED ORDER SELECTION */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order *
                  </label>
                  <input
                    type="text"
                    value={formData.order}
                    onChange={(e) => {
                      handleInputChange("order", e.target.value);
                      setShowOrderSuggestions(true);
                    }}
                    onFocus={() => setShowOrderSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowOrderSuggestions(false), 200)} // Delay hiding
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter order"
                  />
                  {showOrderSuggestions && filteredOrders.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredOrders.map((order) => (
                        <li
                          key={order}
                          onMouseDown={() => { // Use onMouseDown to prevent blur
                            handleInputChange("order", order);
                            setShowOrderSuggestions(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {order}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* END OF ADDED ORDER SELECTION */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family *
                  </label>
                  <input
                    type="text"
                    value={formData.family}
                    onChange={(e) => {
                      handleInputChange("family", e.target.value);
                      setShowFamilySuggestions(true);
                    }}
                    onFocus={() => setShowFamilySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowFamilySuggestions(false), 200)} // Delay hiding
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter family name"
                  />
                  {showFamilySuggestions && filteredFamilies.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                      {filteredFamilies.map((familyObj) => (
                        <li
                          key={familyObj.family}
                          onMouseDown={() => { // Use onMouseDown to prevent blur
                            handleInputChange("family", familyObj.family);
                            setShowFamilySuggestions(false);
                          }}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                        >
                          {familyObj.family}: {familyObj.category}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bird Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange("image", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Habitat Map URL
                  </label>
                  <input
                    type="url"
                    value={formData.habitatMap}
                    onChange={(e) =>
                      handleInputChange("habitatMap", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter habitat map URL"
                  />
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Status Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) =>
                      handleInputChange("frequency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="Very Common">Very Common</option>
                    <option value="Common">Common</option>
                    <option value="Uncommon">Uncommon</option>
                    <option value="Rare">Rare</option>
                    <option value="Very Rare">Very Rare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Residency *
                  </label>
                  <select
                    value={formData.residency}
                    onChange={(e) =>
                      handleInputChange("residency", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Residency</option>
                    <option value="Resident">Resident</option>
                    <option value="Migrant">Migrant</option>
                    <option value="Vagrant">Vagrant</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.endemic}
                      onChange={(e) =>
                        handleInputChange("endemic", e.target.checked)
                      }
                      className="rounded border-gray-300 text-[#506142] focus:ring-[#506142]"
                    />
                    Endemic to Sri Lanka
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Description
              </h3>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                placeholder="Enter detailed description of the bird..."
                required
              />
            </div>

            {/* Places (only show if rare/very rare) */}
            {showPlaces && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Known Locations
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  List places where this rare bird has been frequently observed
                </p>
                <div className="space-y-3">
                  {formData.places.map((place, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={place}
                          onChange={(e) =>
                            handlePlaceChange(index, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                          placeholder={`Enter location ${index + 1}`}
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removePlaceField(index)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addPlaceField}
                    className="flex items-center gap-2 px-4 py-2 text-[#506142] border border-[#506142] rounded-lg hover:bg-[#506142] hover:text-white transition-all duration-200"
                  >
                    <FaPlus className="text-sm" /> Add Location
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all font-medium ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <FaSave className="text-sm" />
                {isSubmitting ? "Saving..." : "Save Bird Data"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewBirdData;