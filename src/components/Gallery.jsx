import React, { useState, useEffect } from 'react';
import ArtItem from './ArtItem';
import api from '../services/api';

const Gallery = ({ openModal, searchTerm = '', cart = [], setCart = () => {}, onBuyNow = () => {}, user = null }) => {
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true);
        const response = await api.getArtworks();
        setArtworks(response.artworks || []);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load artworks');
        // Fallback to local data if API fails
        const { artworks: localArtworks } = await import('../data/artworks');
        setArtworks(localArtworks);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  const startVirtualTour = () => {
    const tourContent = (
      <div>
        <h2>Virtual Tour</h2>
        <p>Welcome to our virtual art gallery tour! Click through the artworks below:</p>
        <TourSlideshow artworks={artworks} />
      </div>
    );
    openModal(tourContent);
  };

  const filteredArtworks = searchTerm
    ? artworks.filter(art =>
        art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        art.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (art.description && art.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : artworks;

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading artworks...</p>
      </div>
    );
  }

  if (error && artworks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#e74c3c' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <section id="gallery" className="gallery">
        <div id="art-grid">
          {filteredArtworks.length > 0 ? (
            filteredArtworks.map(art => (
              <ArtItem key={art.id} art={art} openModal={openModal} cart={cart} setCart={setCart} onBuyNow={onBuyNow} user={user} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No artworks found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const TourSlideshow = ({ artworks }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % artworks.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  const art = artworks[currentSlide];

  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div id="tour-slideshow" style={{ textAlign: 'center' }}>
      <div className="slide" style={{ marginBottom: '1rem' }}>
        <img 
          src={art.image} 
          alt={art.title} 
          style={{ 
            width: '100%', 
            maxHeight: '400px', 
            objectFit: 'cover', 
            borderRadius: '10px',
            marginBottom: '1rem',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }} 
        />
        <h3 style={{ marginBottom: '0.5rem', color: '#333' }}>{art.title}</h3>
        <p style={{ color: '#667eea', marginBottom: '0.5rem', fontWeight: '500' }}>by {art.artist} ({art.year})</p>
        <p style={{ marginBottom: '1rem', color: '#555', lineHeight: '1.6' }}>{art.description}</p>
        {art.history && (
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            textAlign: 'left'
          }}>
            <p><strong>History:</strong> {art.history}</p>
          </div>
        )}
        {art.culturalSignificance && (
          <div style={{ 
            backgroundColor: '#e8f4f8', 
            padding: '1rem', 
            borderRadius: '5px', 
            marginBottom: '1rem',
            textAlign: 'left'
          }}>
            <p><strong>Cultural Significance:</strong> {art.culturalSignificance}</p>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
        <button 
          id="prev-slide" 
          onClick={prevSlide}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          ← Previous
        </button>
        <span style={{ color: '#666', fontWeight: '500' }}>
          {currentSlide + 1} / {artworks.length}
        </span>
        <button 
          id="next-slide" 
          onClick={nextSlide}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Next →
        </button>
      </div>
      <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>
        Use arrow keys to navigate
      </p>
    </div>
  );
};

export default Gallery;