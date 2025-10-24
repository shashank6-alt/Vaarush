import React from 'react';

export default function DocsPage() {
  return (
    <div style={{ padding: '80px 40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#39FF14', fontSize: '42px', marginBottom: '40px' }}>
        📚 Vaarush Documentation
      </h1>
      
      <div style={{ color: '#eee', lineHeight: '1.8' }}>
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px' }}>
            🚀 Getting Started
          </h2>
          <p>Vaarush is a blockchain-based digital inheritance platform built on Algorand. Follow these steps to create your first will:</p>
          <ol>
            <li><strong>Connect Wallet:</strong> Click "Connect Wallet" in the header and connect your Algorand wallet.</li>
            <li><strong>Create Will:</strong> Navigate to "Create Will" and fill in your details.</li>
            <li><strong>Add Beneficiaries:</strong> Specify heirs and their share percentages.</li>
            <li><strong>Deploy Contract:</strong> Submit to deploy your smart contract on Algorand TestNet.</li>
          </ol>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px' }}>
            🔧 Technical Architecture
          </h2>
          <ul>
            <li><strong>Frontend:</strong> React.js with TypeScript</li>
            <li><strong>Backend:</strong> FastAPI (Python)</li>
            <li><strong>Blockchain:</strong> Algorand TestNet</li>
            <li><strong>Smart Contracts:</strong> PyTeal (ARC4)</li>
          </ul>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px' }}>
            📖 API Documentation
          </h2>
          <p>Backend API endpoints:</p>
          <ul>
            <li><code style={{ background: '#232323', padding: '4px 8px', borderRadius: '4px' }}>POST /create-will</code> - Create inheritance contract</li>
            <li><code style={{ background: '#232323', padding: '4px 8px', borderRadius: '4px' }}>POST /claim-assets</code> - Claim inherited assets</li>
            <li><code style={{ background: '#232323', padding: '4px 8px', borderRadius: '4px' }}>GET /wills/:address</code> - Get wills for address</li>
            <li><code style={{ background: '#232323', padding: '4px 8px', borderRadius: '4px' }}>POST /ai/assist</code> - AI Assistant endpoint</li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px' }}>
            🔗 Useful Links
          </h2>
          <ul>
            <li><a href="https://github.com/shashank6-alt/Vaarush" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>GitHub Repository</a></li>
            <li><a href="https://developer.algorand.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>Algorand Developer Portal</a></li>
            <li><a href="https://testnet.algoexplorer.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>Algorand TestNet Explorer</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
