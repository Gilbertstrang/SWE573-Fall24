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
      const res = await fetch(`http://localhost:8080/api/tags/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch tag suggestions");
      }
      const suggestions = await res.json();
      setTagSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching tag suggestions:", error);
    } finally {
      setLoadingTags(false);
    }
  };

  const addTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
    setTagsInput("");
    setTagSuggestions([]);
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
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

    const postData = {
      ...formData,
      size: `${formData.sizeValue} ${formData.sizeUnit}`,
      weight: `${formData.weightValue} ${formData.weightUnit}`,
      userId: user.id,
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
        <h1 className="text-4xl font-bold text-center mb-4">Create a New Mystery Post</h1>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Section Fields */}
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

        {/* Three Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div className="space-y-6">
            {[
              { name: "material", options: predefinedMaterials, label: "Material" },
              { name: "color", options: predefinedColors, label: "Color" },
              { name: "shape", options: predefinedShapes, label: "Shape" },
            ].map(({ name, options, label }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-lg font-semibold mb-2">
                  {label}
                </label>
                <select
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select {label.toLowerCase()}</option>
                  {options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {[
              "textAndLanguage",
              "location",
              "smell",
            ].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-lg font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder={`Enter ${field}`}
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
                <label htmlFor={name} className="block text-lg font-semibold mb-2">
                  {label}
                </label>
                <select
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select {label.toLowerCase()}</option>
                  {options.map((option, idx) => (
                    <option key={idx} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {[
              "taste",
              "texture",
              "descriptionOfParts",
            ].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-lg font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {[
              "brand",
              "print",
              "icons",
              "functionality",
            ].map((field) => (
              <div key={field}>
                <label htmlFor={field} className="block text-lg font-semibold mb-2 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            <div>
              <label htmlFor="handmade" className="flex items-center text-lg font-semibold">
                <input
                  type="checkbox"
                  id="handmade"
                  name="handmade"
                  checked={formData.handmade}
                  onChange={handleInputChange}
                  className="mr-2 w-5 h-5 rounded bg-gray-700 text-teal-500 focus:outline-none"
                />
                Handmade
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Size */}
            <div>
              <label className="block text-lg font-semibold mb-2">Size</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="sizeValue"
                  value={formData.sizeValue}
                  onChange={handleInputChange}
                  className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Size value"
                />
                <select
                  name="sizeUnit"
                  value={formData.sizeUnit}
                  onChange={handleInputChange}
                  className="w-1/3 px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {sizeUnits.map((unit, idx) => (
                    <option key={idx} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-lg font-semibold mb-2">Weight</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  name="weightValue"
                  value={formData.weightValue}
                  onChange={handleInputChange}
                  className="flex-grow px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Weight value"
                />
                <select
                  name="weightUnit"
                  value={formData.weightUnit}
                  onChange={handleInputChange}
                  className="w-1/3 px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {weightUnits.map((unit, idx) => (
                    <option key={idx} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-semibold mb-2">Tags</label>
            <input
              type="text"
              value={tagsInput}
              onChange={handleTagInputChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Add tags"
            />
            <div className="mt-4">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-teal-700 px-3 py-1 rounded-full text-white mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
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
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default CreatePostPage;
