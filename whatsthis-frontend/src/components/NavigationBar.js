"use client";
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import Link from 'next/link';

function NavigationBar({ onOpenLogin, onOpenSignup, onSearch }) {
  const { user, logout } = useUser();  // useUser should now return a valid context
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Website logo/title */}
          <Link href="/">
            <span className="text-white text-xl font-bold cursor-pointer">
              What's This?
            </span>
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search..."
              className="bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:bg-gray-600 transition duration-150 ease-in-out"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
            >
              Search
            </button>
          </form>
        </div>

       {/* Authentication Links */}
       <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* User Profile Tab */}
              <Link href={`/profile/${user.id}`}>
                <span className="text-white cursor-pointer">
                {user.username || "Profile"}
                </span>
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onOpenLogin}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
              >
                Login
              </button>
              <button
                onClick={onOpenSignup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;