"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../../context/UserContext";

const ProfilePage = () => {
  const { user, token, updateUser } = useUser();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

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
          Authorization: `Bearer ${token}`,
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

  const fetchUserPosts = async () => {
    setIsLoadingPosts(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:8080/api/posts/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user posts");
      }

      const data = await response.json();
      setUserPosts(data._embedded?.postDtoes || []);
    } catch (error) {
      setError("Failed to load posts. Please try again.");
      console.error("Error fetching user posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (activeTab === "posts") {
      fetchUserPosts();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
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
        );
      case "posts":
        if (isLoadingPosts) {
          return <div className="text-teal-300 text-center">Loading posts...</div>;
        }

        if (error) {
          return <div className="text-red-500 text-center">{error}</div>;
        }

        return userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div key={post.id} className="bg-gray-700 p-4 rounded-md shadow-md">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4">{post.description}</p>

                {post.imageUrls && post.imageUrls.length > 0 && (
                  <img
                    src={`http://localhost:8080/${post.imageUrls[0].split("/").pop()}`}
                    alt={post.title}
                    className="w-full h-auto rounded-md mb-4"
                  />
                )}

                <a
                  href={`/posts/${post.id}`}
                  className="text-teal-400 hover:underline"
                >
                  View Post
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">You have not created any posts yet.</div>
        );
      case "activity":
        return <div className="text-gray-400 text-center">Your comments will appear here.</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold text-gray-500">
            {user?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{user?.username || "User"}</h1>
            <p className="text-gray-400">{user?.email || "No email provided"}</p>
          </div>
        </div>

        <div className="mb-8">
          <ul className="flex gap-4 border-b border-gray-700 pb-2">
            <li
              className={`cursor-pointer px-4 py-2 rounded ${
                activeTab === "profile" ? "bg-gray-800 text-teal-400" : "hover:bg-gray-800 text-gray-400"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </li>
            <li
              className={`cursor-pointer px-4 py-2 rounded ${
                activeTab === "posts" ? "bg-gray-800 text-teal-400" : "hover:bg-gray-800 text-gray-400"
              }`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </li>
            <li
              className={`cursor-pointer px-4 py-2 rounded ${
                activeTab === "comments" ? "bg-gray-800 text-teal-400" : "hover:bg-gray-800 text-gray-400"
              }`}
              onClick={() => setActiveTab("activity")}
            >
              Comments
            </li>
          </ul>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
