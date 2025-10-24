import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: ' Hi! I\'m your Vaarush AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase().trim();
    
    // Smart responses based on different keywords
    const responses = {
      // Create/Deploy questions
      'create': ' To create a will:\n1. Click "Create Will"\n2. Enter your wallet address\n3. Add asset ID and release date\n4. Specify heirs and their shares\n5. Click "Deploy Contract"',
      'deploy': ' To deploy:\n1. Fill all will details\n2. Make sure backend is running (🟢 API Connected)\n3. Click "Deploy Contract"\n4. You\'ll get an App ID',
      'asset': ' Asset ID is the Algorand asset you want to inherit. Example: Asset ID 1 for ALGO',
      'heir': ' Add beneficiaries by entering their wallet addresses and percentage shares',
      'share': ' Share percentage = how much of the asset each heir gets. Total must be ≤ 100%',
      
      // Wallet questions
      'wallet': ' Click "Connect Wallet" to connect your Algorand wallet (AlgoSigner extension)',
      'connect': ' Install AlgoSigner browser extension and click "Connect Wallet" button',
      'address': ' Your wallet address is your unique identifier on Algorand blockchain',
      
      // Blockchain questions
      'blockchain': 'Vaarush uses Algorand blockchain for secure, transparent inheritance execution',
      'algorand': ' Algorand is a fast, secure blockchain perfect for smart contracts and inheritance',
      'contract': ' Smart contracts are self-executing programs on the blockchain that manage your will',
      
      // Claim questions
      'claim': ' Beneficiaries can claim assets from dashboard once release conditions are met',
      'release': ' Release date is when beneficiaries can claim their inherited assets',
      'condition': ' Conditions: asset exists + current time ≥ release date',
      
      // Dashboard questions
      'dashboard': ' Dashboard shows your active wills, heirs, and allows you to claim assets',
      'view': ' View all your wills and their status in the dashboard',
      'status': ' Status shows if will is active, completed, or pending',
      
      // Error questions
      'error': ' Common errors:\n• Invalid address format\n• Asset ID < 0\n• Total shares > 100%\n• Backend not running',
      'failed': ' If "Failed to create will":\n1. Check backend is running\n2. Verify owner address\n3. Check asset ID is valid\n4. Ensure heirs are added\n5. Check 🟢 API Connected indicator',
      'backend': ' Backend must be running on port 8000. Run: uvicorn app.main:app --reload',
      
      // Help questions
      'help': ' I can help with:\n• Creating wills\n• Deploying contracts\n• Understanding blockchain\n• Claiming assets\n• Troubleshooting errors\n\nWhat do you need?',
      'how': ' Ask me anything about creating wills, deploying contracts, or managing your digital inheritance!',
      'what': ' What would you like to know about Vaarush?',
      
      // Feature questions
      'feature': ' Features: Create wills • Deploy contracts • Manage heirs • Claim assets • View dashboard',
      'security': ' Vaarush uses encrypted blockchain technology - your data is safe!',
      'cost': ' Algorand transactions have minimal gas fees',
    };
    
    // Find matching response
    for (const [key, value] of Object.entries(responses)) {
      if (msg.includes(key)) {
        return value;
      }
    }
    
    // Default response if no match
    return '🤖 I can help you with:\n• Creating wills\n• Deploying smart contracts\n• Managing beneficiaries\n• Claiming assets\n• Understanding blockchain\n\nWhat would you like to know?';
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
      // Try backend first
      const response = await fetch('http://localhost:8000/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        timeout: 3000
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          text: data.response || data.reply || getAIResponse(userMessage)
        }]);
      } else {
        throw new Error('Backend error');
      }
    } catch (error) {
      // Use local AI if backend fails
      console.log('Using local AI responses');
      const aiResponse = getAIResponse(userMessage);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: aiResponse
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button 
          className="ai-assistant-button"
          onClick={() => setIsOpen(true)}
          title="AI Assistant"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="ai-assistant-container">
          <div className="ai-assistant-header">
            <div className="ai-assistant-title">
              <span className="ai-icon">🤖</span>
              <span>Vaarush AI Assistant</span>
            </div>
            <button 
              className="ai-assistant-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="ai-assistant-messages">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`ai-message ${msg.sender === 'user' ? 'user-message' : 'ai-message-bot'}`}
              >
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message ai-message-bot">
                <div className="message-bubble typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-assistant-input-container">
            <input
              type="text"
              className="ai-assistant-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button 
              className="ai-assistant-send"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? 'O' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
