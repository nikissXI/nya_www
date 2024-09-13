"use client";
import { useDisclosure } from "@chakra-ui/react";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  toggleLogin: (loggedIn: boolean) => void;
  wgnum: number;
  setWgnum: (wgnum: number) => void;
  isLanding: boolean;
  toggleLanding: (loggedIn: boolean) => void;
  glIsOpen: boolean;
  glOnOpen: () => void;
  glOnClose: () => void;
}

// 默认值
const defaultContextValue: AuthContextType = {
  isLoggedIn: true,
  toggleLogin: () => {}, // 默认的空函数
  wgnum: 0,
  setWgnum: () => {}, // 默认的空函数
  isLanding: true,
  toggleLanding: () => {}, // 默认的空函数
  glIsOpen: false,
  glOnOpen: () => {},
  glOnClose: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  const toggleLogin = (loggedIn: boolean) => {
    setIsLoggedIn(loggedIn);
  };

  const [isLanding, setIsLanding] = useState<boolean>(true);

  const toggleLanding = (loggedIn: boolean) => {
    setIsLanding(loggedIn);
  };

  const [wgnum, setNewWgnum] = useState<number>(0);

  const setWgnum = (wgnum: number) => {
    setNewWgnum(wgnum);
  };

  const {
    isOpen: glIsOpen,
    onOpen: glOnOpen,
    onClose: glOnClose,
  } = useDisclosure();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        toggleLogin,
        wgnum,
        setWgnum,
        isLanding,
        toggleLanding,
        glIsOpen,
        glOnOpen,
        glOnClose,
      }}
    >
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
