import React from "react";
import Link from "next/link";

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden">
      <div>
        {post.imageUrls && post.imageUrls.length > 0 ? (
          <img
            src={`http://localhost:8080/${post.imageUrls[0].split('/').pop()}`}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="bg-gray-700 w-full h-48 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold truncate">{post.title}</h2>
        <p className="text-gray-400 text-sm mt-2 truncate">{post.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-teal-400 font-bold">{post.votes} Votes</span>
          <Link href={`/posts/${post.id}`}>
            <button className="text-teal-500 hover:text-teal-300">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
