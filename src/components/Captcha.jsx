import React, { useState, useEffect } from 'react';

const Captcha = ({ onVerify, onError }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [captchaStyles, setCaptchaStyles] = useState([]);
  const [answer, setAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const generateAlphanumeric = (length = 5) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing characters like 0, O, I, 1
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getRandomRotation = () => Math.floor(Math.random() * 20) - 10; // -10 to 10 degrees
  const getRandomColor = () => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const generateNewCaptcha = () => {
    const newCaptcha = generateAlphanumeric(5);
    const styles = newCaptcha.split('').map(() => ({
      rotation: getRandomRotation(),
      color: getRandomColor()
    }));
    setCaptchaText(newCaptcha);
    setCaptchaStyles(styles);
    setAnswer('');
    setIsVerified(false);
    setError('');
    if (onError) onError('');
  };

  useEffect(() => {
    generateNewCaptcha();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only allow alphanumeric, convert to uppercase
    setAnswer(value);
    setError('');
    setIsVerified(false);
    if (onError) onError('');
  };

  const handleVerify = () => {
    if (!answer.trim()) {
      setError('Please enter the CAPTCHA code');
      if (onError) onError('Please enter the CAPTCHA code');
      setIsVerified(false);
      if (onVerify) onVerify(false);
      return;
    }

    // Case-insensitive comparison
    if (answer.toUpperCase() === captchaText.toUpperCase()) {
      setIsVerified(true);
      setError('');
      if (onVerify) onVerify(true);
      if (onError) onError('');
    } else {
      setIsVerified(false);
      setError('Incorrect CAPTCHA. Please try again.');
      if (onError) onError('Incorrect CAPTCHA code');
      if (onVerify) onVerify(false);
      // Auto-generate new CAPTCHA on wrong answer
      setTimeout(() => {
        generateNewCaptcha();
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="captcha-container" style={{
      padding: '1.25rem',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
      borderRadius: '10px',
      border: '2px solid #e1e5e9',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '1rem' 
      }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontWeight: '600',
          color: '#333',
          fontSize: '0.95rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>🔒</span>
          <span>Security Verification</span>
        </label>
        <button
          type="button"
          onClick={generateNewCaptcha}
          className="captcha-refresh-btn"
          style={{
            background: 'transparent',
            border: '1px solid #667eea',
            color: '#667eea',
            cursor: 'pointer',
            fontSize: '0.85rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '6px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#667eea';
            e.target.style.color = 'white';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = '#667eea';
            e.target.style.transform = 'scale(1)';
          }}
          title="Generate new CAPTCHA"
        >
          <span>↻</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* CAPTCHA Box with Input and Button Inside */}
      <div style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '8px',
        border: '2px solid #e1e5e9',
        position: 'relative',
        overflow: 'visible',
        marginBottom: '1rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'repeating-linear-gradient(45deg, #667eea, #667eea 10px, transparent 10px, transparent 20px)',
          borderRadius: '8px',
          overflow: 'hidden'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '100%'
        }}>
          {/* CAPTCHA Text Display */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
            letterSpacing: '0.3rem',
            padding: '0.75rem 0',
            minHeight: '50px',
            flexWrap: 'wrap'
          }}>
            {captchaText.split('').map((char, index) => (
              <span
                key={index}
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: '700',
                  color: captchaStyles[index]?.color || '#667eea',
                  transform: `rotate(${captchaStyles[index]?.rotation || 0}deg)`,
                  display: 'inline-block',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  userSelect: 'none',
                  transition: 'transform 0.2s ease'
                }}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Input and Button Section */}
          <div style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '0.75rem',
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <input
              type="text"
              value={answer}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter code"
              style={{
                flex: '1 1 200px',
                minWidth: '150px',
                padding: '0.65rem 0.85rem',
                border: error ? '2px solid #e74c3c' : isVerified ? '2px solid #4CAF50' : '2px solid #e1e5e9',
                borderRadius: '8px',
                fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                textAlign: 'center',
                fontWeight: '600',
                letterSpacing: '0.15rem',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                transition: 'all 0.3s ease',
                boxShadow: error ? '0 0 0 3px rgba(231, 76, 60, 0.1)' : isVerified ? '0 0 0 3px rgba(76, 175, 80, 0.1)' : 'none',
                boxSizing: 'border-box',
                height: '42px',
                background: 'white',
                width: '100%'
              }}
              maxLength="5"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerified}
              className="captcha-verify-btn"
              style={{
                padding: '0.65rem 1rem',
                background: isVerified 
                  ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isVerified ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: 'clamp(0.8rem, 2vw, 0.85rem)',
                transition: 'all 0.2s ease',
                boxShadow: isVerified 
                  ? '0 2px 6px rgba(76, 175, 80, 0.3)' 
                  : '0 2px 6px rgba(102, 126, 234, 0.3)',
                minWidth: '90px',
                flex: '0 0 auto',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                opacity: isVerified ? 0.85 : 1,
                outline: 'none',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                boxSizing: 'border-box'
              }}
            >
              {isVerified ? (
                <>
                  <span style={{ fontSize: '1rem', lineHeight: '1' }}>✓</span>
                  <span>Verified</span>
                </>
              ) : (
                <span>Verify</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#fee',
          color: '#c33',
          borderRadius: '6px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid #e74c3c',
          marginBottom: '0.5rem',
          animation: 'shake 0.3s ease'
        }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {isVerified && (
        <div style={{
          padding: '0.75rem 1rem',
          background: '#e8f5e9',
          color: '#2e7d32',
          borderRadius: '6px',
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '1px solid #4CAF50',
          marginBottom: '0.5rem'
        }}>
          <span style={{ fontSize: '1.1rem' }}>✓</span>
          <span>CAPTCHA verified successfully</span>
        </div>
      )}

      {/* Helper Text */}
      <small style={{
        display: 'block',
        color: '#666',
        fontSize: '0.8rem',
        marginTop: '0.5rem',
        textAlign: 'center',
        fontStyle: 'italic'
      }}>
        Enter the code shown above (case-insensitive)
      </small>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .captcha-verify-btn:not(:disabled):hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4) !important;
          background: linear-gradient(135deg, #5a6fd8 0%, #6a42a0 100%) !important;
        }
        
        .captcha-verify-btn:not(:disabled):active {
          transform: translateY(0) !important;
          box-shadow: 0 1px 4px rgba(102, 126, 234, 0.3) !important;
        }
        
        .captcha-verify-btn:disabled {
          cursor: not-allowed !important;
          opacity: 0.85 !important;
        }
        
        .captcha-verify-btn:focus {
          outline: 2px solid rgba(102, 126, 234, 0.5);
          outline-offset: 2px;
        }
        
        @media (max-width: 480px) {
          .captcha-container {
            padding: 1rem !important;
          }
          
          .captcha-verify-btn {
            width: 100% !important;
            min-width: 100% !important;
            margin-top: 0.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .captcha-verify-btn {
            min-width: 80px !important;
            padding: 0.6rem 0.85rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Captcha;

