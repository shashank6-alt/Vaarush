import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Left: Copyright */}
        <div className="footer__copyright">
          <p>&copy; 2025 Vaarush. All Rights Reserved.</p>
          <p className="footer__tagline">Securing Digital Legacies</p>
        </div>

        {/* Center: Links */}
        <div className="footer__links">
          <a 
            href="https://github.com/shashank6-alt/Vaarush" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__link"
          >
            <FaGithub className="link-icon" />
            <span>GitHub</span>
          </a>
          <Link to="/docs" className="footer__link">
            <span>Documentation</span>
          </Link>
          <Link to="/support" className="footer__link">
            <span>Support</span>
          </Link>
        </div>

        {/* Right: Social */}
        <div className="footer__social">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaTwitter />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
