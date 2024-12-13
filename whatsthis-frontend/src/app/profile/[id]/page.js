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
    bio: "",
    profilePictureUrl: "",
    createdAt: null,
  });
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const [userComments, setUserComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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
        bio: data.bio,
        profilePictureUrl: data.profilePictureUrl,
        createdAt: data.createdAt,
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await fetch(`http://localhost:8080/api/users/${user.id}/profile-picture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Failed to upload image');

      const data = await uploadResponse.json();
      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: data.profilePictureUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload profile picture.');
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchUserPosts();    
    fetchUserComments();
  }, [id]);

  useEffect(() => {
    fetchProfileData();
    if (activeTab === "posts") {
      fetchUserPosts();
    } else if (activeTab === "activity") {
      fetchUserComments();
    }
  }, [id, activeTab]);

  const renderProfileOverview = () => (
    <div className="space-y-8">
      <div className="flex items-start gap-6 relative">
        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={profileData.profilePictureUrl 
              ? `http://localhost:8080${profileData.profilePictureUrl}` 
              : "https://www.gravatar.com/avatar/default?d=mp"}
            alt={profileData.username}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{profileData.username}</h2>
              <p className="text-gray-400 text-sm">{profileData.email || "No email provided"}</p>
            </div>
            
            {isOwnProfile && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 transition"
                  title="Edit Profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <p className="mt-4 text-gray-300">
            {profileData.bio || "No bio provided"}
          </p>
          
          <div className="mt-4 text-gray-400 text-xs">
            Member since {profileData.createdAt 
              ? new Date(profileData.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })
              : "Unknown"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-700">
        <div className="text-center">
          <div className="text-xl font-bold">{userPosts.length}</div>
          <div className="text-gray-400 text-sm">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{userComments.length}</div>
          <div className="text-gray-400 text-sm">Comments</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-teal-400">0</div>
          <div className="text-gray-400 text-sm">Solutions</div>
        </div>
      </div>
    </div>
  );

  const renderProfileEdit = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Edit Profile</h3>
        <button
          onClick={() => setIsEditing(false)}
          className="text-gray-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={profileData.profilePictureUrl 
                ? `http://localhost:8080${profileData.profilePictureUrl}` 
                : "https://www.gravatar.com/avatar/default?d=mp"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profile-picture-input"
          />
          <label
            htmlFor="profile-picture-input"
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </label>
        </div>

        <div className="flex-grow space-y-4">
          <input
            type="text"
            value={profileData.username}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            className="w-full px-3 py-2 rounded bg-gray-700/50 focus:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Username"
          />
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            className="w-full px-3 py-2 rounded bg-gray-700/50 focus:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Email"
          />
        </div>
      </div>

      <textarea
        value={profileData.bio || ""}
        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
        className="w-full px-3 py-2 rounded bg-gray-700/50 focus:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-500 h-24 resize-none"
        placeholder="Tell us about yourself..."
      />

      <button
        onClick={() => {
          handleUpdate();
          setIsEditing(false);
        }}
        className="w-full py-2 rounded bg-teal-500 hover:bg-teal-600 transition font-medium"
      >
        Save Changes
      </button>
    </div>
  );

  const renderPosts = () => (
    userPosts.length > 0 ? (
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
    )
  );

  const renderComments = () => {
    return userComments.length > 0 ? (
      <div className="space-y-4">
        {userComments.map((comment) => (
          <div 
            key={comment.id} 
            className="bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => handlePostClick(comment.postId)}
          >
            <p className="text-gray-300 mb-2">{comment.text}</p>
            <div className="text-sm text-gray-400">
              <span>Votes: {comment.votes}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-400 text-center">No comments yet.</div>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto max-w-3xl p-6">
        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          {isEditing && isOwnProfile ? renderProfileEdit() : renderProfileOverview()}
        </div>

        {/* Tabs Section */}
        <div className="mt-6">
          <div className="flex gap-1 bg-gray-800/30 backdrop-blur-sm p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === "posts" 
                  ? "bg-gray-700 text-teal-400" 
                  : "text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                activeTab === "activity" 
                  ? "bg-gray-700 text-teal-400" 
                  : "text-gray-400 hover:bg-gray-700/50"
              }`}
            >
              Comments
            </button>
          </div>
          <div className="mt-6">
            {activeTab === "posts" && renderPosts()}
            {activeTab === "activity" && renderComments()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
