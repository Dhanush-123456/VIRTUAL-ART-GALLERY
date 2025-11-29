import React from 'react';

const ArtItem = ({ art, openModal, cart = [], setCart = () => {} }) => {
  const showArtDetails = () => {
    const content = (
      <div>
        <h2>{art.title}</h2>
        <img src={art.image} alt={art.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '5px', marginBottom: '1rem' }} />
        
        <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
          <p><strong>Artist:</strong> {art.artist}</p>
          <p><strong>Year:</strong> {art.year}</p>
          <p><strong>Status:</strong> {art.status || 'available'}</p>
          <p><strong>Price:</strong> ${art.price.toLocaleString()}</p>
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

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => addToCart(art)} style={{ flex: 1, padding: '0.75rem 1.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}>
            🛒 Add to Cart
          </button>
          <button onClick={() => buyArt(art)} style={{ flex: 1, padding: '0.75rem 1.5rem', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: '500' }}>
            💳 Buy Now
          </button>
        </div>
      </div>
    );
    openModal(content);
  };

  const addToCart = (art) => {
    setCart(prev => [...prev, art]);
    alert(`"${art.title}" added to cart!`);
  };

  const buyArt = (art) => {
    alert(`Thank you for your interest in "${art.title}"! In a real application, this would redirect to a payment gateway. Price: $${art.price.toLocaleString()}`);
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
        <p><strong>Status:</strong> {art.status || 'available'}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={showArtDetails} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            View Details
          </button>
          <button onClick={() => addToCart(art)} style={{ flex: 1, padding: '0.5rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtItem;