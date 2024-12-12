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
          <div className="text-center mb-12">
            {user && (
              <Link href="create-post">
                <button className="bg-teal-500 text-white px-10 py-5 text-2xl font-semibold rounded-lg hover:bg-teal-600 transition shadow-lg">
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
    </div>
  );
}
