'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AuthUser = {
  email: string;
  roles: string[];
  type: string;
  expiresIn: number;
  token: string;
};

type AuthResponse = {
  token: string;
  type: string;
  expiresIn: number;
  email: string;
  roles: string[];
};

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  setAuth: (authResponse: AuthResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const setAuth = (authResponse: AuthResponse) => {
    const { token, type, expiresIn, email, roles } = authResponse;
    setUser({ email, roles, type, expiresIn, token });
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};