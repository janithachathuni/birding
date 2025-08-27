import React, { useState } from "react";
import UserSidebar from "../../Components/AdminSidebar";
import { FaTimes, FaSave, FaArrowLeft } from "react-icons/fa";

const EditBirdData = () => {
  const [formData, setFormData] = useState({
    names: ["Sri Lanka Junglefowl", "Ceylon Junglefowl"],
    sinhala_name: "හීන් කුකුළා (Wali Kukula)",
    tamil_name: "இலங்கை காட்டு கோழி",
    scientific_name: "Gallus lafayettii",
    image: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Gallus_lafayettii_male_-_Sri_Lanka_Junglefowl.jpg",
    frequency: "common",
    residency: "resident",
    habitat_map: "https://upload.wikimedia.org/wikipedia/commons/8/82/Gallus_lafayettii_distribution_map.png",
    endemic: true,
    family: "Phasianidae",
    description:
      "The Sri Lanka Junglefowl (Gallus lafayettii) is the national bird of Sri Lanka. Endemic to the island, it inhabits forested areas and scrublands. Males are brightly colored with vivid red combs, golden hackles, and a striking red face, while females are more cryptic and brownish. It forages on the ground for seeds, insects, and small animals.",
    places: []
  });

  // Same family list as in your AddNewBirdData form
  const sriLankanBirdFamilies = [
    { family: "Accipitridae", category: "Birds of Prey" },
    { family: "Aegithalidae", category: "Long-tailed Tits" },
    { family: "Phasianidae", category: "Pheasants & Allies" },
    { family: "Columbidae", category: "Pigeons & Doves" },
    { family: "Ardeidae", category: "Herons & Egrets" },
    { family: "Corvidae", category: "Crows, Jays & Magpies" },
    { family: "Psittacidae", category: "Parrots" },
    { family: "Pycnonotidae", category: "Bulbuls" },
    { family: "Strigidae", category: "Owls" },
    { family: "Sturnidae", category: "Starlings" },
    { family: "Zosteropidae", category: "White-eyes" },
    // ... (keep your full list here)
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNameChange = (index, value) => {
    const newNames = [...formData.names];
    newNames[index] = value;
    setFormData((prev) => ({
      ...prev,
      names: newNames,
    }));
  };

  const removeNameField = (index) => {
    if (formData.names.length > 1) {
      const newNames = formData.names.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        names: newNames,
      }));
    }
  };

  const handleSubmit = () => {
    console.log("Updated Bird Data:", formData);
    // TODO: Send update request to backend
  };

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
                  Edit Bird Data
                </h1>
                <p className="text-gray-600">
                  Update information for Sri Lanka Junglefowl
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Names */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Bird Names
              </h3>
              <div className="space-y-3">
                {formData.names.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {index === 0
                          ? "Primary Name *"
                          : `Alternative Name ${index}`}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                        required={index === 0}
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
                    value={formData.sinhala_name}
                    onChange={(e) =>
                      handleInputChange("sinhala_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tamil Name
                  </label>
                  <input
                    type="text"
                    value={formData.tamil_name}
                    onChange={(e) =>
                      handleInputChange("tamil_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Scientific */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Scientific Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scientific Name *
                  </label>
                  <input
                    type="text"
                    value={formData.scientific_name}
                    onChange={(e) =>
                      handleInputChange("scientific_name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family *
                  </label>
                  <select
                    value={formData.family}
                    onChange={(e) =>
                      handleInputChange("family", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                    required
                  >
                    <option value="">Select Family</option>
                    {sriLankanBirdFamilies.map((f) => (
                      <option key={f.family} value={f.family}>
                        {f.family}: {f.category}
                      </option>
                    ))}
                  </select>
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Habitat Map URL
                  </label>
                  <input
                    type="url"
                    value={formData.habitat_map}
                    onChange={(e) =>
                      handleInputChange("habitat_map", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#506142] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
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
                    <option value="very common">Very Common</option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="very rare">Very Rare</option>
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
              />
            </div>

            {/* Submit */}
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
                <FaSave className="text-sm" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBirdData;
