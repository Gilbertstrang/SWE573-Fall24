"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import axiosInstance from '../../../services/axiosInstance';
import Link from 'next/link';

export default function UserProfilePage({ params }) {
  const router = useRouter();
  const { user } = useUser();

  // Unwrap the `params` object
  const id = React.use(params)?.id;

  // State to store profile details
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      router.push('/'); // Redirect to home or login if user not authenticated
    } else if (id) {
      fetchProfileData(id);
    }
  }, [user, id]);

  const fetchProfileData = async (userId) => {
    try {
      // Fetch user profile data
      const userProfile = await axiosInstance.get(`/api/users/${userId}`);
      setProfileData(userProfile.data);

      // Optionally, fetch user's posts and comments here (if required)
      // const userPosts = await axiosInstance.get(`/api/posts?userId=${userProfile.data.id}`);
      // setPosts(userPosts.data);

      // const userComments = await axiosInstance.get(`/api/comments?userId=${userProfile.data.id}`);
      // setComments(userComments.data);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-teal-300 text-center text-xl mt-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
        {profileData && (
          <>
            <div className="flex items-center space-x-4 mb-8">
              {profileData.profilePic ? (
                <img
                  src={profileData.profilePic}
                  alt={`${profileData.username}'s profile picture`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
                  {profileData.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{profileData.username}</h1>
                {profileData.bio && <p className="text-gray-400">{profileData.bio}</p>}
              </div>
            </div>

            {/* Edit Profile Section */}
            <div className="mb-6">
              <Link href={`/profile/${profileData.id}/edit`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* Posts Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Posts</h2>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.id} className="bg-gray-700 p-4 rounded-md mb-4">
                    <Link href={`/posts/${post.id}`}>
                      <h3 className="text-xl font-bold cursor-pointer">{post.title}</h3>
                    </Link>
                    <p className="text-gray-400">{post.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No posts found.</p>
              )}
            </div>

            {/* Comments Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Comments</h2>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-700 p-4 rounded-md mb-4">
                    <p className="text-gray-300">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments found.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
