"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await axiosInstance.get('/users/me');
          console.log('User data fetched:', response.data);
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Error restoring session:', error.response || error);
          localStorage.removeItem("token");
          delete axiosInstance.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout, setUser, setToken, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
