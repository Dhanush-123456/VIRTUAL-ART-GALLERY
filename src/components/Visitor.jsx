import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Gallery from './Gallery';
import Modal from './Modal';
import Login from './Login';
import PaymentGateway from './PaymentGateway';
import { artworks } from '../data/artworks';

const TourSlideshow = ({ artworks }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % artworks.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + artworks.length) % artworks.length);
  const art = artworks[currentSlide];
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % artworks.length);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + artworks.length) % artworks.length);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [artworks.length]);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <img src={art.image} alt={art.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '10px', marginBottom: '1rem' }} />
      <h3>{art.title}</h3>
      <p style={{ color: '#667eea' }}>by {art.artist} ({art.year})</p>
      <p>{art.description}</p>
      {art.history && <p><strong>History:</strong> {art.history}</p>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
        <button onClick={prevSlide} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>← Previous</button>
        <span>{currentSlide + 1} / {artworks.length}</span>
        <button onClick={nextSlide} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Next →</button>
      </div>
      <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>Use arrow keys to navigate</p>
    </div>
  );
};

const Visitor = ({ user, onLogin, onLogout }) => {
  // Allow public browsing - login is optional

  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [paymentCart, setPaymentCart] = useState([]);
  const navigate = useNavigate();

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Art Gallery</h1>
        <p>{user ? `Welcome back, ${user.username}! ` : ''}Explore our collection and enjoy virtual tours.</p>
      </div>

      <div className="dashboard-actions">
        <button className="action-btn primary" onClick={() => {
          const tourContent = (
            <div>
              <h2>Virtual Tour</h2>
              <p>Welcome to our virtual art gallery tour! Explore our collection below.</p>
              <TourSlideshow artworks={artworks} />
            </div>
          );
          openModal(tourContent);
        }}>
          🎨 Take Virtual Tour
        </button>
        <button className="action-btn secondary" onClick={() => {
          const gallerySection = document.querySelector('.gallery-section');
          if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
          }
        }}>
          🖼️ Browse Gallery
        </button>
        {!user && (
          <button className="action-btn secondary" onClick={() => navigate('/login')}>
            🔐 Login
          </button>
        )}
        {cart.length > 0 && (
          <div className="cart-info">
            <span>🛒 Cart: {cart.length} items (${cart.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()})</span>
            <button className="action-btn secondary" onClick={() => {
              const cartContent = (
                <div>
                  <h2>Shopping Cart</h2>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #eee', borderRadius: '5px' }}>
                      <h3>{item.title}</h3>
                      <p>by {item.artist}</p>
                      <p>Price: ${item.price?.toLocaleString()}</p>
                      <button onClick={() => {
                        setCart(prev => prev.filter((_, i) => i !== idx));
                        if (cart.length === 1) closeModal();
                      }}>Remove</button>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #333' }}>
                    <h3>Total: ${cart.reduce((sum, item) => sum + (item.price || 0), 0).toLocaleString()}</h3>
                    <button 
                      onClick={() => {
                        closeModal();
                        setPaymentCart(cart);
                        setShowPaymentGateway(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              );
              openModal(cartContent);
            }}>
              View Cart
            </button>
          </div>
        )}
      </div>

      <div className="dashboard-content">
        <section className="featured-section">
          <h2>Featured This Month</h2>
          <p>Discover our curator's selection of exceptional artworks</p>
        </section>

        <section className="gallery-section">
          <h2>Art Collection</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.75rem', width: '100%', maxWidth: '400px', borderRadius: '5px', border: '2px solid #e1e5e9' }}
            />
          </div>
          <Gallery 
            openModal={openModal} 
            searchTerm={searchTerm} 
            cart={cart} 
            setCart={setCart}
            user={user}
            onBuyNow={(art) => {
              setPaymentCart([art]);
              setShowPaymentGateway(true);
            }}
          />
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} content={modalContent} />
      
      {showPaymentGateway && (
        <Modal
          isOpen={showPaymentGateway}
          onClose={() => {
            setShowPaymentGateway(false);
            setPaymentCart([]);
          }}
          content={
            <PaymentGateway
              cart={paymentCart}
              total={paymentCart.reduce((sum, item) => sum + (item.price || 0), 0)}
              onSuccess={() => {
                // Remove purchased items from cart
                const purchasedIds = paymentCart.map(item => item.id);
                setCart(prev => prev.filter(item => !purchasedIds.includes(item.id)));
                setShowPaymentGateway(false);
                setPaymentCart([]);
                alert('Thank you for your purchase! Your order has been confirmed.');
              }}
              onCancel={() => {
                setShowPaymentGateway(false);
                setPaymentCart([]);
              }}
            />
          }
        />
      )}
    </div>
  );
};

export default Visitor;