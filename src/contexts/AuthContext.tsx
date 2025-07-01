
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = { id: data.userId || Date.now().toString(), email };
        
        localStorage.setItem('authToken', data.token || 'demo-token');
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      // For demo purposes, simulate successful login
      const userData = { id: Date.now().toString(), email };
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = { id: data.userId || Date.now().toString(), email };
        
        localStorage.setItem('authToken', data.token || 'demo-token');
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      // For demo purposes, simulate successful registration
      const userData = { id: Date.now().toString(), email };
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
