// API Service - Simulates backend API calls
// This is a mock API service for demonstration purposes

const API_BASE_URL = 'https://api.virtualartgallery.com/v1';
const API_DELAY = 800; // Simulate network delay in milliseconds

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  try {
    // Simulate network delay
    await delay(API_DELAY);

    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // In a real application, this would be an actual fetch call
    // For demo purposes, we'll simulate the API response
    const response = await simulateApiCall(endpoint, config);
    
    if (!response.ok) {
      throw new Error(response.error || 'API request failed');
    }

    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Simulate API call (replace with actual fetch in production)
const simulateApiCall = async (endpoint, config) => {
  // Simulate different API endpoints
  const method = config.method || 'GET';
  const body = config.body ? JSON.parse(config.body) : null;

  // Authentication endpoints
  if (endpoint === '/auth/login' && method === 'POST') {
    return await handleLogin(body);
  }

  if (endpoint === '/auth/signup' && method === 'POST') {
    return await handleSignup(body);
  }

  if (endpoint === '/auth/logout' && method === 'POST') {
    return { ok: true, data: { message: 'Logged out successfully' } };
  }

  // Artworks endpoints
  if (endpoint === '/artworks' && method === 'GET') {
    return await handleGetArtworks();
  }

  if (endpoint.startsWith('/artworks/') && method === 'GET') {
    const id = endpoint.split('/')[2];
    return await handleGetArtwork(id);
  }

  // Cart endpoints
  if (endpoint === '/cart' && method === 'GET') {
    return await handleGetCart();
  }

  if (endpoint === '/cart/add' && method === 'POST') {
    return await handleAddToCart(body);
  }

  if (endpoint === '/cart/remove' && method === 'DELETE') {
    return await handleRemoveFromCart(body);
  }

  // Payment endpoints
  if (endpoint === '/payments/process' && method === 'POST') {
    return await handleProcessPayment(body);
  }

  // Notifications endpoints
  if (endpoint === '/notifications/subscribe' && method === 'POST') {
    return await handleSubscribeNotification(body);
  }

  if (endpoint === '/notifications' && method === 'GET') {
    return await handleGetNotifications();
  }

  // User endpoints
  if (endpoint === '/user/profile' && method === 'GET') {
    return await handleGetUserProfile();
  }

  if (endpoint === '/user/stats' && method === 'GET') {
    return await handleGetUserStats();
  }

  // Default error
  return { ok: false, error: 'Endpoint not found' };
};

// Authentication handlers
const handleLogin = async (credentials) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const { username, password } = credentials;

  // Check admin credentials
  if (username === 'admin' && password === 'admin123') {
    return {
      ok: true,
      data: {
        user: {
          id: 0,
          username: 'admin',
          email: 'admin@gallery.com',
          role: 'admin',
          fullName: 'Administrator'
        },
        token: 'mock_admin_token_' + Date.now()
      }
    };
  }

  // Check regular users
  const user = users.find(
    u => (u.username === username || u.email === username) && u.password === password
  );

  if (!user) {
    return {
      ok: false,
      error: 'Invalid username/email or password'
    };
  }

  return {
    ok: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      },
      token: 'mock_token_' + user.id + '_' + Date.now()
    }
  };
};

const handleSignup = async (userData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Check if user already exists
  if (users.find(u => u.username === userData.username)) {
    return {
      ok: false,
      error: 'Username already exists'
    };
  }

  if (users.find(u => u.email === userData.email)) {
    return {
      ok: false,
      error: 'Email already registered'
    };
  }

  const newUser = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  return {
    ok: true,
    data: {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName
      },
      token: 'mock_token_' + newUser.id + '_' + Date.now()
    }
  };
};

// Artworks handlers
const handleGetArtworks = async () => {
  const { artworks } = await import('../data/artworks');
  return {
    ok: true,
    data: {
      artworks,
      total: artworks.length,
      page: 1,
      limit: artworks.length
    }
  };
};

const handleGetArtwork = async (id) => {
  const { artworks } = await import('../data/artworks');
  const artwork = artworks.find(a => a.id === parseInt(id));
  
  if (!artwork) {
    return {
      ok: false,
      error: 'Artwork not found'
    };
  }

  return {
    ok: true,
    data: artwork
  };
};

// Cart handlers
const handleGetCart = async () => {
  const cart = JSON.parse(localStorage.getItem('user_cart') || '[]');
  return {
    ok: true,
    data: {
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.price || 0), 0),
      count: cart.length
    }
  };
};

