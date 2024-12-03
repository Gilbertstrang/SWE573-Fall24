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

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const fetchedPost = await postService.getPostById(id);
        setPost(fetchedPost);

        const userRes = await fetch(`http://localhost:8080/api/users/${fetchedPost.userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUsername(userData.username);
          setProfilePicture(userData.profilePicture || "/default-avatar.png");
        }

        const fetchedComments = await commentService.getCommentsByPostId(id);
        setComments(
          await Promise.all(
            fetchedComments.map(async (comment) => {
              const commenterRes = await fetch(`http://localhost:8080/api/users/${comment.userId}`);
              const commenter = commenterRes.ok ? await commenterRes.json() : {};
              return {
                ...comment,
                commenterUsername: commenter.username || `User ${comment.userId}`,
                profilePicture: commenter.profilePicture || "/default-avatar.png",
              };
            })
          )
        );

        if (user) {
          const userVote = await postService.getUserVote(id, user.id);
          setUserVote(userVote);
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
      router.push("/login");
      return;
    }

    try {
      if (userVote === voteType) {
        await postService.cancelVote(post.id, user.id);
        setPost({ ...post, votes: post.votes - (voteType === "upvote" ? 1 : -1) });
        setUserVote(null);
      } else {
        if (userVote) {
          await postService.cancelVote(post.id, user.id);
          setPost({
            ...post,
            votes: post.votes - (userVote === "upvote" ? 1 : -1),
          });
        }

        await postService.votePost(post.id, user.id, voteType);
        setPost({
          ...post,
          votes: post.votes + (voteType === "upvote" ? 1 : -1),
        });
        setUserVote(voteType);
      }
    } catch (error) {
      console.error(`Error ${voteType}ing post:`, error);
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
      setComments((prev) => [
        ...prev,
        {
          ...comment,
          commenterUsername: user.username,
          profilePicture: user.profilePicture || "/default-avatar.png",
        },
      ]);
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

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

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
            <h3 className="text-xl font-bold mb-4">Details</h3>
            <table className="w-full text-left border-collapse border border-gray-700">
              <tbody>{renderAttributes()}</tbody>
            </table>

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
          <div className="flex items-center">
            <button
              onClick={() => handleVote("upvote")}
              className={`px-4 py-2 rounded-md mr-4 ${
                userVote === "upvote" ? "bg-teal-600" : "bg-teal-500 hover:bg-teal-600"
              } text-white`}
            >
              {userVote === "upvote" ? "Upvoted" : "Upvote"}
            </button>
            <button
              onClick={() => handleVote("downvote")}
              className={`px-4 py-2 rounded-md ${
                userVote === "downvote" ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
              } text-white`}
            >
              {userVote === "downvote" ? "Downvoted" : "Downvote"}
            </button>
            <span className="ml-4 text-teal-300 font-bold text-lg">{post.votes} votes</span>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Comments</h3>
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-md mb-4 flex items-start">
                <img
                  src={comment.profilePicture}
                  alt={`${comment.commenterUsername}'s profile`}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                />
                <div>
                  <Link
                    href={`/profile/${comment.userId}`}
                    className="text-teal-400 font-bold hover:underline"
                  >
                    {comment.commenterUsername}
                  </Link>
                  <p className="text-gray-400">{comment.text}</p>
                </div>
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
