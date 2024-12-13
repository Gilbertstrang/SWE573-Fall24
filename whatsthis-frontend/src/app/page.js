"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import postService from "../services/postService";
import PostCard from "../components/PostCard";
import { useUser } from "../context/UserContext";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [sortBy, setSortBy] = useState("newest");

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const searchResults = await postService.searchPosts(searchParams);
      setPosts(searchResults._embedded?.postDtoes || searchResults);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSortedPosts = () => {
    if (!posts) return [];
    
    switch (sortBy) {
      case "solved":
        return [...posts].filter(post => post.solved);
      case "unsolved":
        return [...posts].filter(post => !post.solved);
      case "mostVoted":
        return [...posts].sort((a, b) => b.votes - a.votes);
      case "newest":
        return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return posts;
    }
  };

  useEffect(() => {
    window._handleSearch = handleSearch;

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

    return () => {
      delete window._handleSearch;
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => setSortBy("newest")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === "newest"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("mostVoted")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === "mostVoted"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Most Voted
              </button>
              <button
                onClick={() => setSortBy("solved")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === "solved"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Solved
              </button>
              <button
                onClick={() => setSortBy("unsolved")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  sortBy === "unsolved"
                    ? "bg-teal-500 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Unsolved
              </button>
            </div>

            {user && (
              <Link href="create-post">
                <button className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition shadow-lg">
                  New Mystery
                </button>
              </Link>
            )}
          </div>

          {loading ? (
            <div className="text-center">
              <div className="text-teal-300 text-xl">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
              {getSortedPosts().map((post) => (
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
    </div>
  );
}
