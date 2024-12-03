"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import postService from "../../../services/postService";
import commentService from "../../../services/commentService";
import { useUser } from "../../../context/UserContext";
import Link from "next/link";

export default function DetailedPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const { user } = useUser();

  const [post, setPost] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const fetchedPost = await postService.getPostById(id);
        setPost(fetchedPost);

        const userRes = await fetch(`http://localhost:8080/api/users/${fetchedPost.userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsername(userData.username);
        } else {
          console.error("Failed to fetch username");
        }

        const fetchedComments = await commentService.getCommentsByPostId(id);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleUpvote = async () => {
    if (user) {
      try {
        await postService.upvotePost(post.id);
        setPost({ ...post, votes: post.votes + 1 });
      } catch (error) {
        console.error("Error upvoting post:", error);
      }
    } else {
      router.push("/login");
    }
  };

  const handleDownvote = async () => {
    if (user) {
      try {
        await postService.downvotePost(post.id);
        setPost({ ...post, votes: post.votes - 1 });
      } catch (error) {
        console.error("Error downvoting post:", error);
      }
    } else {
      router.push("/login");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (!user) {
      setError("You must be logged in to comment.");
      return;
    }

    const commentData = {
      text: newComment,
      userId: user.id,
      postId: post.id,
      username: user.username,
      votes: 0,
    };

    try {
      const comment = await commentService.addComment(commentData);
      setComments((prev) => [...prev, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError("Failed to submit comment. Please try again.");
    }
  };

  const handleImageClick = (imageUrl) => {
    setFullscreenImage(imageUrl); 
  };

  const closeFullscreenImage = () => {
    setFullscreenImage(null); 
  };

  if (isLoading) {
    return <div className="text-teal-300 text-center text-xl mt-10">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center mt-10 text-red-500">Post not found.</div>;
  }

  const renderAttributes = () => {
    const excludedKeys = ["id", "userId", "title", "description", "imageUrls", "tags", "votes"];
    return Object.keys(post)
      .filter((key) => !excludedKeys.includes(key) && post[key])
      .map((key) => (
        <tr key={key} className="border-b border-gray-700">
          <td className="py-2 px-4 font-bold capitalize text-gray-300">
            {key.replace(/([A-Z])/g, " $1")}
          </td>
          <td className="py-2 px-4 text-gray-400">{post[key].toString()}</td>
        </tr>
      ));
  };

  return (
    <div className="container mx-auto p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-5xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Title and Username */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <p className="text-gray-400">
            Posted by:{" "}
            <Link href={`/profile/${post.userId}`} className="text-teal-400 hover:underline">
              {username || "Unknown"}
            </Link>
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          {/* Left Column: Description and Images */}
          <div className="w-full lg:w-2/3">
            <p className="mb-6 text-gray-300">{post.description}</p>
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Images</h3>
                <div className="grid grid-cols-2 gap-4">
                  {post.imageUrls.map((url, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8080/${url.split("/").pop()}`}
                      alt={`Post Image ${index + 1}`}
                      className="w-full h-auto rounded-lg cursor-pointer"
                      onClick={() => handleImageClick(`http://localhost:8080/${url.split("/").pop()}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Attributes Table */}
          <div className="w-full lg:w-1/3">
            <h3 className="text-2xl font-bold mb-4">Details</h3>
            <table className="w-full text-left border-collapse border border-gray-700">
              <tbody>{renderAttributes()}</tbody>
            </table>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-6">
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
          </div>
        </div>

        {/* Bottom Section: Votes and Comments */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            {/* Votes */}
            <div>
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
          </div>

          {/* Comments */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Comments</h3>
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-md mb-4">
                  <p>
                    <strong>{comment.username || `User ${comment.userId}`}</strong>: {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments yet. Be the first to comment!</p>
            )}

            {user && (
              <div className="mt-6">
                <textarea
                  className="w-full p-2 rounded bg-gray-800 text-white mb-4"
                  rows="4"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment..."
                ></textarea>
                <button
                  onClick={handleCommentSubmit}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
                >
                  Submit Comment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeFullscreenImage}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>
      )}
    </div>
  );
}
