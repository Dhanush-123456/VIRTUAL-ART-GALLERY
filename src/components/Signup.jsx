import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = ({ onSignup }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'visitor',
    fullName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time validation for certain fields
    if (name === 'confirmPassword' && formData.password) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError[name] || ''
      }));
    } else if (name !== 'confirmPassword') {
      // Clear error when user starts typing, but validate on blur
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError[name] || ''
    }));
  };

  const validateField = (name, value) => {
    const fieldErrors = {};

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          fieldErrors.fullName = 'Full name is required';
        } else if (value.trim().length < 2) {
          fieldErrors.fullName = 'Full name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          fieldErrors.fullName = 'Full name can only contain letters, spaces, hyphens, and apostrophes';
        } else if (value.trim().split(/\s+/).length < 2) {
          fieldErrors.fullName = 'Please enter your first and last name';
        } else if (value.trim().length > 50) {
          fieldErrors.fullName = 'Full name must be less than 50 characters';
        }
        break;

      case 'username':
        if (!value.trim()) {
          fieldErrors.username = 'Username is required';
        } else if (value.trim().length < 3) {
          fieldErrors.username = 'Username must be at least 3 characters';
        } else if (value.trim().length > 20) {
          fieldErrors.username = 'Username must be less than 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          fieldErrors.username = 'Username can only contain letters, numbers, and underscores';
        } else if (/^[0-9]/.test(value.trim())) {
          fieldErrors.username = 'Username cannot start with a number';
        }
        break;

      case 'email':
        if (!value.trim()) {
          fieldErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          fieldErrors.email = 'Please enter a valid email address';
        } else if (value.trim().length > 100) {
          fieldErrors.email = 'Email must be less than 100 characters';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
          fieldErrors.email = 'Email format is invalid';
        }
        break;

      case 'password':
        if (!value) {
          fieldErrors.password = 'Password is required';
        } else if (value.length < 6) {
          fieldErrors.password = 'Password must be at least 6 characters';
        } else if (value.length > 50) {
          fieldErrors.password = 'Password must be less than 50 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          fieldErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          fieldErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[0-9])/.test(value)) {
          fieldErrors.password = 'Password must contain at least one number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          fieldErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          fieldErrors.confirmPassword = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return fieldErrors;
  };

  const validate = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'role') {
        const fieldError = validateField(key, formData[key]);
        if (fieldError[key]) {
          newErrors[key] = fieldError[key];
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // API call for signup
      const response = await api.signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        fullName: formData.fullName
      });

      const userForSession = response.user;

      // Store token (in real app, this would be used for authenticated requests)
      if (response.token) {
        sessionStorage.setItem('authToken', response.token);
      }
    
      sessionStorage.setItem('currentUser', JSON.stringify(userForSession));
      
      if (onSignup) {
        onSignup(userForSession);
      }

      // Navigate based on role
      if (formData.role === 'artist') {
        navigate('/artist');
      } else if (formData.role === 'curator') {
        navigate('/curator');
      } else {
        navigate('/gallery');
      }
    } catch (err) {
      // Handle API errors
      if (err.message.includes('Username')) {
        setErrors({ username: err.message });
      } else if (err.message.includes('Email')) {
        setErrors({ email: err.message });
      } else {
        setErrors({ general: err.message || 'Signup failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Create Account</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Join our virtual art gallery community
        </p>
        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div style={{
              padding: '0.75rem',
              background: '#fee',
              border: '1px solid #e74c3c',
              borderRadius: '5px',
              color: '#e74c3c',
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {errors.general}
            </div>
          )}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="John Doe"
              style={{
                borderColor: errors.fullName ? '#e74c3c' : formData.fullName ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            {!errors.fullName && formData.fullName && (
              <small style={{ color: '#4CAF50', fontSize: '0.85rem' }}>✓ Valid name</small>
            )}
          </div>

          <div className="form-group">
            <label>Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="johndoe"
              style={{
                borderColor: errors.username ? '#e74c3c' : formData.username && !errors.username ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
            {!errors.username && formData.username && formData.username.length >= 3 && (
              <small style={{ color: '#4CAF50', fontSize: '0.85rem' }}>✓ Username available</small>
            )}
            {!errors.username && formData.username && (
              <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                3-20 characters, letters, numbers, and underscores only
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="john@example.com"
              style={{
                borderColor: errors.email ? '#e74c3c' : formData.email && !errors.email ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
            {!errors.email && formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
              <small style={{ color: '#4CAF50', fontSize: '0.85rem' }}>✓ Valid email format</small>
            )}
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="••••••••"
              style={{
                borderColor: errors.password ? '#e74c3c' : formData.password && !errors.password ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            {!errors.password && formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>
                  Password strength:
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                  {[
                    formData.password.length >= 6,
                    /(?=.*[a-z])/.test(formData.password),
                    /(?=.*[A-Z])/.test(formData.password),
                    /(?=.*[0-9])/.test(formData.password)
                  ].map((met, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: '4px',
                        background: met ? '#4CAF50' : '#e1e5e9',
                        borderRadius: '2px'
                      }}
                    />
                  ))}
                </div>
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  Must contain: lowercase, uppercase, and number (min 6 chars)
                </small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="••••••••"
              style={{
                borderColor: errors.confirmPassword ? '#e74c3c' : formData.confirmPassword && formData.password === formData.confirmPassword ? '#4CAF50' : '#e1e5e9'
              }}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            {!errors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <small style={{ color: '#4CAF50', fontSize: '0.85rem' }}>✓ Passwords match</small>
            )}
          </div>

          <div className="form-group">
            <label>I want to join as *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="visitor">Visitor / Art Enthusiast</option>
              <option value="artist">Artist</option>
              <option value="curator">Curator / Gallery Owner</option>
            </select>
          </div>

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#666' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;

