// src/config/api.js

// Base API URL - Change based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://sont.click';

// API Endpoints
export const API = {
  // ============================================
  // USER ENDPOINTS
  // ============================================
  user: {
    login: `${API_BASE_URL}/api/user/login`,
    register: `${API_BASE_URL}/api/user/register`,
    updateProfile: `${API_BASE_URL}/api/user/me`,
  },

  // ============================================
  // ORDER ENDPOINTS
  // ============================================
  order: {
    create: `${API_BASE_URL}/api/order`,
    getByUserId: (userId) => `${API_BASE_URL}/api/order/user/${userId}`,
    getDetail: (orderId) => `${API_BASE_URL}/api/order/orders/${orderId}`,
    getQR: (orderId) => `${API_BASE_URL}/api/order/qr/${orderId}`,
    confirmPayment: (orderId) => `${API_BASE_URL}/api/order/${orderId}/pay`,
    cancel: (orderId) => `${API_BASE_URL}/api/order/${orderId}/cancel`,
    updateStatus: (orderId) => `${API_BASE_URL}/api/order/${orderId}/status`,
  },

  // ============================================
  // PRODUCT ENDPOINTS (if you have)
  // ============================================
  product: {
    getAll: `${API_BASE_URL}/api/products`,
    getById: (productId) => `${API_BASE_URL}/api/products/${productId}`,
    getByCategory: (categoryId) => `${API_BASE_URL}/api/products/category/${categoryId}`,
    search: (query) => `${API_BASE_URL}/api/products/search?q=${query}`,
  },

  // ============================================
  // CART ENDPOINTS (if you have backend cart)
  // ============================================
  cart: {
    get: (userId) => `${API_BASE_URL}/api/cart/${userId}`,
    addItem: `${API_BASE_URL}/api/cart/items`,
    updateItem: (itemId) => `${API_BASE_URL}/api/cart/items/${itemId}`,
    removeItem: (itemId) => `${API_BASE_URL}/api/cart/items/${itemId}`,
    clear: (userId) => `${API_BASE_URL}/api/cart/${userId}/clear`,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get auth headers with token
export const getAuthHeaders = (token = null) => {
  const userToken = token || getUserToken();
  return {
    'Content-Type': 'application/json',
    ...(userToken && { 'Authorization': `Bearer ${userToken}` })
  };
};

// Get user token from localStorage
export const getUserToken = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
  } catch (error) {
    console.error('Error getting user token:', error);
  }
  return null;
};

// Get user info from localStorage
export const getUserInfo = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
  } catch (error) {
    console.error('Error getting user info:', error);
  }
  return null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getUserToken();
};

// ============================================
// EXPORT
// ============================================
export default API_BASE_URL;