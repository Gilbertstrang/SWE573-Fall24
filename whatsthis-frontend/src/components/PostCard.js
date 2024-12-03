import React, { useEffect, useState } from "react";
import Link from "next/link";

const PostCard = ({ post }) => {
  const [username, setUsername] = useState(post.username || "Unknown");
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    // Fetch the username if not already included in the post data
    if (!post.username) {
      fetch(`http://localhost:8080/api/users/${post.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.username) {
            setUsername(data.username);
          }
        })
        .catch((error) => console.error("Failed to fetch username:", error));
    }

    // Fetch comment count for the post
    fetch(`http://localhost:8080/api/comments/posts/${post.id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        const count = data._embedded?.commentDtoes?.length || 0;
        setCommentCount(count);
      })
      .catch((error) => console.error("Failed to fetch comment count:", error));
  }, [post.username, post.userId, post.id]);

  return (
    <Link href={`/posts/${post.id}`} passHref>
      <div
        className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 w-[600px] h-[400px] flex flex-row"
      >
        {/* Image Section */}
        <div className="w-1/2 h-full bg-gray-700">
          {post.imageUrls && post.imageUrls.length > 0 ? (
            <img
              src={`http://localhost:8080/${post.imageUrls[0].split("/").pop()}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 w-1/2 flex flex-col justify-between">
          {/* Title */}
          <h2 className="text-2xl font-bold truncate">{post.title}</h2>

          {/* Description */}
          <p className="text-gray-300 text-md mt-2 line-clamp-5">
            {post.description}
          </p>

          {/* Username */}
          <p className="text-teal-400 text-md mt-4">
            Posted by: <span className="font-medium">{username}</span>
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-teal-600 text-white text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="bg-gray-600 text-white text-sm px-3 py-1 rounded-full">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Votes and Comments */}
          <div className="flex justify-between items-center mt-6">
            <span className="text-teal-400 font-bold text-lg">
              {post.votes} {post.votes === 1 ? "Vote" : "Votes"}
            </span>
            <span className="text-gray-400 font-bold text-lg">
              {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
