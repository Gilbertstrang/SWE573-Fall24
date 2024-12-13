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
    price: "",
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
    widthValue: "",
    widthUnit: "cm",
    heightValue: "",
    heightUnit: "cm",
    depthValue: "",
    depthUnit: "cm",
  });

  
  const predefinedShapes = [
    "Round/Circle", 
    "Square/Box", 
    "Rectangle/Long Box", 
    "Triangle", 
    "Oval/Egg-shaped",
    "Ball/Sphere",
    "Cylinder/Tube",
    "Cone/Triangle 3D",
    "Star",
    "Heart",
    "Cross",
    "Irregular/Random"
  ];

  const predefinedMaterials = [
    "Plastic",
    "Metal (General)",
    "Wood",
    "Glass",
    "Fabric/Cloth",
    "Paper/Cardboard",
    "Gold/Gold-colored",
    "Silver/Silver-colored",
    "Copper/Bronze",
    "Stone/Rock",
    "Leather",
    "Rubber",
    "Clay/Ceramic",
    "Foam",
    "Carbon Fiber"
  ];

  const predefinedColors = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Black",
    "White",
    "Gray",
    "Brown",
    "Beige/Tan",
    "Gold-colored",
    "Silver-colored",
    "Bronze-colored",
    "Multi-colored"
  ];

  const predefinedPatterns = [
    "Plain/Solid Color",
    "Stripes",
    "Dots",
    "Squares/Checkered",
    "Floral/Flowers",
    "Animal Print",
    "Abstract/Random",
    "Geometric Shapes",
    "Camouflage",
    "Nature/Landscape",
    "Text/Letters",
    "No Pattern"
  ];

  const predefinedTimePeriods = [
    "Very Old (100+ years)",
    "Old (50-100 years)",
    "Recent (10-50 years)",
    "New (0-10 years)",
    "Not Sure",
    "1800s",
    "1900-1950",
    "1950-2000",
    "2000-Present"
  ];

  const predefinedHardness = [
    "Very Soft (like cotton)",
    "Soft (like rubber)",
    "Medium (like wood)",
    "Hard (like metal)",
    "Very Hard (like diamond)",
    "Flexible/Bendable"
  ];

  const predefinedFunctions = [
    "Decoration Only",
    "Tool/Useful Object",
    "Both Decoration and Tool",
    "Container/Storage",
    "Clothing/Wearable",
    "Furniture/Home Item",
    "Kitchen/Cooking",
    "Game/Toy",
    "Machine Part",
    "Not Sure"
  ];

  const sizeUnits = ["cm", "in", "mm", "m"];
  const weightUnits = ["kg", "g", "lb", "oz"];
  const dimensionUnits = ["mm", "cm", "m", "in", "ft"];

  const [tagsInput, setTagsInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [parts, setParts] = useState([]);
  const [activePartIndex, setActivePartIndex] = useState(null);
  const [editingPartName, setEditingPartName] = useState(null);
  const [editedName, setEditedName] = useState("");

  const createEmptyPart = () => ({
    partName: `Part ${parts.length + 1}`,
    material: "",
    sizeValue: "",
    sizeUnit: "cm",
    textAndLanguage: "",
    color: "",
    shape: "",
    weightValue: "",
    weightUnit: "kg",
    price: "",
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
    widthValue: "",
    widthUnit: "cm",
    heightValue: "",
    heightUnit: "cm",
    depthValue: "",
    depthUnit: "cm"
  });

  const addNewPart = () => {
    setParts([...parts, createEmptyPart()]);
    setActivePartIndex(parts.length);
  };

  const handlePartInputChange = (index, name, value, type = "text") => {
    const updatedParts = [...parts];
    updatedParts[index] = {
      ...updatedParts[index],
      [name]: type === "checkbox" ? value.target.checked : (value || "")
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

    const formattedParts = parts.map(part => ({
      partName: part.partName,
      material: part.material,
      size: `${part.sizeValue || ''} ${part.sizeUnit || ''}`.trim(),
      textAndLanguage: part.textAndLanguage,
      color: part.color,
      shape: part.shape,
      weight: `${part.weightValue || ''} ${part.weightUnit || ''}`.trim(),
      price: part.price,
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
      functionality: part.functionality,
      widthValue: part.widthValue || '',
      widthUnit: part.widthUnit || '',
      heightValue: part.heightValue || '',
      heightUnit: part.heightUnit || '',
      depthValue: part.depthValue || '',
      depthUnit: part.depthUnit || ''
    }));

    const postData = {
      ...formData,
      height: `${formData.heightValue} ${formData.heightUnit}`,
      length: `${formData.lengthValue} ${formData.lengthUnit}`,
      width: `${formData.widthValue} ${formData.widthUnit}`,
      weight: `${formData.weightValue} ${formData.weightUnit}`,
      userId: user.id,
      parts: formattedParts, 
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

  const renderComboBox = ({ name, options, label, value, onChange }) => (
    <div>
      <label className="block text-lg font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          list={`${name}-options`}
          className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder={`Enter or select ${label.toLowerCase()}`}
        />
        <datalist id={`${name}-options`}>
          {options.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      </div>
    </div>
  );

  const DimensionInput = ({ label, value, unit, onValueChange, onUnitChange, units }) => (
    <div className="flex space-x-2">
      <div className="flex-grow">
        <label className="block text-lg font-semibold mb-2">{label}</label>
        <input
          type="text"
          value={value}
          onChange={onValueChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
      <div className="w-24">
        <label className="block text-lg font-semibold mb-2">Unit</label>
        <select
          value={unit}
          onChange={onUnitChange}
          className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const handlePartNameEdit = (index, newName) => {
    const updatedParts = [...parts];
    updatedParts[index] = {
      ...updatedParts[index],
      partName: newName || `Part ${index + 1}`
    };
    setParts(updatedParts);
    setEditingPartName(null);
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
                  placeholder="Enter a descriptive title"
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
                  placeholder="Describe your mystery item.  What's the story behind it?"
                ></textarea>
              </div>
            </div>

            {/* Parts Navigation and Content */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8">
              {/* Header - Now with proper connection to content */}
              <div className="px-6 pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setActivePartIndex(null)}
                      className={`px-6 py-3 rounded-t-lg transition duration-150 ${
                        activePartIndex === null
                          ? "bg-gray-700 text-white"
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
                            ? "bg-gray-700 text-white"
                            : "bg-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center">
                          {editingPartName === index ? (
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onBlur={() => handlePartNameEdit(index, editedName)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handlePartNameEdit(index, editedName);
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-gray-600 text-white px-2 py-1 rounded w-24"
                              autoFocus
                            />
                          ) : (
                            <span
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingPartName(index);
                                setEditedName(part.partName);
                              }}
                              className="cursor-text"
                            >
                              {part.partName}
                            </span>
                          )}
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
                  <button
                    type="button"
                    onClick={addNewPart}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition duration-150"
                  >
                    Add Part
                  </button>
                </div>
              </div>
              <div className="bg-gray-700 p-6">
                {activePartIndex === null ? (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                      <div className="lg:col-span-3 bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Dimensions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                name="widthValue"
                                value={formData.widthValue || ''}
                                onChange={handleInputChange}
                                placeholder="Width"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              name="widthUnit"
                              value={formData.widthUnit || 'cm'}
                              onChange={handleInputChange}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {dimensionUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                name="heightValue"
                                value={formData.heightValue || ''}
                                onChange={handleInputChange}
                                placeholder="Height"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              name="heightUnit"
                              value={formData.heightUnit || 'cm'}
                              onChange={handleInputChange}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {dimensionUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                name="depthValue"
                                value={formData.depthValue || ''}
                                onChange={handleInputChange}
                                placeholder="Depth"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              name="depthUnit"
                              value={formData.depthUnit || 'cm'}
                              onChange={handleInputChange}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {dimensionUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                name="weightValue"
                                value={formData.weightValue || ''}
                                onChange={handleInputChange}
                                placeholder="Weight"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              name="weightUnit"
                              value={formData.weightUnit || 'kg'}
                              onChange={handleInputChange}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {weightUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-6">
                        {[
                          { name: "material", options: predefinedMaterials, label: "Material" },
                          { name: "color", options: predefinedColors, label: "Color" },
                          { name: "shape", options: predefinedShapes, label: "Shape" },
                        ].map((field) => (
                          <div key={field.name}>
                            {renderComboBox({
                              name: field.name,
                              options: field.options,
                              label: field.label,
                              value: formData[field.name],
                              onChange: handleInputChange
                            })}
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
                        ].map((field) => (
                          <div key={field.name}>
                            {renderComboBox({
                              name: field.name,
                              options: field.options,
                              label: field.label,
                              value: formData[field.name],
                              onChange: handleInputChange
                            })}
                          </div>
                        ))}

                        {["taste", "texture", "price"].map((field) => (
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
                    <div className="mb-8">
                      <div className="lg:col-span-3 bg-gray-700 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Part Dimensions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={parts[activePartIndex]?.widthValue || ''}
                                onChange={(e) => handlePartInputChange(activePartIndex, "widthValue", e.target.value)}
                                placeholder="Width"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              value={parts[activePartIndex]?.widthUnit || 'cm'}
                              onChange={(e) => handlePartInputChange(activePartIndex, "widthUnit", e.target.value)}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {dimensionUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={parts[activePartIndex]?.heightValue || ''}
                                onChange={(e) => handlePartInputChange(activePartIndex, "heightValue", e.target.value)}
                                placeholder="Height"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              value={parts[activePartIndex]?.heightUnit || 'cm'}
                              onChange={(e) => handlePartInputChange(activePartIndex, "heightUnit", e.target.value)}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {dimensionUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={parts[activePartIndex]?.depthValue || ''}
                                onChange={(e) => handlePartInputChange(activePartIndex, "depthValue", e.target.value)}
                                placeholder="Depth"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              value={parts[activePartIndex]?.depthUnit || 'cm'}
                              onChange={(e) => handlePartInputChange(activePartIndex, "depthUnit", e.target.value)}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {dimensionUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={parts[activePartIndex]?.weightValue || ''}
                                onChange={(e) => handlePartInputChange(activePartIndex, "weightValue", e.target.value)}
                                placeholder="Weight"
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                              />
                            </div>
                            <select
                              value={parts[activePartIndex]?.weightUnit || 'kg'}
                              onChange={(e) => handlePartInputChange(activePartIndex, "weightUnit", e.target.value)}
                              className="w-24 px-2 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              {weightUnits.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Column 1 */}
                      <div className="space-y-6">
                        {[
                          { name: "material", options: predefinedMaterials, label: "Material" },
                          { name: "color", options: predefinedColors, label: "Color" },
                          { name: "shape", options: predefinedShapes, label: "Shape" },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-lg font-semibold mb-2">
                              {field.label}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={parts[activePartIndex][field.name]}
                                onChange={(e) => handlePartInputChange(activePartIndex, field.name, e.target.value)}
                                list={`part-${field.name}-options`}
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder={`Enter or select ${field.label.toLowerCase()}`}
                              />
                              <datalist id={`part-${field.name}-options`}>
                                {field.options.map((option) => (
                                  <option key={option} value={option} />
                                ))}
                              </datalist>
                            </div>
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
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-lg font-semibold mb-2">
                              {field.label}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={parts[activePartIndex][field.name]}
                                onChange={(e) => handlePartInputChange(activePartIndex, field.name, e.target.value)}
                                list={`part-${field.name}-options`}
                                className="w-full px-4 py-3 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder={`Enter or select ${field.label.toLowerCase()}`}
                              />
                              <datalist id={`part-${field.name}-options`}>
                                {field.options.map((option) => (
                                  <option key={option} value={option} />
                                ))}
                              </datalist>
                            </div>
                          </div>
                        ))}

                        {["taste", "texture", "price"].map((field) => (
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
