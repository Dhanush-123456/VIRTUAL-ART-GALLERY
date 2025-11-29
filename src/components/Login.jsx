import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('visitor');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      navigateToRole(user.role);
    }
  }, []);

  const navigateToRole = (userRole) => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'artist') {
      navigate('/artist');
    } else if (userRole === 'curator') {
      navigate('/curator');
    } else {
      navigate('/gallery');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Find user by username or email
    const user = users.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      setError('Invalid username/email or password');
      return;
    }

    // Check role if specified
    if (role && user.role !== role) {
      setError(`Please login as ${user.role} or select the correct role`);
      return;
    }

    // Create session user object (without password)
    const sessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };

    // Store in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(sessionUser));

    // Store in localStorage if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem('rememberedUser');
    }

    // Call onLogin callback
    if (onLogin) {
      onLogin(sessionUser);
    }

    // Navigate based on role
    navigateToRole(user.role);
  };

  // Quick login for demo (optional - for testing)
  const handleQuickLogin = (demoRole) => {
    const demoUsers = {
      admin: { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', fullName: 'Admin User' },
      artist: { id: 2, username: 'artist', email: 'artist@example.com', role: 'artist', fullName: 'Artist User' },
      curator: { id: 3, username: 'curator', email: 'curator@example.com', role: 'curator', fullName: 'Curator User' },
      visitor: { id: 4, username: 'visitor', email: 'visitor@example.com', role: 'visitor', fullName: 'Visitor User' }
    };

    const demoUser = demoUsers[demoRole];
    if (demoUser) {
      sessionStorage.setItem('currentUser', JSON.stringify(demoUser));
      if (onLogin) {
        onLogin(demoUser);
      }
      navigateToRole(demoRole);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Welcome back! Please login to continue.
        </p>
        
        {error && (
          <div className="error-alert" style={{ 
            padding: '0.75rem', 
            background: '#fee', 
            color: '#c33', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter username or email"
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label>Login as (Optional)</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Any Role</option>
              <option value="visitor">Visitor</option>
              <option value="artist">Artist</option>
              <option value="curator">Curator</option>
              <option value="admin">Admin</option>
            </select>
            <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.85rem' }}>
              Leave as "Any Role" to auto-detect
            </small>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="rememberMe" style={{ margin: 0, cursor: 'pointer' }}>
              Remember me
            </label>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              Sign up here
            </Link>
          </p>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
            <p style={{ textAlign: 'center', color: '#999', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Quick Demo Login (for testing):
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button 
                type="button"
                onClick={() => handleQuickLogin('admin')}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem',
                  background: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Admin
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('artist')}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem',
                  background: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Artist
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('curator')}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem',
                  background: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Curator
              </button>
              <button 
                type="button"
                onClick={() => handleQuickLogin('visitor')}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.85rem',
                  background: '#667eea', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Visitor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
