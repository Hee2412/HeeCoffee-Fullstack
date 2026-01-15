const TOKEN_LIFETIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_STORAGE_KEY = 'auth_session';
const LOCAL_STORAGE_KEY = 'user';

/**
 * Generate unique session ID for tracking browser sessions
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get current active session ID from sessionStorage
 */
const getActiveSession = () => {
  return sessionStorage.getItem(SESSION_STORAGE_KEY);
};

/**
 * Set active session in sessionStorage
 */
const setActiveSession = () => {
  const sessionId = generateSessionId();
  sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (loginTime) => {
  if (!loginTime) return true;
  const currentTime = Date.now();
  const elapsedTime = currentTime - loginTime;
  return elapsedTime > TOKEN_LIFETIME;
};

/**
 * Get user data with token validation
 */
export const getUser = () => {
  try {
    const userStr = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    
    // Check if token exists
    if (!user.token) {
      clearAuth();
      return null;
    }

    // Check if session is still active (browser not closed)
    const activeSession = getActiveSession();
    if (!activeSession) {
      clearAuth();
      return null;
    }

    // Check if token is expired
    if (user.loginTime && isTokenExpired(user.loginTime)) {
      clearAuth();
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    clearAuth();
    return null;
  }
};

/**
 * Save user data with login timestamp
 */
export const saveUser = (userData, token) => {
  const userWithTimestamp = {
    ...userData,
    token,
    loginTime: Date.now(),
  };
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userWithTimestamp));
  setActiveSession(); // Create new session for this tab/browser
  window.dispatchEvent(new Event('authChange'));
  
  return userWithTimestamp;
};

/**
 * Clear all auth data
 */
export const clearAuth = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event('authChange'));
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const user = getUser();
  return user !== null && user.token !== undefined;
};

/**
 * Check if user is admin
 */
export const isAdmin = () => {
  const user = getUser();
  return user !== null && user.role === 'ADMIN';
};

/**
 * Get remaining token lifetime in milliseconds
 */
export const getTokenRemainingTime = () => {
  const user = getUser();
  if (!user || !user.loginTime) return 0;
  
  const elapsed = Date.now() - user.loginTime;
  const remaining = TOKEN_LIFETIME - elapsed;
  return remaining > 0 ? remaining : 0;
};

/**
 * Format remaining time for display
 */
export const formatRemainingTime = () => {
  const remaining = getTokenRemainingTime();
  if (remaining === 0) return 'Expired';
  
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
  
  return `${hours}h ${minutes}m`;
};

/**
 * Validate token with backend (optional - if you have a validation endpoint)
 */
export const validateToken = async (token) => {
  try {
    // Replace with your actual validation endpoint
    const response = await fetch('http://localhost:8080/api/user/validate-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

/**
 * Setup auth listener for auto-logout
 */
export const setupAuthListener = (onLogout) => {
  // Check token expiration every minute
  const intervalId = setInterval(() => {
    const user = getUser();
    if (!user) {
      clearInterval(intervalId);
      if (onLogout) onLogout();
    }
  }, 60000); // Check every 1 minute

  return () => clearInterval(intervalId);
};

/**
 * Initialize auth system - call this on app load
 */
export const initializeAuth = () => {
  // Check if there's a session on page load
  const activeSession = getActiveSession();
  
  if (!activeSession) {
    // No active session means browser was closed/tab was closed
    // Check if user data exists
    const user = getUser();
    if (user) {
      // Clear the auth if no session
      clearAuth();
    }
  } else {
    // Session exists, validate token expiration
    const user = getUser();
    if (user && user.loginTime && isTokenExpired(user.loginTime)) {
      clearAuth();
    }
  }
};