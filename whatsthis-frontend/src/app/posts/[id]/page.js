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
  const [profilePicture, setProfilePicture] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [loginWarning, setLoginWarning] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const fetchedPost = await postService.getPostById(id);
        setPost(fetchedPost);

        const userRes = await fetch(`http://localhost:8080/api/users/${fetchedPost.userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsername(userData.username);
          setProfilePicture(userData.profilePicture || "https://www.gravatar.com/avatar/default?d=mp");
        }

        const fetchedComments = await commentService.getCommentsByPostId(id);
        const commentsWithUserData = await Promise.all(
          fetchedComments.map(async (comment) => {
            try {
              const userRes = await fetch(`http://localhost:8080/api/users/${comment.userId}`);
              const userData = await userRes.json();
              return {
                ...comment,
                commenterUsername: userData.username,
                profilePicture: userData.profilePicture || "https://www.gravatar.com/avatar/default?d=mp"
              };
            } catch (error) {
              console.error(`Error fetching user data for comment ${comment.id}:`, error);
              return {
                ...comment,
                commenterUsername: "Unknown User",
                profilePicture: "https://www.gravatar.com/avatar/default?d=mp"
              };
            }
          })
        );

        const sortedComments = commentsWithUserData.sort((a, b) => {
          if (a.id === fetchedPost.solutionCommentId) return -1;
          if (b.id === fetchedPost.solutionCommentId) return 1;
          return 0;
        });

        setComments(sortedComments);

        
        if (user) {
          const currentUserVote = await postService.getUserVote(id, user.id);
          setUserVote(currentUserVote);
        }

      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, user]);

  const handleVote = async (voteType) => {
    if (!user) {
      setLoginWarning(true);
      setTimeout(() => setLoginWarning(false), 3000);
      return;
    }

    try {
      const updatedPost = await postService.votePost(post.id, user.id, voteType);
      setPost(updatedPost);
      const newUserVote = await postService.getUserVote(post.id, user.id);
      setUserVote(newUserVote);
    } catch (error) {
      console.error(`Error ${voteType}ing post:`, error);
    }
  };

  const handleCommentSubmit = async (parentCommentId = null, text = null) => {
    const commentText = text || newComment;
    
    if (!commentText.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    if (!user) {
      setError("You must be logged in to comment.");
      return;
    }

    const commentData = {
      text: commentText.trim(),
      userId: user.id,
      username: user.username,
      postId: parseInt(post.id),
      parentCommentId: parentCommentId ? parseInt(parentCommentId) : null
    };

    try {
      const comment = await commentService.addComment(commentData);
      setComments(prev => [...prev, {
        ...comment,
        commenterUsername: user.username,
        profilePicture: user.profilePicture || "https://www.gravatar.com/avatar/default?d=mp",
      }]);
      if (parentCommentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
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

  const handleMarkSolution = async (commentId) => {
    if (!user || user.id !== post.userId) {
      return;
    }

    try {
      const endpoint = commentId === post.solutionCommentId
        ? `http://localhost:8080/api/posts/${post.id}/solution/remove`
        : `http://localhost:8080/api/posts/${post.id}/solution/${commentId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPost(updatedPost);
      } else {
        const errorText = await response.text();
        console.error('Error marking solution:', errorText);
      }
    } catch (error) {
      console.error('Error marking solution:', error);
    }
  };

  const renderComment = (comment, level = 0) => {
    const replies = comments.filter(c => c.parentCommentId === comment.id);
    
    return (
      <div key={comment.id} style={{ marginLeft: `${level * 20}px` }}>
        <div 
          className={`bg-gray-700 p-4 rounded-md mb-2 flex flex-col ${
            comment.id === post.solutionCommentId ? 'border-2 border-green-500' : ''
          }`}
        >
          {/* Header with profile picture and username */}
          <div className="flex items-start mb-3">
            <img
              src={comment.profilePicture}
              alt={`${comment.commenterUsername}'s profile`}
              className="w-10 h-10 rounded-full mr-4 object-cover"
            />
            <div className="flex-grow">
              <div className="flex justify-between items-center">
                <Link
                  href={`/profile/${comment.userId}`}
                  className="text-teal-400 font-bold hover:underline"
                >
                  {comment.commenterUsername || comment.username}
                </Link>
                {user && user.id === post.userId && !post.isSolved && (
                  comment.id === post.solutionCommentId ? (
                    <div className="bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      Marked as Solution
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMarkSolution(comment.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Mark as Solution
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Comment text */}
          <p className="text-gray-400 mb-3">{comment.text}</p>

          {/* Footer with solution badge and reply button */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-2 items-center">
              {user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                    />
                  </svg>
                  Reply
                </button>
              )}
            </div>
            {comment.id === post.solutionCommentId && (
              <div className="text-green-500 font-bold">
                ✓ Solution
              </div>
            )}
          </div>
        </div>

        {/* Reply form */}
        {replyingTo === comment.id && (
          <div className="ml-14 mb-4">
            <textarea
              className="w-full p-2 rounded bg-gray-800 text-white mb-2"
              rows="2"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            ></textarea>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleCommentSubmit(comment.id, replyText);
                  setReplyText("");
                }}
                className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Submit Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="ml-10">
            {replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-teal-300 text-center text-xl mt-10">Loading...</div>;
  }

  if (!post) {
    return <div className="text-center mt-10 text-red-500">Post not found.</div>;
  }

  const renderAttributes = () => {
    const excludedKeys = ["id", "userId", "title", "description", "imageUrls", "tags", "votes", "comments", "_links"];
    return Object.keys(post)
      .filter((key) => !excludedKeys.includes(key) && post[key])
      .map((key) => (
        <tr key={key} className="border-b border-gray-700">
          <td className="py-2 px-2 font-bold text-gray-300 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
          <td className="py-2 px-2 text-gray-400">{post[key].toString()}</td>
        </tr>
      ));
  };

  const formatVotes = (votes) => {
    if (votes === 0) return "0";
    return votes > 0 ? `+${votes}` : `${votes}`;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Profile Picture and Username */}
        <div className="flex items-center mb-4">
          <img
            src={profilePicture}
            alt={`${username}'s profile`}
            className="w-14 h-14 rounded-full mr-3 object-cover"
          />
          <Link href={`/profile/${post.userId}`} className="text-teal-400 text-lg font-bold hover:underline">
            {username || "Unknown User"}
          </Link>
        </div>

        {/* Updated title section */}
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          {post.isSolved && (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Solved
            </span>
          )}
        </div>

        {/* Main Content */}
        <div className="flex flex-wrap lg:flex-nowrap gap-6">
          <div className="w-full lg:w-2/3">
            <p className="mb-6 text-gray-300">{post.description}</p>
            {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Images</h3>
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

          <div className="w-full lg:w-1/3">
            {/* Tab Selection */}
            <div className="flex mb-4">
              <button
                className={`px-4 py-2 rounded-t-lg ${
                  activeTab === "details"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("details")}
              >
                General
              </button>
              <button
                className={`px-4 py-2 rounded-t-lg ${
                  activeTab === "parts"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
                onClick={() => setActiveTab("parts")}
              >
                Parts
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "details" ? (
              <>
                <h3 className="text-xl font-bold mb-4">Details</h3>
                <table className="w-full text-left border-collapse border border-gray-700">
                  <tbody>{renderAttributes()}</tbody>
                </table>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">Parts</h3>
                {post.parts && post.parts.length > 0 ? (
                  post.parts.map((part, index) => (
                    <div key={index} className="mb-6 bg-gray-700 p-4 rounded-lg">
                      <h4 className="text-lg font-bold text-teal-400 mb-2">
                        {part.partName || `Part ${index + 1}`}
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(part)
                          .filter(([key, value]) => 
                            value !== null && 
                            value !== undefined && 
                            value !== '' && 
                            key !== 'partName'
                          )
                          .map(([key, value]) => (
                            <div key={key} className="border-b border-gray-600 py-2">
                              <span className="font-semibold text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span className="ml-2 text-gray-400">
                                {typeof value === 'boolean' 
                                  ? (value ? 'Yes' : 'No') 
                                  : value}
                              </span>
                            </div>
                          ))}
                      </div>
                      {index < post.parts.length - 1 && (
                        <div className="border-b border-gray-600 mt-4"></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-4 px-2 text-gray-400 text-center bg-gray-700 rounded-lg">
                    No parts information available
                  </div>
                )}
              </>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-2">Tags</h3>
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

        {/* Votes */}
        <div className="mt-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleVote("upvote")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                userVote === "upvote"
                  ? "bg-teal-600 text-white" 
                  : "bg-gray-700 hover:bg-teal-500 text-teal-400 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            <div className="min-w-[50px] text-center">
              <span className={`text-xl font-bold ${
                post.votes > 0 ? 'text-teal-400' : 
                post.votes < 0 ? 'text-red-400' : 
                'text-gray-400'
              }`}>
                {formatVotes(post.votes)}
              </span>
            </div>

            <button
              onClick={() => handleVote("downvote")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                userVote === "downvote"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700 hover:bg-red-500 text-red-400 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Login Warning */}
        {loginWarning && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in">
            Please log in to vote
            <Link href="/login" className="ml-2 underline">
              Login here
            </Link>
          </div>
        )}

        {/* Updated comments section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Comments</h3>
          {comments && comments.length > 0 ? (
            comments.filter(comment => !comment.parentCommentId).map(comment => renderComment(comment))
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
                onClick={() => handleCommentSubmit()}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md"
              >
                Submit Comment
              </button>
            </div>
          )}
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

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}