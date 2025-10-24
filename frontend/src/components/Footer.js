// src/components/Footer.js
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__copyright">
        © 2025 Vaarush — All Rights Reserved
      </div>
      <div className="footer__links">
        <a 
          href="https://github.com/shashank6-alt/Vaarush" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer__link"
        >
          <FaGithub className="footer__icon" />
          GitHub
        </a>
        <Link to="/docs" className="footer__link">
          Docs
        </Link>
        <Link to="/support" className="footer__link">
          Support
        </Link>
      </div>
      <div className="footer__social">
        <a 
          href="https://twitter.com" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter className="footer__icon" />
        </a>
        <a 
          href="https://linkedin.com" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin className="footer__icon" />
        </a>
      </div>
    </footer>
  );
}
