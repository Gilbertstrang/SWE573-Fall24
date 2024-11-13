"use client";

import { createContext, useContext, useState } from 'react';

// Create UserContext
const UserContext = createContext();

// Create a Provider for the UserContext
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Default state as not logged in

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
