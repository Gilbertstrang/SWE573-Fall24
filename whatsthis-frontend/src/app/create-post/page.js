"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import axiosInstance from '../../services/axiosInstance';

export default function CreatePostPage() {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    material: '',
    size: '',
    textAndLanguage: '',
    color: '',
    shape: '',
    weight: '',
    descriptionOfParts: '',
    location: '',
    timePeriod: '',
    smell: '',
    taste: '',
    texture: '',
    hardness: '',
    pattern: '',
    brand: '',
    print: '',
    icons: '',
    handmade: false,
    functionality: '',
    tags: [],
    images: []
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push('/login'); // Redirect to login if not logged in
    }
  }, [user]);

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

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setSuggestedTags(
      availableTags.filter((tag) => tag.toLowerCase().includes(value.toLowerCase()))
    );
  };

  const handleTagSelect = (tag) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: [...prevFormData.tags, tag],
    }));
    setSuggestedTags([]);
  };

  const handleRemoveTag = (tag) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      tags: prevFormData.tags.filter((t) => t !== tag),
    }));
  };

  const fetchAvailableTags = async () => {
    try {
      const response = await axiosInstance.get('/posts/tags?query=');
      setAvailableTags(response.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = new FormData();

    // Append each form field to the FormData object
    for (let key in formData) {
      if (key !== 'images' && key !== 'tags') {
        postData.append(key, formData[key]);
      }
    }

    // Append tags as JSON
    postData.append('tags', JSON.stringify(formData.tags));

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
      // Redirect after successful post creation
      router.push('/');
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
              {/* Additional Fields */}
              {/* Material */}
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
              {/* Size */}
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

              {/* Tags Section */}
              <div className="mb-4">
                <label className="block mb-2">Tags:</label>
                <input
                  type="text"
                  placeholder="Type to search tags..."
                  onChange={handleTagInputChange}
                  className="w-full p-2 rounded-lg bg-gray-700 text-white"
                />
                {suggestedTags.length > 0 && (
                  <div className="bg-gray-700 p-2 rounded-lg mt-2">
                    {suggestedTags.map((tag, index) => (
                      <div
                        key={index}
                        className="cursor-pointer p-2 hover:bg-gray-600 rounded"
                        onClick={() => handleTagSelect(tag)}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap mt-4">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="bg-teal-500 text-white p-2 rounded-lg mr-2 mb-2 flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-sm text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
