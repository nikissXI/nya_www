"use client"

import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  toggleLogin: (loggedIn: boolean) => void;
  wgnum: number;
  setWgnum: (wgnum: number) => void;
}

// 默认值
const defaultContextValue: AuthContextType = {
  isLoggedIn: true,
  toggleLogin: () => {}, // 默认的空函数
  wgnum: 0,
  setWgnum: () => {}, // 默认的空函数
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const toggleLogin = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  const [wgnum, setNewWgnum] = useState<number>(0);

  const setWgnum = (wgnum: number) => {
    setNewWgnum(wgnum);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, toggleLogin, wgnum, setWgnum }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
