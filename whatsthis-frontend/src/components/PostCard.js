import React, { useEffect, useState } from "react";
import Link from "next/link";

const PostCard = ({ post }) => {
  const [username, setUsername] = useState(post.username || "Unknown");
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
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
      <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 w-full h-[500px] flex flex-col">
        {/* Image Section */}
        <div className="h-[200px] bg-gray-700 flex-shrink-0">
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
        <div className="p-4 flex flex-col flex-grow overflow-hidden">
          {/* Title */}
          <h2 className="text-lg font-bold truncate">{post.title}</h2>

          {/* Description */}
          <p className="text-gray-300 text-sm mt-2 overflow-auto h-[60px]">
            {post.description}
          </p>

          {/* Username */}
          <p className="text-teal-400 text-sm mt-2 truncate">
            <Link href={`/profile/${post.userId}`}>
              <span className="hover:underline">{username}</span>
            </Link>
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Votes and Comments */}
          <div className="flex justify-between items-center mt-auto">
            <span className="text-teal-400 font-bold text-sm">
              {post.votes} {post.votes === 1 ? "Vote" : "Votes"}
            </span>
            <span className="text-gray-400 font-bold text-sm">
              {commentCount} {commentCount === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
