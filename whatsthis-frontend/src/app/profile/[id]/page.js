"use client";

import { useState } from "react";
import { useUser } from "../../../context/UserContext";

const ProfilePage = () => {
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser); 
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="bg-teal-500 w-full py-3 rounded hover:bg-teal-600 transition font-semibold"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
