// src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaUsers, FaCoins } from 'react-icons/fa';
import './HomePage.css';

export default function HomePage() {
  const features = [
    {
      icon: FaFileContract,
      title: 'Deploy Smart Will',
      description: 'Create blockchain-based inheritance contracts with just a few clicks.',
      link: '/create',
    },
    {
      icon: FaUsers,
      title: 'Manage Beneficiaries',
      description: 'Add, update, and track heirs and their designated shares securely.',
      link: '/dashboard',
    },
    {
      icon: FaCoins,
      title: 'Claim Assets',
      description: 'Heirs can claim their inheritance when conditions are met.',
      link: '/dashboard',
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero__title">
          Secure Your Legacy on <span className="accent">Algorand</span>
        </h1>
        <p className="hero__subtitle">
          Create, manage, and claim digital wills with trustless blockchain security.
        </p>
        <Link to="/create" className="hero__cta">
          Get Started
        </Link>
      </section>

      <section className="features">
        {features.map(({ icon: Icon, title, description, link }, idx) => (
          <div className="feature-card" key={idx}>
            <div className="feature-card__icon">
              <Icon />
            </div>
            <h3 className="feature-card__title">{title}</h3>
            <p className="feature-card__description">{description}</p>
            <Link to={link} className="feature-card__link">
              Learn More →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
// At the bottom of the file:

