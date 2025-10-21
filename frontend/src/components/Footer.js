// src/components/Footer.js
import { FaTwitter, FaLinkedin } from "react-icons/fa"; 
import React from 'react';  
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__copyright">
        © {new Date().getFullYear()} Vaarush — All Rights Reserved
      </div>
      <div className="footer__links">
        <a href="https://github.com/Vaarush" target="_blank" rel="noopener noreferrer" className="footer__link">
          GitHub
        </a>
        <a href="/docs" className="footer__link">
          Docs
        </a>
        <a href="/support" className="footer__link">
          Support
        </a>
        <span className="footer__social">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="footer__icon">
            <i className="fa fa-twitter" />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="footer__icon">
            <i className="fa fa-linkedin" />
          </a>
        </span>
      </div>
    </footer>
  );
}
