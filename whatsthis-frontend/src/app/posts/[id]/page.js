"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import postService from '../../../services/postService';
import { useUser } from '../../../context/UserContext';
import Link from 'next/link';

export default function DetailedPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useUser();

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await postService.getPostById(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleUpvote = async () => {
    if (user) {
      try {
        await postService.upvotePost(post.id);
        setPost({ ...post, votes: post.votes + 1 });
      } catch (error) {
        console.error('Error upvoting post:', error);
      }
    } else {
      router.push('/login'); // Redirect to login if not logged in
    }
  };

  const handleDownvote = async () => {
    if (user) {
      try {
        await postService.downvotePost(post.id);
        setPost({ ...post, votes: post.votes - 1 });
      } catch (error) {
        console.error('Error downvoting post:', error);
      }
    } else {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="text-teal-300 text-center text-xl mt-10">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-10 text-red-500">
        Post not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="mb-4 text-gray-300">{post.description}</p>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {post.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Post Image ${index + 1}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Details</h3>
          <ul className="list-disc list-inside text-gray-400">
            {post.material && <li>Material: {post.material}</li>}
            {post.size && <li>Size: {post.size}</li>}
            {post.textAndLanguage && <li>Text & Language: {post.textAndLanguage}</li>}
            {post.color && <li>Color: {post.color}</li>}
            {post.shape && <li>Shape: {post.shape}</li>}
            {post.weight && <li>Weight: {post.weight}</li>}
            {post.descriptionOfParts && <li>Description of Parts: {post.descriptionOfParts}</li>}
            {post.location && <li>Location: {post.location}</li>}
            {post.timePeriod && <li>Time Period: {post.timePeriod}</li>}
            {post.smell && <li>Smell: {post.smell}</li>}
            {post.taste && <li>Taste: {post.taste}</li>}
            {post.texture && <li>Texture: {post.texture}</li>}
            {post.hardness && <li>Hardness: {post.hardness}</li>}
            {post.pattern && <li>Pattern: {post.pattern}</li>}
            {post.brand && <li>Brand: {post.brand}</li>}
            {post.print && <li>Print: {post.print}</li>}
            {post.icons && <li>Icons: {post.icons}</li>}
            {post.handmade && <li>Handmade: {post.handmade ? 'Yes' : 'No'}</li>}
            {post.functionality && <li>Functionality: {post.functionality}</li>}
          </ul>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-teal-600 text-white px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center mt-6">
          <button
            onClick={handleUpvote}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md mr-4"
          >
            Upvote
          </button>
          <button
            onClick={handleDownvote}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Downvote
          </button>
          <span className="ml-4 text-teal-300 font-bold text-xl">{post.votes} votes</span>
        </div>

        {post.comments && post.comments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Comments</h3>
            {post.comments.map((comment, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-md mb-4">
                <p className="text-gray-300">{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
