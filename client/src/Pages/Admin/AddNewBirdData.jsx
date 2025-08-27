import React, { useState } from "react";
import UserSidebar from "../../Components/AdminSidebar";
import { FaPlus, FaTimes, FaSave, FaArrowLeft } from "react-icons/fa";

const AddNewBirdData = () => {
  const [formData, setFormData] = useState({
    names: [""],
    sinhala_name: "",
    tamil_name: "",
    scientific_name: "",
    image: "",
    frequency: "",
    residency: "",
    habitat_map: "",
    endemic: false,
    family: "",
    description: "",
    places: [""]
  });

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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNameChange = (index, value) => {
    const newNames = [...formData.names];
    newNames[index] = value;
    setFormData(prev => ({
      ...prev,
      names: newNames
    }));
  };

  const addNameField = () => {
    setFormData(prev => ({
      ...prev,
      names: [...prev.names, ""]
    }));
  };

  const removeNameField = (index) => {
    if (formData.names.length > 1) {
      const newNames = formData.names.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        names: newNames
      }));
    }
  };

  const handlePlaceChange = (index, value) => {
    const newPlaces = [...formData.places];
    newPlaces[index] = value;
    setFormData(prev => ({
      ...prev,
      places: newPlaces
    }));
  };

  const addPlaceField = () => {
    setFormData(prev => ({
      ...prev,
      places: [...prev.places, ""]
    }));
  };

  const removePlaceField = (index) => {
    if (formData.places.length > 1) {
      const newPlaces = formData.places.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        places: newPlaces
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    // Handle form submission here
  };

  const showPlaces = formData.frequency === "rare" || formData.frequency === "very rare";

  return (
    <div className="flex min-h-screen bg-white">
      <UserSidebar />
      <div className="flex pl-8 pb-15 pt-4 pr-20 bg-[#f5f6f5] flex-1  ml-[20%]">
        <div className="  w-full rounded-lg">
          {/* Header */}
          <div className="flex  items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 text-[#506142] hover:bg-[#506142] hover:text-white rounded-lg transition-all duration-200"
              >
                <FaArrowLeft />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#253518]">Add New Bird Data</h1>
                <p className="text-gray-600">Enter information about a new bird species</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 ">
            {/* Names Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bird Names</h3>
              <div className="space-y-3">
                {formData.names.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {index === 0 ? "Primary Name *" : `Alternative Name ${index}`}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                        required={index === 0}
                        placeholder={index === 0 ? "Enter primary bird name" : "Enter alternative name"}
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeNameField(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-200"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addNameField}
                  className="flex items-center gap-2 px-4 py-2 text-[#506142] border border-[#506142] rounded-lg hover:bg-[#506142] hover:text-white transition-all duration-200"
                >
                  <FaPlus className="text-sm" /> Add Alternative Name
                </button>
              </div>
            </div>

            {/* Local Names */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Local Names</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sinhala Name</label>
                  <input
                    type="text"
                    value={formData.sinhala_name}
                    onChange={(e) => handleInputChange('sinhala_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter Sinhala name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamil Name</label>
                  <input
                    type="text"
                    value={formData.tamil_name}
                    onChange={(e) => handleInputChange('tamil_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter Tamil name"
                  />
                </div>
              </div>
            </div>

            {/* Scientific Classification */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Scientific Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name *</label>
                  <input
                    type="text"
                    value={formData.scientific_name}
                    onChange={(e) => handleInputChange('scientific_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter scientific name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Family *</label>
                  <select
                    value={formData.family}
                    onChange={(e) => handleInputChange('family', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Family</option>
                    {sriLankanBirdFamilies.map(familyObj => (
                      <option key={familyObj.family} value={familyObj.family}>
                        {familyObj.family}: {familyObj.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bird Image URL *</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Habitat Map URL</label>
                  <input
                    type="url"
                    value={formData.habitat_map}
                    onChange={(e) => handleInputChange('habitat_map', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    placeholder="Enter habitat map URL"
                  />
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Frequency</option>
                    <option value="very common">Very Common</option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="very rare">Very Rare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residency *</label>
                  <select
                    value={formData.residency}
                    onChange={(e) => handleInputChange('residency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Residency</option>
                    <option value="resident">Resident</option>
                    <option value="migrant">Migrant</option>
                    <option value="vagrant">Vagrant</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.endemic}
                      onChange={(e) => handleInputChange('endemic', e.target.checked)}
                      className="rounded border-gray-300 text-[#506142] focus:ring-[#506142]"
                    />
                    Endemic to Sri Lanka
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                placeholder="Enter detailed description of the bird..."
              />
            </div>

            {/* Places (only show if rare/very rare) */}
            {showPlaces && (
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Known Locations</h3>
                <p className="text-sm text-gray-600 mb-4">List places where this rare bird has been frequently observed</p>
                <div className="space-y-3">
                  {formData.places.map((place, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={place}
                          onChange={(e) => handlePlaceChange(index, e.target.value)}
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
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-[#506142] text-white rounded-lg hover:bg-[#3f4d34] transition-all font-medium"
              >
                <FaSave className="text-sm" /> Save Bird Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewBirdData;