import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Admin from './components/Admin';
import Artist from './components/Artist';
import Curator from './components/Curator';
import Visitor from './components/Visitor';
import Artists from './components/Artists';
import Exhibitions from './components/Exhibitions';
import About from './components/About';
import { initializeDemoUsers, getUserFromStorage } from './utils/auth';

const App = () => {
  const [user, setUser] = useState(null);

  // Initialize demo users and check for existing user on mount
  useEffect(() => {
    // Initialize demo users if none exist
    initializeDemoUsers();
    
    // Check for user in storage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'currentUser') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (err) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('rememberedUser');
  };

  return (
    <div className="app">
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
          <Route path="/admin" element={<Admin user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="/artist" element={<Artist user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="/curator" element={<Curator user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="/gallery" element={<Visitor user={user} onLogin={handleLogin} onLogout={handleLogout} />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/exhibitions" element={<Exhibitions />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;