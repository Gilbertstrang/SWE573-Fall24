"use client";

import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

export default function CreatePostPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    material: '',
    size: '',
    color: '',
    shape: '',
    weight: '',
    location: '',
    timePeriod: '',
    handmade: false,
    tags: [],
    images: []  // New state to store images
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: files,
    }));

    // Create preview URLs for each selected file
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = new FormData();

    // Append each form field to the FormData object
    for (let key in formData) {
      if (key !== 'images') {
        postData.append(key, formData[key]);
      }
    }

    // Append each image to the FormData object
    formData.images.forEach((image) => {
      postData.append('images', image);
    });

    try {
      const response = await axiosInstance.post('/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Post created successfully:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 flex items-center justify-center">
      <div className="container mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl mb-6 text-center">Create a Post</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="title">Title:</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                  rows="4"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="material">Material:</label>
                <input
                  type="text"
                  name="material"
                  id="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="size">Size:</label>
                <input
                  type="text"
                  name="size"
                  id="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="weight">Weight:</label>
                <input
                  type="text"
                  name="weight"
                  id="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="location">Location:</label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="timePeriod">Time Period:</label>
                <input
                  type="text"
                  name="timePeriod"
                  id="timePeriod"
                  value={formData.timePeriod}
                  onChange={handleChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2" htmlFor="handmade">Handmade:</label>
                <input
                  type="checkbox"
                  name="handmade"
                  id="handmade"
                  checked={formData.handmade}
                  onChange={handleChange}
                  className="ml-2"
                />
              </div>

              {/* File Input for Images */}
              <div className="mb-4">
                <label className="block mb-2" htmlFor="images">Upload Images:</label>
                <input
                  type="file"
                  name="images"
                  id="images"
                  onChange={handleFileChange}
                  multiple
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
              </div>

              {/* Preview Uploaded Images */}
              {imagePreviews.length > 0 && (
                <div className="mb-4">
                  <label className="block mb-2">Image Preview:</label>
                  <div className="flex flex-wrap gap-4">
                    {imagePreviews.map((src, index) => (
                      <img
                        key={index}
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
