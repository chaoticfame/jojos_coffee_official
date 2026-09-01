import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jojo_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('jojo_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          localStorage.setItem('jojo_user', JSON.stringify(res.user));
        } catch (err) {
          console.error('Session expired:', err);
          logout();
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (username, password, requiredRole = null) => {
    const res = await api.login(username, password, requiredRole);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('jojo_user', JSON.stringify(res.user));
    localStorage.setItem('jojo_token', res.token);
    return res.user;
  };

  const register = async (username, password, email) => {
    const res = await api.register(username, password, email);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('jojo_user', JSON.stringify(res.user));
    localStorage.setItem('jojo_token', res.token);
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jojo_user');
    localStorage.removeItem('jojo_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
