// src/contexts/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getUser, clearAuth, setupAuthListener, initializeAuth } from '../utils/authUtils';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Setup auto-logout listener
  useEffect(() => {
    const cleanup = setupAuthListener(() => {
      toast.warning('Session expired. Please login again.');
      setUser(null);
      // Redirect will be handled by ProtectedRoute
    });

    return cleanup;
  }, []);

  // Listen for auth changes (login/logout from other tabs)
  useEffect(() => {
    const handleAuthChange = () => {
      const currentUser = getUser();
      setUser(currentUser);
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // Listen for storage changes (logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user' && !e.newValue) {
        // User was removed from localStorage
        setUser(null);
        toast.info('You have been logged out.');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    clearAuth();
    setUser(null);
    toast.success('Logged out successfully!');
    window.location.href = '/login'; // Hard redirect
  };

  const value = {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}