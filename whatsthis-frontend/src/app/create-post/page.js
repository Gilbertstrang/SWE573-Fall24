"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    userId: "", // Replace with actual user ID
    title: "",
    description: "",
    material: "",
    size: "",
    color: "",
    location: "",
    timePeriod: "",
    tags: [],
    imageUrls: [],
  });
  const [tagsInput, setTagsInput] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsInput = (e) => {
    setTagsInput(e.target.value);
  };

  const addTag = () => {
    if (tagsInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagsInput.trim()],
      }));
      setTagsInput("");
    }
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
      const urls = await res.json();
      setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...urls] }));
      setImages((prev) => [...prev, ...files.map((file) => file.name)]);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Post created:", data);
      router.push("/");
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Create a New Mystery Post</h1>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="material" className="block font-semibold mb-2">
                Material
              </label>
              <input
                type="text"
                id="material"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div>
              <label htmlFor="size" className="block font-semibold mb-2">
                Size
              </label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div>
              <label htmlFor="color" className="block font-semibold mb-2">
                Color
              </label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div>
              <label htmlFor="location" className="block font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>

            <div>
              <label htmlFor="timePeriod" className="block font-semibold mb-2">
                Time Period
              </label>
              <input
                type="text"
                id="timePeriod"
                name="timePeriod"
                value={formData.timePeriod}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagsInput}
                onChange={handleTagsInput}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Enter a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-teal-500 px-4 py-2 rounded hover:bg-teal-600 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
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
}
