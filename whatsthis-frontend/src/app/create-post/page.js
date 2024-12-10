"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";

const CreatePostPage = () => {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    material: "",
    sizeValue: "",
    sizeUnit: "cm",
    textAndLanguage: "",
    color: "",
    shape: "",
    weightValue: "",
    weightUnit: "kg",
    descriptionOfParts: "",
    location: "",
    timePeriod: "",
    smell: "",
    taste: "",
    texture: "",
    hardness: "",
    pattern: "",
    brand: "",
    print: "",
    icons: "",
    handmade: false,
    functionality: "",
    tags: [],
    imageUrls: [],
  });

  
  const predefinedShapes = ["Round", "Square", "Rectangle", "Triangle", "Oval", "Hexagon", "Irregular"];
  const predefinedMaterials = ["Plastic", "Metal", "Wood", "Glass", "Fabric", "Paper"];
  const predefinedColors = ["Red", "Green", "Blue", "Black", "White", "Yellow", "Purple", "Brown"];
  const predefinedPatterns = ["Striped", "Polka Dot", "Plaid", "Solid", "Abstract", "Geometric"];
  const predefinedTimePeriods = ["19th Century", "20th Century", "21st Century", "Ancient"];
  const predefinedHardness = ["Soft", "Medium", "Hard"];
  const predefinedFunctions = ["Decorative", "Functional", "Both"];
  const sizeUnits = ["cm", "in", "mm", "m"];
  const weightUnits = ["kg", "g", "lb", "oz"];

  const [tagsInput, setTagsInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [parts, setParts] = useState([]);
  const [activePartIndex, setActivePartIndex] = useState(null);

  const createEmptyPart = () => ({
    partName: `Part ${parts.length + 1}`,
    material: "",
    size: "",
    textAndLanguage: "",
    color: "",
    shape: "",
    weight: "",
    descriptionOfParts: "",
    location: "",
    timePeriod: "",
    smell: "",
    taste: "",
    texture: "",
    hardness: "",
    pattern: "",
    brand: "",
    print: "",
    icons: "",
    handmade: false,
    functionality: "",
  });

  const addNewPart = () => {
    setParts([...parts, createEmptyPart()]);
    setActivePartIndex(parts.length);
  };

  const handlePartInputChange = (index, name, value, type = "text") => {
    const updatedParts = [...parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [name]: type === "checkbox" ? value.target.checked : value,
    };
    setParts(updatedParts);
  };

  const removePart = (index) => {
    setParts(parts.filter((_, i) => i !== index));
    setActivePartIndex(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagInputChange = async (e) => {
    const query = e.target.value;
    setTagsInput(query);
    
    if (!query.trim()) {
      setTagSuggestions([]);
      return;
    }

    setLoadingTags(true);
    try {
      console.log('Fetching tags for query:', query);
      const res = await fetch(`http://localhost:8080/api/tags/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch tag suggestions");
      }
      const suggestions = await res.json();
      console.log('Received tag suggestions:', suggestions);
      setTagSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching tag suggestions:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const addTag = (suggestion) => {
    const tagLabel = suggestion.label;
    if (!formData.tags.includes(tagLabel)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagLabel]
      }));
    }
    setTagsInput("");
    setTagSuggestions([]);
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/uploads/images", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload images");
      }

      const urls = await res.json();
      setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
      setImages((prev) => [...prev, ...files.map((file) => file.name)]);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    // Format the parts data properly
    const formattedParts = parts.map(part => ({
      partName: part.partName,
      material: part.material,
      size: `${part.sizeValue || ''} ${part.sizeUnit || ''}`.trim(),
      textAndLanguage: part.textAndLanguage,
      color: part.color,
      shape: part.shape,
      weight: `${part.weightValue || ''} ${part.weightUnit || ''}`.trim(),
      descriptionOfParts: part.descriptionOfParts,
      location: part.location,
      timePeriod: part.timePeriod,
      smell: part.smell,
      taste: part.taste,
      texture: part.texture,
      hardness: part.hardness,
      pattern: part.pattern,
      brand: part.brand,
      print: part.print,
      icons: part.icons,
      handmade: part.handmade || false,
      functionality: part.functionality
    }));

    const postData = {
      ...formData,
      size: `${formData.sizeValue} ${formData.sizeUnit}`,
      weight: `${formData.weightValue} ${formData.weightUnit}`,
      userId: user.id,
      parts: formattedParts, // Use the formatted parts
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      const data = await res.json();
      console.log("Post created successfully:", data);

      router.push("/");
    } catch (err) {
      console.error("Post creation failed:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="container mx-auto py-8">
        <div className="max-w-full mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Top Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-4">Create a New Post</h1>
            {error && (
              <div className="bg-red-600 text-white p-4 rounded mb-4">
                {error}
              </div>
            )}
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title and Description - Always visible */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <label htmlFor="title" className="block text-lg font-semibold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div className="lg:col-span-3">
                <label htmlFor="description" className="block text-lg font-semibold mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={3}
                  placeholder="Describe your mystery post"
                ></textarea>
              </div>
            </div>

            {/* Parts Navigation and Content */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8">
              {/* Header */}
              <div className="px-6 pt-6 pb-0">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Item Details</h3>
                  <button
                    type="button"
                    onClick={addNewPart}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition duration-150"
                  >
                    Add Part
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setActivePartIndex(null)}
                    className={`px-6 py-3 rounded-t-lg transition duration-150 ${
                      activePartIndex === null
                        ? "bg-gray-700 text-white border-t border-l border-r border-gray-600"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    General
                  </button>
                  {parts.map((part, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActivePartIndex(index)}
                      className={`px-6 py-3 rounded-t-lg transition duration-150 ${
                        activePartIndex === index
                          ? "bg-gray-700 text-white border-t border-l border-r border-gray-600"
                          : "bg-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center">
                        {part.partName}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            removePart(index);
                          }}
                          className="ml-3 text-red-400 hover:text-red-600 rounded-full hover:bg-gray-800 w-6 h-6 flex items-center justify-center"
                        >
                          ×
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="bg-gray-700 p-6 rounded-b-lg">
                {activePartIndex === null ? (
                  <div>
            

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-6">
                        {[
                          { name: "material", options: predefinedMaterials, label: "Material" },
                          { name: "color", options: predefinedColors, label: "Color" },
                          { name: "shape", options: predefinedShapes, label: "Shape" },
                        ].map(({ name, options, label }) => (
                          <div key={name}>
                            <label className="block text-lg font-semibold mb-2">
                              {label}
                            </label>
                            <select
                              name={name}
                              value={formData[name]}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option value="">Select {label.toLowerCase()}</option>
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                        {["textAndLanguage", "location", "smell"].map((field) => (
                          <div key={field}>
                            <label className="block text-lg font-semibold mb-2 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-6">
                        {[
                          { name: "pattern", options: predefinedPatterns, label: "Pattern" },
                          { name: "timePeriod", options: predefinedTimePeriods, label: "Time Period" },
                          { name: "hardness", options: predefinedHardness, label: "Hardness" },
                        ].map(({ name, options, label }) => (
                          <div key={name}>
                            <label className="block text-lg font-semibold mb-2">
                              {label}
                            </label>
                            <select
                              name={name}
                              value={formData[name]}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option value="">Select {label.toLowerCase()}</option>
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                        {["taste", "texture", "descriptionOfParts"].map((field) => (
                          <div key={field}>
                            <label className="block text-lg font-semibold mb-2 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-6">
                        {["brand", "print", "icons", "functionality"].map((field) => (
                          <div key={field}>
                            <label className="block text-lg font-semibold mb-2 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </div>
                        ))}

                        <div>
                          <label className="flex items-center text-lg font-semibold">
                            <input
                              type="checkbox"
                              name="handmade"
                              checked={formData.handmade}
                              onChange={handleInputChange}
                              className="mr-2 w-5 h-5 rounded bg-gray-600 text-teal-500 focus:outline-none"
                            />
                            Handmade
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  
                  <div>
                    {/* Part Name */}
                    <div className="lg:col-span-3 mb-6">
                      <label className="block text-lg font-semibold mb-2">Part Name</label>
                      <input
                        type="text"
                        value={parts[activePartIndex].partName}
                        onChange={(e) => handlePartInputChange(activePartIndex, "partName", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Part Name"
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-6">
                        {[
                          { name: "material", options: predefinedMaterials, label: "Material" },
                          { name: "color", options: predefinedColors, label: "Color" },
                          { name: "shape", options: predefinedShapes, label: "Shape" },
                        ].map(({ name, options, label }) => (
                          <div key={name}>
                            <label className="block text-lg font-semibold mb-2">
                              {label}
                            </label>
                            <select
                              value={parts[activePartIndex][name]}
                              onChange={(e) => handlePartInputChange(activePartIndex, name, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option value="">Select {label.toLowerCase()}</option>
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                        {["textAndLanguage", "location", "smell"].map((field) => (
                          <div key={field}>
                            <label className="block text-lg font-semibold mb-2 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              value={parts[activePartIndex][field]}
                              onChange={(e) => handlePartInputChange(activePartIndex, field, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-6">
                        {[
                          { name: "pattern", options: predefinedPatterns, label: "Pattern" },
                          { name: "timePeriod", options: predefinedTimePeriods, label: "Time Period" },
                          { name: "hardness", options: predefinedHardness, label: "Hardness" },
                        ].map(({ name, options, label }) => (
                          <div key={name}>
                            <label className="block text-lg font-semibold mb-2">
                              {label}
                            </label>
                            <select
                              value={parts[activePartIndex][name]}
                              onChange={(e) => handlePartInputChange(activePartIndex, name, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <option value="">Select {label.toLowerCase()}</option>
                              {options.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                        {["taste", "texture", "descriptionOfParts"].map((field) => (
                          <div key={field}>
                            <label className="block text-lg font-semibold mb-2 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              value={parts[activePartIndex][field]}
                              onChange={(e) => handlePartInputChange(activePartIndex, field, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-6">
                        {["brand", "print", "icons", "functionality"].map((field) => (
                          <div key={field}>
                            <label className="block text-lg font-semibold mb-2 capitalize">
                              {field.replace(/([A-Z])/g, " $1")}
                            </label>
                            <input
                              type="text"
                              value={parts[activePartIndex][field]}
                              onChange={(e) => handlePartInputChange(activePartIndex, field, e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                            />
                          </div>
                        ))}

                        <div>
                          <label className="flex items-center text-lg font-semibold">
                            <input
                              type="checkbox"
                              checked={parts[activePartIndex].handmade}
                              onChange={(e) => handlePartInputChange(activePartIndex, "handmade", e, "checkbox")}
                              className="mr-2 w-5 h-5 rounded bg-gray-600 text-teal-500 focus:outline-none"
                            />
                            Handmade
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
              <label className="block text-lg font-semibold mb-2">Tags</label>
              <div className="relative">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={handleTagInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Add tags"
                />
                {tagSuggestions.length > 0 && (
                  <div 
                    className="absolute left-0 right-0 z-[100] mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-600"
                    style={{ top: '100%' }}
                  >
                    {tagSuggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-600 text-white"
                        onClick={() => addTag(suggestion)}
                      >
                        <div className="font-semibold">{suggestion.label}</div>
                        <div className="text-sm text-gray-300">{suggestion.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Tags */}
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-teal-600 text-white px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-white hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
              <label className="block text-lg font-semibold mb-2">Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 focus:outline-none"
                disabled={loading}
              >
                {loading ? "Creating Post..." : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
