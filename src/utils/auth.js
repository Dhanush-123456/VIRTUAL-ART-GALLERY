// Authentication utility functions

export const initializeDemoUsers = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Only initialize if no users exist
  if (users.length === 0) {
    const demoUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        fullName: 'Admin User',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'artist',
        email: 'artist@example.com',
        password: 'artist123',
        role: 'artist',
        fullName: 'Artist User',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'curator',
        email: 'curator@example.com',
        password: 'curator123',
        role: 'curator',
        fullName: 'Curator User',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        username: 'visitor',
        email: 'visitor@example.com',
        password: 'visitor123',
        role: 'visitor',
        fullName: 'Visitor User',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('users', JSON.stringify(demoUsers));
    return demoUsers;
  }
  
  return users;
};

export const getUserFromStorage = () => {
  try {
    const sessionUser = sessionStorage.getItem('currentUser');
    if (sessionUser) {
      return JSON.parse(sessionUser);
    }
    
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      return JSON.parse(rememberedUser);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user from storage:', error);
    return null;
  }
};

export const saveUserToStorage = (user, rememberMe = false) => {
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    fullName: user.fullName
  };
  
  sessionStorage.setItem('currentUser', JSON.stringify(userData));
  
  if (rememberMe) {
    localStorage.setItem('rememberedUser', JSON.stringify(userData));
  } else {
    localStorage.removeItem('rememberedUser');
  }
  
  return userData;
};

export const clearUserFromStorage = () => {
  sessionStorage.removeItem('currentUser');
  localStorage.removeItem('rememberedUser');
};

export const authenticateUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(
    u => (u.username === username || u.email === username) && u.password === password
  );
  
  if (user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };
  }
  
  return null;
};

export const createUser = (userData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if username or email already exists
  if (users.find(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  
  if (users.find(u => u.email === userData.email)) {
    throw new Error('Email already registered');
  }
  
  const newUser = {
    id: Date.now(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    fullName: newUser.fullName
  };
};

