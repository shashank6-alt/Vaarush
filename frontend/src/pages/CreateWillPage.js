// src/pages/CreateWillPage.js

import React from 'react';
import ContractForm from '../components/ContractForm';
import './CreateWillPage.css';

export default function CreateWillPage() {
  return (
    <div className="create-will-page">
      <div className="create-will-sidebar">
        <h2>How It Works</h2>
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Connect Wallet</h3>
            <p>Link your Algorand wallet to get started.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Set Will Details</h3>
            <p>Enter asset ID, release time, and heir information.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Deploy Contract</h3>
            <p>Submit to blockchain and receive your App ID.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <h3>Manage & Claim</h3>
            <p>Heirs can claim assets when conditions are met.</p>
          </div>
        </div>
      </div>
      <div className="create-will-form">
        <ContractForm />
      </div>
    </div>
  );
}
// At the bottom of the file:

