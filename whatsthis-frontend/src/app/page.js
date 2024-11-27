"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import postService from "../services/postService";
import PostCard from "../components/PostCard";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postService.getAllPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Link href="create-post">
            <button className="bg-teal-500 text-white px-10 py-5 text-2xl font-semibold rounded-lg hover:bg-teal-600 transition shadow-lg">
              New Mystery
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="text-teal-300 text-xl">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center mt-10">
            <h3 className="text-gray-500 text-lg">No posts found.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
