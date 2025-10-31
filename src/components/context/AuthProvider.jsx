/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accesstoken') || null);

  const login = (newToken) => {
    localStorage.setItem('accesstoken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('accesstoken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
