"use client";

import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../services/axiosInstance';
import Link from 'next/link';

const ProfilePage = () => {
  const { user } = useUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (user) {
          const response = await axiosInstance.get(`/users/${user.username}/posts`);
          setPosts(response.data._embedded?.postDtoes || []);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [user]);

  if (!user) {
    return <p className="text-white text-center mt-10">You need to be logged in to see this page.</p>;
  }

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Profile of {user.username}</h1>
      <h2 className="text-2xl mb-4">Your Posts:</h2>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="bg-gray-700 p-4 rounded">
              <Link href={`/posts/${post.id}`} className="text-xl text-teal-400">
                {post.title}
              </Link>
              <p>{post.description.substring(0, 100)}...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't made any posts yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
