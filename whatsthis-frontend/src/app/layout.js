"use client";

import '../styles/globals.css';
import { UserProvider } from '../context/UserContext';
import { useState } from "react";
import NavigationBar from '../components/NavigationBar';
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal"; 
import { useSearchParams, useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const router = useRouter();

  const openLoginModal = () => setLoginOpen(true);
  const closeLoginModal = () => setLoginOpen(false);

  const openSignupModal = () => setSignupOpen(true);
  const closeSignupModal = () => setSignupOpen(false);

  const handleSearch = (searchParams) => {
    if (typeof window !== 'undefined' && window._handleSearch) {
      window._handleSearch(searchParams);
    }
  };

  return (
    <html lang="en">
      <head>
        <title>What's This?</title>
        <meta name="description" content="A platform for sharing and discovering interesting artifacts" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        <UserProvider>
          <NavigationBar 
            onOpenLogin={openLoginModal} 
            onOpenSignup={openSignupModal}
            onSearch={handleSearch}
          />
          {isLoginOpen && <LoginModal onClose={closeLoginModal} />}
          {isSignupOpen && <SignupModal onClose={closeSignupModal} />}

          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
