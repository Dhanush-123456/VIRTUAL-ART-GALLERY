import React, { useState, useEffect } from 'react';

const ArtItem = ({ art, openModal, cart = [], setCart = () => {}, onBuyNow = () => {}, user = null }) => {
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState(user?.email || '');
  const [notifyMessage, setNotifyMessage] = useState('');

  const isOutOfStock = art.status && art.status.toLowerCase() !== 'available';

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setNotifyEmail(user.email);
    }
  }, [user]);
  const showArtDetails = () => {
    const content = (
      <div>
        <h2>{art.title}</h2>
        <img src={art.image} alt={art.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '5px', marginBottom: '1rem' }} />
        
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <p><strong>Artist:</strong> {art.artist}</p>
          <p><strong>Year:</strong> {art.year}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span style={{
              color: isOutOfStock ? '#e74c3c' : '#4CAF50',
              fontWeight: '600',
              textTransform: 'capitalize'
            }}>
              {art.status || 'available'}
            </span>
          </p>
          <p><strong>Price:</strong> ${art.price.toLocaleString()}</p>
          {isOutOfStock && (
            <div style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '5px',
              color: '#856404'
            }}>
              <strong>⚠️ Out of Stock</strong>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                This artwork is currently unavailable. Click "Notify Me" to be alerted when it's back in stock.
              </p>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>Description</h3>
          <p>{art.description}</p>
        </div>

        {art.history && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e8f4f8', borderRadius: '5px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>📚 Historical Context</h3>
            <p>{art.history}</p>
          </div>
        )}

        {art.culturalSignificance && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '5px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🌍 Cultural Significance</h3>
            <p>{art.culturalSignificance}</p>
          </div>
        )}

        {art.artistBio && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f3e5f5', borderRadius: '5px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>👨‍🎨 Artist Biography</h3>
            <p>{art.artistBio}</p>
          </div>
        )}

        {art.virtualTourUrl && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: '#e0f2f1', borderRadius: '5px' }}>
            <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>🎨 Virtual Tour</h3>
            <a href={art.virtualTourUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'underline' }}>
              Take Virtual Tour →
            </a>
          </div>
        )}

        {isOutOfStock ? (
          <div style={{ marginTop: '1.5rem' }}>
            {!showNotifyForm ? (
              <>
                <button 
                  onClick={handleNotifyClick}
                  style={{ 
                    width: '100%',
                    padding: '0.75rem 1.5rem', 
                    backgroundColor: '#FF9800', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer', 
                    fontWeight: '600',
                    fontSize: '1rem',
                    marginBottom: '0.5rem'
                  }}
                >
                  🔔 Notify Me When Available
                </button>
                {user?.email && (
                  <p style={{ 
                    margin: 0, 
                    fontSize: '0.85rem', 
                    color: '#666', 
                    textAlign: 'center',
                    fontStyle: 'italic'
                  }}>
                    You'll be notified at {user.email}
                  </p>
                )}
              </>
            ) : (
              <div style={{
                padding: '1.5rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '2px solid #e1e5e9'
              }}>
                <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#333' }}>
                  Get Notified When Available
                </h3>
                {user?.email && (
                  <div style={{
                    padding: '0.75rem',
                    background: '#e3f2fd',
                    border: '1px solid #2196F3',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                    fontSize: '0.9rem',
                    color: '#1565c0'
                  }}>
                    <strong>📧 Notification will be sent to:</strong> {user.email}
                  </div>
                )}
                <form onSubmit={handleNotifyMe}>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#555' }}>
                      {user?.email ? 'Email Address (or use your account email)' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => {
                        setNotifyEmail(e.target.value);
                        setNotifyMessage('');
                      }}
                      placeholder={user?.email || "your@email.com"}
                      required={!user?.email}
                      disabled={!!user?.email}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: notifyMessage && notifyMessage !== 'success' ? '2px solid #e74c3c' : '2px solid #e1e5e9',
                        borderRadius: '5px',
                        fontSize: '1rem',
                        boxSizing: 'border-box',
                        background: user?.email ? '#f5f5f5' : 'white',
                        cursor: user?.email ? 'not-allowed' : 'text'
                      }}
                    />
                    {user?.email && (
                      <small style={{ display: 'block', marginTop: '0.25rem', color: '#666', fontSize: '0.85rem' }}>
                        Using your logged-in email address
                      </small>
                    )}
                    {notifyMessage && notifyMessage !== 'success' && (
                      <span style={{ color: '#e74c3c', fontSize: '0.85rem', display: 'block', marginTop: '0.25rem' }}>
                        {notifyMessage}
                      </span>
                    )}
                    {notifyMessage === 'success' && (
                      <div style={{ 
                        color: '#4CAF50', 
                        fontSize: '0.9rem', 
                        display: 'block', 
                        marginTop: '0.5rem',
                        padding: '0.75rem',
                        background: '#e8f5e9',
                        borderRadius: '5px',
                        border: '1px solid #4CAF50'
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          ✓ Notification Registered Successfully!
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                          You will receive an email at <strong>{notifyEmail || user?.email}</strong> when this artwork is back in stock.
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        backgroundColor: '#FF9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.95rem'
                      }}
                    >
                      Subscribe for Notifications
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNotifyForm(false);
                        setNotifyEmail('');
                        setNotifyMessage('');
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#e1e5e9',
                        color: '#333',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => addToCart(art)} style={{ flex: 1, padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}>
              🛒 Add to Cart
            </button>
            <button onClick={() => buyArt(art)} style={{ flex: 1, padding: '0.75rem 1.5rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}>
              💳 Buy Now
            </button>
          </div>
        )}
      </div>
    );
    openModal(content);
  };

  const addToCart = (art) => {
    setCart(prev => [...prev, art]);
    alert(`"${art.title}" added to cart!`);
  };

  const buyArt = (art) => {
    if (isOutOfStock) {
      setShowNotifyForm(true);
      return;
    }
    onBuyNow(art);
  };

  const handleNotifyMe = (e) => {
    if (e) e.preventDefault();
    
    const emailToUse = user?.email || notifyEmail.trim();
    
    if (!emailToUse) {
      setNotifyMessage('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
      setNotifyMessage('Please enter a valid email address');
      return;
    }

    // Save notification request
    const notifications = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
    const notification = {
      id: Date.now(),
      artworkId: art.id,
      artworkTitle: art.title,
      artist: art.artist,
      email: emailToUse,
      userId: user?.id || null,
      username: user?.username || 'Guest',
      requestedAt: new Date().toISOString(),
      notified: false
    };

    // Check if already registered for this artwork
    const existing = notifications.find(
      n => n.artworkId === art.id && 
      (n.email.toLowerCase() === emailToUse.toLowerCase() || (user && n.userId === user.id))
    );

    if (existing) {
      setNotifyMessage('You are already registered for notifications on this artwork');
      return;
    }

    notifications.push(notification);
    localStorage.setItem('stock_notifications', JSON.stringify(notifications));

    // Show success message
    setNotifyMessage('success');
    
    // Show confirmation alert
    setTimeout(() => {
      alert(`✅ Notification Registered Successfully!\n\n📧 Email: ${emailToUse}\n🖼️ Artwork: "${art.title}" by ${art.artist}\n\nYou will receive an email notification when this artwork is back in stock.`);
      
      // Close form after a delay if user is logged in (auto-registered)
      if (user?.email) {
        setTimeout(() => {
          setShowNotifyForm(false);
          setNotifyEmail('');
          setNotifyMessage('');
        }, 2000);
      }
    }, 500);
  };

  const handleNotifyClick = () => {
    // If user is logged in, register notification immediately using their email
    if (user?.email) {
      const emailToUse = user.email;
      
      // Save notification request
      const notifications = JSON.parse(localStorage.getItem('stock_notifications') || '[]');
      
      // Check if already registered
      const existing = notifications.find(
        n => n.artworkId === art.id && 
        (n.email.toLowerCase() === emailToUse.toLowerCase() || n.userId === user.id)
      );

      if (existing) {
        alert(`You are already registered for notifications on "${art.title}".\n\nYou will be notified at ${emailToUse} when it's back in stock.`);
        return;
      }

      const notification = {
        id: Date.now(),
        artworkId: art.id,
        artworkTitle: art.title,
        artist: art.artist,
        email: emailToUse,
        userId: user.id,
        username: user.username,
        requestedAt: new Date().toISOString(),
        notified: false
      };

      notifications.push(notification);
      localStorage.setItem('stock_notifications', JSON.stringify(notifications));

      // Show success message
      alert(`✅ Notification Registered Successfully!\n\n📧 Email: ${emailToUse}\n🖼️ Artwork: "${art.title}" by ${art.artist}\n\nYou will receive an email notification at ${emailToUse} when this artwork is back in stock.`);
    } else {
      // If not logged in, show form
      setShowNotifyForm(true);
    }
  };

  return (
    <div className="art-item">
      <img src={art.image} alt={art.title} />
      <div className="art-info">
        <h3>{art.title}</h3>
        <p><strong>Artist:</strong> {art.artist}</p>
        <p><strong>Year:</strong> {art.year}</p>
        <p>{art.description}</p>
        <p><strong>Price:</strong> ${art.price.toLocaleString()}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span style={{
            color: isOutOfStock ? '#e74c3c' : '#4CAF50',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {art.status || 'available'}
          </span>
        </p>
        {isOutOfStock && (
          <div style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '5px',
            color: '#856404',
            fontSize: '0.85rem'
          }}>
            ⚠️ Currently out of stock
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={showArtDetails} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            View Details
          </button>
          {isOutOfStock ? (
            <button 
              onClick={handleNotifyClick}
              style={{ 
                flex: 1, 
                padding: '0.5rem', 
                backgroundColor: '#FF9800', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔔 Notify Me
            </button>
          ) : (
            <button onClick={() => addToCart(art)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtItem;