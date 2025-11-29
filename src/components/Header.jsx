import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="logo">
        <Link to="/">Virtual Art Gallery</Link>
      </div>
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <span>{mobileMenuOpen ? '✕' : '☰'}</span>
      </button>
      <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</Link>
        <Link to="/artists" onClick={() => setMobileMenuOpen(false)}>Artists</Link>
        <Link to="/exhibitions" onClick={() => setMobileMenuOpen(false)}>Exhibitions</Link>
        <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <span className="user-welcome">
              Welcome, {user.fullName || user.username}
            </span>
            <span className="user-role">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            <Link to="/signup" className="signup-btn" onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;