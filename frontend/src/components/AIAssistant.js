import React, { useState, useRef, useEffect } from 'react';
import './AIAssistant.css';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I\'m your Vaarush AI Assistant. How can I help you today?' }
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
    
    const responses = {
      'create': 'To create a will:\n1. Click "Create Will"\n2. Enter your wallet address\n3. Add asset ID and release date\n4. Specify heirs and their shares\n5. Click "Deploy Contract"',
      'deploy': 'To deploy:\n1. Fill all will details\n2. Make sure backend is running (API Connected)\n3. Click "Deploy Contract"\n4. You\'ll get an App ID',
      'asset': 'Asset ID is the Algorand asset you want to inherit. Example: Asset ID 1 for ALGO',
      'heir': 'Add beneficiaries by entering their wallet addresses and percentage shares',
      'share': 'Share percentage = how much of the asset each heir gets. Total must be ≤ 100%',
      'wallet': 'Click "Connect Wallet" to connect your Algorand wallet (AlgoSigner extension)',
      'blockchain': 'Vaarush uses Algorand blockchain for secure, transparent inheritance execution',
      'claim': 'Beneficiaries can claim assets from dashboard once release conditions are met',
      'error': 'Common errors:\n• Invalid address format\n• Asset ID < 0\n• Total shares > 100%\n• Backend not running',
      'help': 'I can help with:\n• Creating wills\n• Deploying contracts\n• Understanding blockchain\n• Claiming assets\n• Troubleshooting errors\n\nWhat do you need?',
    };
    
    for (const [key, value] of Object.entries(responses)) {
      if (msg.includes(key)) {
        return value;
      }
    }
    
    return 'I can help you with creating wills, deploying contracts, managing beneficiaries, or claiming assets. What would you like to know?';
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);

    try {
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
            <circle cx="8.5" cy="11" r="1.5" fill="currentColor"/>
            <circle cx="15.5" cy="11" r="1.5" fill="currentColor"/>
            <path d="M12 17.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="ai-assistant-container">
          <div className="ai-assistant-header">
            <div className="ai-assistant-title">
              <span className="ai-icon-header">AI</span>
              <span>Vaarush Assistant</span>
            </div>
            <button 
              className="ai-assistant-close"
              onClick={() => setIsOpen(false)}
            >
              ×
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
              {loading ? '...' : '→'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