const handleAddToCart = async (data) => {
  const cart = JSON.parse(localStorage.getItem('user_cart') || '[]');
  cart.push(data.artwork);
  localStorage.setItem('user_cart', JSON.stringify(cart));

  return {
    ok: true,
    data: {
      message: 'Item added to cart',
      cart: {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price || 0), 0),
        count: cart.length
      }
    }
  };
};

const handleRemoveFromCart = async (data) => {
  const cart = JSON.parse(localStorage.getItem('user_cart') || '[]');
  const updatedCart = cart.filter(item => item.id !== data.artworkId);
  localStorage.setItem('user_cart', JSON.stringify(updatedCart));

  return {
    ok: true,
    data: {
      message: 'Item removed from cart',
      cart: {
        items: updatedCart,
        total: updatedCart.reduce((sum, item) => sum + (item.price || 0), 0),
        count: updatedCart.length
      }
    }
  };
};

// Payment handlers
const handleProcessPayment = async (paymentData) => {
  // Simulate payment processing
  const isSuccess = Math.random() > 0.1; // 90% success rate

  if (isSuccess) {
    // Clear cart after successful payment
    localStorage.removeItem('user_cart');

    return {
      ok: true,
      data: {
        transactionId: 'TXN_' + Date.now(),
        status: 'completed',
        amount: paymentData.amount,
        message: 'Payment processed successfully'
      }
    };
  } else {
    return {
      ok: false,
      error: 'Payment processing failed. Please try again.'
    };
  }
};

// Notification handlers
const handleSubscribeNotification = async (data) => {
  const notifications = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
  
  // Check if already subscribed
  const existing = notifications.find(
    n => n.artworkId === data.artworkId && 
    n.email.toLowerCase() === data.email.toLowerCase()
  );

  if (existing) {
    return {
      ok: false,
      error: 'You are already subscribed for notifications on this artwork'
    };
  }

  const notification = {
    id: Date.now(),
    ...data,
    requestedAt: new Date().toISOString(),
    notified: false
  };

  notifications.push(notification);
  localStorage.setItem('stock_notifications', JSON.stringify(notifications));

  return {
    ok: true,
    data: {
      message: 'Notification subscription successful',
      notification
    }
  };
};

const handleGetNotifications = async () => {
  const notifications = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
  return {
    ok: true,
    data: {
      notifications,
      count: notifications.length
    }
  };
};

// User handlers
const handleGetUserProfile = async () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    return {
      ok: false,
      error: 'User not authenticated'
    };
  }

  return {
    ok: true,
    data: currentUser
  };
};

const handleGetUserStats = async () => {
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
  
  if (!currentUser) {
    return {
      ok: false,
      error: 'User not authenticated'
    };
  }

  const viewed = JSON.parse(localStorage.getItem(`viewed_artworks_${currentUser.id}`) || '[]');
  const favorites = JSON.parse(localStorage.getItem(`favorites_${currentUser.id}`) || '[]');
  const purchases = JSON.parse(localStorage.getItem(`purchases_${currentUser.id}`) || '[]');

  return {
    ok: true,
    data: {
      artworksViewed: viewed.length,
      favoritesCount: favorites.length,
      purchasesCount: purchases.length,
      exhibitionsVisited: 0
    }
  };
};

// API Service Methods
export const api = {
  // Authentication
  login: async (credentials) => {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  signup: async (userData) => {
    return await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  logout: async () => {
    return await apiRequest('/auth/logout', {
      method: 'POST'
    });
  },

  // Artworks
  getArtworks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/artworks${queryString ? '?' + queryString : ''}`);
  },

  getArtwork: async (id) => {
    return await apiRequest(`/artworks/${id}`);
  },

  // Cart
  getCart: async () => {
    return await apiRequest('/cart');
  },

  addToCart: async (artwork) => {
    return await apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ artwork })
    });
  },

  removeFromCart: async (artworkId) => {
    return await apiRequest('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ artworkId })
    });
  },

  clearCart: async () => {
    localStorage.removeItem('user_cart');
    return { ok: true, data: { message: 'Cart cleared' } };
  },

  // Payment
  processPayment: async (paymentData) => {
    return await apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  // Notifications
  subscribeNotification: async (notificationData) => {
    return await apiRequest('/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  },

  getNotifications: async () => {
    return await apiRequest('/notifications');
  },

  // User
  getUserProfile: async () => {
    return await apiRequest('/user/profile');
  },

  getUserStats: async () => {
    return await apiRequest('/user/stats');
  }
};

export default api;

