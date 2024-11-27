"use client";

import '../styles/globals.css';
import { UserProvider } from '../context/UserContext';
import { useState } from "react";
import NavigationBar from '../components/NavigationBar';
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal"; 

export default function Layout({ children }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);

  const openLoginModal = () => setLoginOpen(true);
  const closeLoginModal = () => setLoginOpen(false);

  const openSignupModal = () => setSignupOpen(true);
  const closeSignupModal = () => setSignupOpen(false);

  return (
    <html lang="en">
      <head>
        <title>What's This?</title>
        <meta name="description" content="A platform for sharing and discovering interesting artifacts" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        <UserProvider>
          <NavigationBar onOpenLogin={openLoginModal} onOpenSignup={openSignupModal} />

          {/* Render Login Modal if open */}
          {isLoginOpen && <LoginModal onClose={closeLoginModal} />}

          {/* Render Signup Modal if open */}
          {isSignupOpen && <SignupModal onClose={closeSignupModal} />}

          {/* Render the rest of the content */}
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
