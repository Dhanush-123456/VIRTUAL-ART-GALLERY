import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Captcha from './Captcha';
import api from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Default admin credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
    id: 0,
    email: 'admin@gallery.com',
    role: 'admin',
    fullName: 'Administrator'
  };

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

  const validateField = (name, value) => {
    const fieldErrors = {};

    if (name === 'username') {
      if (!value.trim()) {
        fieldErrors.username = 'Username or email is required';
      } else if (value.includes('@')) {
        // If it looks like an email, validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          fieldErrors.username = 'Please enter a valid email address';
        }
      } else if (value.trim().length < 3) {
        fieldErrors.username = 'Username must be at least 3 characters';
      }
    }

    if (name === 'password') {
      if (!value || value.trim().length === 0) {
        fieldErrors.password = 'Password is required';
      }
    }

    return fieldErrors;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError[name] || ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear general error
    if (error) {
      setError('');
    }
  };

  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
    if (verified) {
      setCaptchaError('');
    }
  };

  const handleCaptchaError = (errorMsg) => {
    setCaptchaError(errorMsg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCaptchaError('');

    // Validate fields
    const usernameError = validateField('username', username);
    const passwordError = validateField('password', password);
    const newErrors = { ...usernameError, ...passwordError };
    
    setErrors(newErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Check CAPTCHA verification
    if (!isCaptchaVerified) {
      setCaptchaError('Please complete the CAPTCHA verification');
      setError('Please complete the security check before logging in');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // API call for login
      const response = await api.login({
        username,
        password
      });

      const sessionUser = response.user;

      // Store token (in real app, this would be used for authenticated requests)
      if (response.token) {
        sessionStorage.setItem('authToken', response.token);
      }

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
      navigateToRole(sessionUser.role);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setIsCaptchaVerified(false); // Reset CAPTCHA on authentication failure
    } finally {
      setIsLoading(false);
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
              name="username"
              value={username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Enter username or email"
              style={{
                borderColor: errors.username ? '#e74c3c' : username && !errors.username ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
            {!errors.username && username && (
              <small style={{ color: '#4CAF50', fontSize: '0.85rem' }}>✓ Valid format</small>
            )}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Enter password"
              style={{
                borderColor: errors.password ? '#e74c3c' : password && !errors.password ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {!errors.password && password && (
              <small style={{ color: '#4CAF50', fontSize: '0.85rem' }}>✓ Password entered</small>
            )}
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

          <Captcha 
            onVerify={handleCaptchaVerify}
            onError={handleCaptchaError}
          />

          {captchaError && (
            <div style={{
              padding: '0.75rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '5px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              border: '1px solid #e74c3c'
            }}>
              {captchaError}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={!isCaptchaVerified || isLoading}
            style={{
              opacity: (!isCaptchaVerified || isLoading) ? 0.6 : 1,
              cursor: (!isCaptchaVerified || isLoading) ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : (!isCaptchaVerified ? 'Complete CAPTCHA to Login' : 'Login')}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
