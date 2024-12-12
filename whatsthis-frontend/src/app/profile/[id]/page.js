"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";
import commentService from "../../../services/commentService";

const ProfilePage = () => {
  const { id } = useParams(); 
  const { user, token, updateUser } = useUser();
  const router = useRouter();

  const isOwnProfile = id === user?.id.toString(); 

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [userComments, setUserComments] = useState([]);

  const fetchProfileData = async () => {
    try {
      const profileId = id || user?.id;
      const response = await fetch(`http://localhost:8080/api/users/${profileId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }
      const data = await response.json();
      setProfileData({
        username: data.username,
        email: data.email,
      });
    } catch (error) {
      setError("Failed to fetch profile data.");
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const profileId = id || user?.id;
      const response = await fetch(`http://localhost:8080/api/posts/user/${profileId}`, {
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
      setError("Failed to load posts.");
      console.error("Error fetching user posts:", error);
    }
  };

  const fetchUserComments = async () => {
    try {
      const profileId = id || user?.id;
      const comments = await commentService.getUserComments(profileId);
      setUserComments(comments);
    } catch (error) {
      setError("Failed to load comments.");
      console.error("Error fetching user comments:", error);
    }
  };

  const handleUpdate = async () => {
    if (!isOwnProfile) return;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("Profile update failed. Please try again.");
    }
  };

  const handlePostClick = (postId) => {
    router.push(`/posts/${postId}`);
  };

  useEffect(() => {
    fetchProfileData();
    if (activeTab === "posts") {
      fetchUserPosts();
    } else if (activeTab === "activity") {
      fetchUserComments();
    }
  }, [id, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return isOwnProfile ? (
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
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
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
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
        ) : (
          <div>
            <h2 className="text-3xl font-bold mb-4">{profileData.username}</h2>
            <p className="text-gray-400">{profileData.email || "No email provided"}</p>
          </div>
        );
      case "posts":
        return userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map((post) => (
              <div 
                key={post.id} 
                className="bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handlePostClick(post.id)}
              >
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-400 mb-4">{post.description}</p>
                {post.imageUrls?.length > 0 && (
                  <img
                    src={`http://localhost:8080/${post.imageUrls[0].split("/").pop()}`}
                    alt={post.title}
                    className="w-full h-auto rounded-md mb-4"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">No posts yet.</div>
        );
      case "activity":
        return userComments.length > 0 ? (
          <div className="space-y-4">
            {userComments.map((comment) => (
              <div 
                key={comment.id} 
                className="bg-gray-700 p-4 rounded-md hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handlePostClick(comment.postId)}
              >
                <p className="text-gray-300 mb-2">{comment.text}</p>
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Votes: {comment.votes}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">No comments yet.</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto max-w-4xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center text-3xl font-bold text-gray-500">
            {profileData.username[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-4xl font-bold">{profileData.username || "User"}</h1>
            <p className="text-gray-400">{profileData.email || "No email provided"}</p>
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
                activeTab === "activity" ? "bg-gray-800 text-teal-400" : "hover:bg-gray-800 text-gray-400"
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
