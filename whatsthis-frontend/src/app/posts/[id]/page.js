"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams hook for dynamic segments
import axiosInstance from '../../../services/axiosInstance';

export default function PostDetailsPage() {
  const { id } = useParams(); // Use useParams to get the dynamic ID
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch post details from API
      axiosInstance
        .get(`/posts/${id}`)
        .then((response) => {
          setPost(response.data);
        })
        .catch((error) => {
          console.error("Error fetching post details:", error);
        });
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-white">{post.title}</h1>
        <p className="text-lg text-gray-200 mb-6">{post.description}</p>

        {post.tags && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-400">Tags:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-700 text-gray-200 px-2 py-1 text-sm rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-400">Images:</h3>
            <div className="flex flex-wrap gap-4 mt-2">
              {post.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Post Image ${index + 1}`} className="w-1/4 rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {post.comments && post.comments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-400">Comments:</h3>
            <div className="mt-4">
              {post.comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 p-4 mb-2 rounded-lg">
                  <p className="text-gray-300">{comment.text}</p>
                  <p className="text-sm text-gray-400 mt-2">- {comment.username}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
