import React from 'react';

const About = () => {
  return (
    <div className="about-page">
      <div className="page-header">
        <h1>About Virtual Art Gallery</h1>
        <p>Bringing the world's greatest art to your fingertips</p>
      </div>

      <div className="about-content">
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Virtual Art Gallery is dedicated to making art accessible to everyone, everywhere.
            We believe that art has the power to inspire, educate, and transform lives.
            Through our digital platform, we bring together masterpieces from renowned artists
            spanning centuries and cultures, creating an immersive experience that transcends
            physical boundaries.
          </p>
        </section>

        <section className="features-section">
          <h2>What We Offer</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Global Collection</h3>
              <p>Access to thousands of artworks from museums and private collections worldwide.</p>
            </div>
            <div className="feature-card">
              <h3>Virtual Tours</h3>
              <p>Immersive guided tours that bring exhibitions to life in your own space.</p>
            </div>
            <div className="feature-card">
              <h3>Artist Stories</h3>
              <p>Deep dives into the lives and inspirations of the world's greatest artists.</p>
            </div>
            <div className="feature-card">
              <h3>Educational Resources</h3>
              <p>Rich cultural and historical context for every artwork in our collection.</p>
            </div>
            <div className="feature-card">
              <h3>Community</h3>
              <p>Connect with fellow art enthusiasts and share your passion for creativity.</p>
            </div>
            <div className="feature-card">
              <h3>Accessibility</h3>
              <p>Art for everyone, regardless of location, mobility, or background.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-placeholder">👨‍💼</div>
              <h3>G DHANUSH</h3>
            </div>
            <div className="team-member">
              <div className="member-placeholder">👩‍🎨</div>
              <h3>J AKSHAYA</h3>
            </div>
            <div className="team-member">
              <div className="member-placeholder">👩‍🏫</div>
              <h3>RISHITHA</h3>

            </div>
          </div>
        </section>

        <section className="contact-section">
          <h2>Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <h3>Visit Us</h3>
              <p>123 Art Street<br />Cultural District<br />New York, NY 10001</p>
            </div>
            <div className="contact-item">
              <h3>Contact</h3>
              <p>Email: dhanushgondela123@gmail.com<br />Phone: +91 9390261528</p>
            </div>
            <div className="contact-item">
              <h3>Follow Us</h3>
              <p>Stay connected on social media for the latest exhibitions and art discoveries.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;