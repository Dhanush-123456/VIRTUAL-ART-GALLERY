import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Virtual Art Gallery</h3>
          <p>Bringing art to your fingertips</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/artists">Artists</Link></li>
            <li><Link to="/exhibitions">Exhibitions</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <p>info@virtualartgallery.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Virtual Art Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;