import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { artworks } from '../data/artworks';

const Home = () => {
  const navigate = useNavigate();
  const featuredArtworks = artworks.slice(0, 3);
  const [showGallery, setShowGallery] = useState(false);
  const [showText, setShowText] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const galleryRef = useRef(null);

  const paintings = artworks.map((art, i) => ({
    src: art.image,
    caption: art.title
  }));

  const handleOpenExhibition = () => {
    setShowGallery(true);
    setIsGlowing(true);
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => setIsGlowing(false), 1000);
    }, 100);
  };

  const handleDiscoverExhibitions = () => {
    navigate('/curator');
  };

  const roles = [
    {
      id: 'curator',
      title: 'Art Curator / Seller',
      description: 'Create and manage your digital art exhibitions and collections.',
      features: [
        'Upload and manage artworks',
        'Add cultural and historical details',
        'Create virtual tours of your gallery',
        'Offer artworks for sale'
      ],
      buttonText: 'Start as Curator',
      path: '/curator'
    },
    {
      id: 'artist',
      title: 'Artist',
      description: 'Showcase your artwork and connect with art lovers worldwide.',
      features: [
        'Upload your creations',
        'Build your portfolio',
        'Connect with galleries',
        'Sell your art directly'
      ],
      buttonText: 'Start as Artist',
      path: '/artist'
    },
    {
      id: 'visitor',
      title: 'Art Enthusiast',
      description: 'Explore virtual galleries and discover amazing artworks.',
      features: [
        'Browse exhibitions',
        'Learn art history',
        'Take virtual tours',
        'Purchase artworks'
      ],
      buttonText: 'Explore as Visitor',
      path: '/gallery'
    },
    {
      id: 'admin',
      title: 'Gallery Administrator',
      description: 'Manage the gallery platform and oversee operations.',
      features: [
        'User management',
        'Content moderation',
        'Analytics and reports',
        'Platform settings'
      ],
      buttonText: 'Admin Access',
      path: '/admin'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero fade-in-up">
        <div className="hero-content">
          <h1>Online art exhibitions.<br />Unlimited by reality.<br />Accessible for everyone.</h1>
          <p style={{ fontSize: '1.4rem', marginBottom: '2.5rem', opacity: 0.95, lineHeight: 1.6 }}>
            Experience the world's greatest artworks in immersive virtual galleries. 
            Discover, learn, and collect art from anywhere in the world.
          </p>
          <div className="hero-buttons">
            <button className="cta-button" onClick={handleOpenExhibition}>Open your own art exhibition »</button>
            <button className="cta-button" onClick={handleDiscoverExhibitions}>Discover art exhibitions »</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={artworks[0].image} alt="Featured Artwork" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section fade-in-up">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number-large">{artworks.length}+</div>
            <div className="stat-label">Artworks</div>
          </div>
          <div className="stat-item">
            <div className="stat-number-large">50+</div>
            <div className="stat-label">Artists</div>
          </div>
          <div className="stat-item">
            <div className="stat-number-large">12+</div>
            <div className="stat-label">Exhibitions</div>
          </div>
          <div className="stat-item">
            <div className="stat-number-large">10K+</div>
            <div className="stat-label">Visitors</div>
          </div>
        </div>
      </section>

      {/* Paintings Gallery */}
      <section className="paintings-gallery fade-in-up" ref={galleryRef}>
        <div className="paintings-grid">
          {paintings.map((painting, index) => (
            <div key={index} className="painting-card" onClick={() => navigate('/gallery')}>
              <img src={painting.src} alt={painting.caption} />
              <p>{painting.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section fade-in-up">
        <div className="content-container">
          <div className="content-column">
            <h2>Artists & Art Galleries.</h2>
            <p>Showcase your masterpieces in immersive virtual spaces. Connect with global audiences and break the barriers of traditional galleries. Upload your artworks, add cultural context, and create stunning virtual exhibitions that reach art lovers worldwide.</p>
          </div>
          <div className="content-column">
            <h2>Art Lovers & Art Collectors.</h2>
            <p>Explore unlimited art collections from anywhere in the world. Experience art like never before with our cutting-edge virtual reality technology. Learn about cultural history, take guided tours, and purchase authentic artworks from renowned artists.</p>
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="roles-section fade-in-up">
        <div className="roles-grid">
          {roles.map((role) => (
            <div key={role.id} className="role-card">
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <ul className="role-features">
                {role.features.map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
              <button
                className="role-button"
                onClick={() => navigate(role.path)}
              >
                {role.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* Featured Artworks */}
      <section className="featured-section fade-in-up">
        <h2>Featured Artworks</h2>
        <div className="featured-grid">
          {featuredArtworks.map((art, index) => (
            <div key={art.id} className="featured-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <img src={art.image} alt={art.title} />
              <div className="featured-info">
                <h3>{art.title}</h3>
                <p>by {art.artist}</p>
                <Link to="/gallery" className="view-more">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section fade-in-up">
        <h2>About Our Gallery</h2>
        <p>Experience art like never before with our immersive virtual gallery. Browse collections, learn about artists, and purchase masterpieces from the comfort of your home. We bring together the world's most celebrated artworks in one accessible platform.</p>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">🎨</div>
            <h3>Virtual Tours</h3>
            <p>Take guided tours through our digital exhibitions with interactive navigation and detailed artwork information</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📚</div>
            <h3>Artist Stories</h3>
            <p>Discover the inspiration behind each masterpiece with comprehensive biographies and cultural context</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🌍</div>
            <h3>Global Collection</h3>
            <p>Artworks from renowned artists worldwide spanning centuries of artistic achievement</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🛒</div>
            <h3>Easy Purchase</h3>
            <p>Buy authentic artworks directly through our secure platform with verified sellers</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎓</div>
            <h3>Educational Content</h3>
            <p>Learn about art history, cultural significance, and artistic techniques from expert curators</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💼</div>
            <h3>For Professionals</h3>
            <p>Tools for artists, curators, and gallery owners to manage and showcase their collections</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section fade-in-up">
        <div className="cta-content">
          <h2>Ready to Explore Art?</h2>
          <p>Join thousands of art enthusiasts discovering masterpieces every day</p>
          <div className="cta-buttons-final">
            <button className="cta-button-primary" onClick={() => navigate('/signup')}>
              Get Started Free
            </button>
            <button className="cta-button-secondary" onClick={() => navigate('/gallery')}>
              Browse Gallery
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;