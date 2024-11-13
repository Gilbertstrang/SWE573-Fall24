"use client";

import Link from "next/link";

const PostCard = ({ post }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg transition-transform transform hover:scale-105">
      <h2 className="text-teal-400 text-xl mb-4">
        <Link href={`/posts/${post.id}`}>{post.title}</Link>
      </h2>
      <p className="text-sm text-teal-300 mb-3">Posted by: {post.username}</p>
      <p className="text-white mb-4">
        {post.description.substring(0, 100)}...
      </p>
      <div className="flex justify-between text-gray-400">
        <span>Votes: {post.votes}</span>
        <span>Comments: {post.comments.length}</span>
      </div>
    </div>
  );
};

export default PostCard;
