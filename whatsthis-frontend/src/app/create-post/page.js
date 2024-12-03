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
    tags: [],
    imageUrls: [],
  });

  const [tagsInput, setTagsInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const fetchTagSuggestions = async (query) => {
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
      const tags = await res.json();
      setTagSuggestions(tags);
    } catch (err) {
      console.error("Error fetching tag suggestions:", err);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleTagsInput = (e) => {
    const query = e.target.value;
    setTagsInput(query);
    fetchTagSuggestions(query);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to create a post.");
      return;
    }

    const postData = {
      ...formData,
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
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Create a New Mystery Post</h1>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              rows={4}
            />
          </div>

          
          {[
            "material",
            "size",
            "textAndLanguage",
            "color",
            "shape",
            "weight",
            "descriptionOfParts",
            "location",
            "timePeriod",
            "smell",
            "taste",
            "texture",
            "hardness",
            "pattern",
            "brand",
            "print",
            "icons",
            "functionality",
          ].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-semibold mb-2 capitalize">
                {field.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
          ))}

          {/* Checkbox for Handmade */}
          <div>
            <label htmlFor="handmade" className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="handmade"
                name="handmade"
                checked={formData.handmade}
                onChange={handleInputChange}
                className="rounded bg-gray-800"
              />
              <span>Handmade</span>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold mb-2">Tags</label>
            <div className="flex flex-col relative">
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsInput}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Search for a tag"
              />
              {loadingTags && <p className="text-gray-400 mt-2">Loading suggestions...</p>}
              {tagSuggestions.length > 0 && (
                <ul className="absolute bg-gray-800 border border-gray-600 mt-2 rounded shadow-md w-full max-h-40 overflow-y-auto">
                  {tagSuggestions.map((tag, index) => (
                    <li
                      key={index}
                      onClick={() => addTag(tag.label)}
                      className="p-2 cursor-pointer hover:bg-gray-700"
                    >
                      {tag.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-teal-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-red-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block font-semibold mb-2">Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="w-full"
            />
            {loading && <p className="text-gray-400">Uploading images...</p>}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((name, index) => (
                <div key={index} className="bg-gray-800 p-2 rounded">
                  {name}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-teal-500 w-full py-3 rounded hover:bg-teal-600 transition font-semibold"
            disabled={loading}
          >
            Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
