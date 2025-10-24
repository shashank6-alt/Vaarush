import React, { useState, useEffect, Suspense, lazy, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import './App.css';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const CreateWillPage = lazy(() => import('./pages/CreateWillPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

// ========================================
// DOCS PAGE COMPONENT - PASTE THIS FULLY!
// ========================================
const DocsPageInline: React.FC = () => (
  <div style={{ padding: '80px 40px', maxWidth: '900px', margin: '0 auto', minHeight: '70vh' }}>
    <h1 style={{ color: '#39FF14', fontSize: '42px', marginBottom: '40px', textAlign: 'center', fontWeight: '800' }}>
      📚 Vaarush Documentation
    </h1>
    
    <div style={{ color: '#eee', lineHeight: '1.8' }}>
      <section style={{ marginBottom: '40px', background: '#1a1f3a', padding: '30px', borderRadius: '15px', border: '2px solid #39FF14' }}>
        <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px', fontWeight: '700' }}>
          🚀 Getting Started
        </h2>
        <ol style={{ marginLeft: '20px', fontSize: '16px', color: '#ddd' }}>
          <li style={{ marginBottom: '15px' }}><strong>Connect Wallet:</strong> Click "Connect Wallet" button in header to connect your Algorand wallet</li>
          <li style={{ marginBottom: '15px' }}><strong>Create Will:</strong> Navigate to "Create Will" page and fill in your asset details</li>
          <li style={{ marginBottom: '15px' }}><strong>Add Beneficiaries:</strong> Specify heirs with their wallet addresses and share percentages</li>
          <li style={{ marginBottom: '15px' }}><strong>Deploy Contract:</strong> Click "Deploy Contract" to submit to Algorand TestNet</li>
          <li style={{ marginBottom: '15px' }}><strong>View Dashboard:</strong> Track your wills and manage claims from the dashboard</li>
        </ol>
      </section>

      <section style={{ marginBottom: '40px', background: '#1a1f3a', padding: '30px', borderRadius: '15px', border: '2px solid #39FF14' }}>
        <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px', fontWeight: '700' }}>
          🔧 Technical Stack
        </h2>
        <ul style={{ marginLeft: '20px', fontSize: '16px', color: '#ddd' }}>
          <li style={{ marginBottom: '10px' }}><strong>Frontend:</strong> React.js with TypeScript</li>
          <li style={{ marginBottom: '10px' }}><strong>Backend:</strong> FastAPI (Python)</li>
          <li style={{ marginBottom: '10px' }}><strong>Blockchain:</strong> Algorand TestNet</li>
          <li style={{ marginBottom: '10px' }}><strong>Smart Contracts:</strong> PyTeal (ARC4)</li>
          <li style={{ marginBottom: '10px' }}><strong>AI Assistant:</strong> Keyword-based chatbot</li>
        </ul>
      </section>

      <section style={{ background: '#1a1f3a', padding: '30px', borderRadius: '15px', border: '2px solid #39FF14' }}>
        <h2 style={{ color: '#39FF14', fontSize: '28px', marginBottom: '20px', fontWeight: '700' }}>
          🔗 Resources
        </h2>
        <ul style={{ marginLeft: '20px', fontSize: '16px', color: '#ddd' }}>
          <li style={{ marginBottom: '10px' }}>
            <a href="https://github.com/shashank6-alt/Vaarush" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14', textDecoration: 'none' }}>
              📁 GitHub Repository
            </a>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <a href="https://developer.algorand.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14', textDecoration: 'none' }}>
              🔷 Algorand Developer Portal
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
);

// ========================================
// SUPPORT PAGE COMPONENT - PASTE THIS FULLY!
// ========================================
const SupportPageInline: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Support request:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ padding: '80px 40px', maxWidth: '700px', margin: '0 auto', minHeight: '70vh' }}>
      <h1 style={{ color: '#39FF14', fontSize: '42px', marginBottom: '20px', textAlign: 'center', fontWeight: '800' }}>
        💬 Support
      </h1>
      <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '40px', fontSize: '18px' }}>
        Need help? Send us a message and we'll get back to you soon!
      </p>

      <div style={{ background: '#1a1f3a', padding: '40px', borderRadius: '15px', border: '2px solid #39FF14' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              style={{
                width: '100%', padding: '12px', background: '#0a0e27',
                border: '1px solid #39FF14', borderRadius: '8px', color: '#eee', fontSize: '14px'
              }}
              placeholder="Your name"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{
                width: '100%', padding: '12px', background: '#0a0e27',
                border: '1px solid #39FF14', borderRadius: '8px', color: '#eee', fontSize: '14px'
              }}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
              rows={6}
              style={{
                width: '100%', padding: '12px', background: '#0a0e27',
                border: '1px solid #39FF14', borderRadius: '8px', color: '#eee', fontSize: '14px', resize: 'vertical'
              }}
              placeholder="Your message here..."
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%', padding: '15px', background: '#39FF14', color: '#0a0e27',
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#2eb82e'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#39FF14'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            📤 Send Message
          </button>

          {submitted && (
            <div style={{
              marginTop: '20px', padding: '15px', background: '#163a16',
              border: '1px solid #39FF14', borderRadius: '8px', color: '#39FF14', textAlign: 'center', fontWeight: '600'
            }}>
              ✅ Message sent successfully! We'll review it soon.
            </div>
          )}
        </form>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', color: '#ccc' }}>
        <h3 style={{ color: '#39FF14', marginBottom: '20px', fontSize: '20px' }}>Other Ways to Reach Us</h3>
        <p style={{ marginBottom: '10px' }}>📧 <a href="mailto:shashankdumpala6@gmail.com" style={{ color: '#39FF14', textDecoration: 'none' }}>shashankdumpala6@gmail.com</a></p>
        <p>🐙 <a href="https://github.com/shashank6-alt/Vaarush" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14', textDecoration: 'none' }}>github.com/shashank6-alt/Vaarush</a></p>
      </div>
    </div>
  );
};

// ========================================
// LOADING SPINNER COMPONENT
// ========================================
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...' 
}) => {
  const spinnerSizes = {
    small: { width: '30px', height: '30px', borderWidth: '3px' },
    medium: { width: '50px', height: '50px', borderWidth: '4px' },
    large: { width: '80px', height: '80px', borderWidth: '6px' }
  };

  const spinnerStyle = {
    ...spinnerSizes[size],
    border: `${spinnerSizes[size].borderWidth} solid #1a1f3a`,
    borderTop: `${spinnerSizes[size].borderWidth} solid #39FF14`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  };

  return (
    <div className="loading-spinner-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '40px'
    }}>
      <div style={spinnerStyle}></div>
      {text && (
        <p style={{
          color: '#39FF14',
          fontSize: size === 'large' ? '20px' : '16px',
          fontWeight: '600',
          textAlign: 'center',
          margin: 0,
          textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

// ========================================
// ERROR BOUNDARY COMPONENT
// ========================================
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// ========================================
// ERROR FALLBACK COMPONENT
// ========================================
interface ErrorFallbackProps {
  error: Error | null;
  resetError?: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const handleReset = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0e27',
      padding: '40px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        background: '#1a1f3a',
        padding: '60px 40px',
        borderRadius: '20px',
        border: '2px solid #ff4c4c',
        boxShadow: '0 8px 40px rgba(255, 76, 76, 0.2)'
      }}>
        <div style={{
          fontSize: '72px',
          marginBottom: '20px'
        }}>⚠️</div>
        
        <h1 style={{
          fontSize: '36px',
          color: '#ff4c4c',
          marginBottom: '20px',
          fontWeight: '800'
        }}>
          Oops! Something went wrong
        </h1>
        
        <p style={{
          fontSize: '18px',
          color: '#cccccc',
          marginBottom: '40px',
          lineHeight: '1.6'
        }}>
          {error?.message || 'An unexpected error occurred while loading Vaarush.'}
        </p>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleReset}
            style={{
              background: '#39FF14',
              color: '#0a0e27',
              border: 'none',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            🔄 Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            style={{
              background: 'transparent',
              color: '#39FF14',
              border: '2px solid #39FF14',
              padding: '15px 30px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================
// SCROLL TO TOP COMPONENT
// ========================================
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

// ========================================
// 404 NOT FOUND PAGE
// ========================================
const NotFoundPage: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    padding: '40px'
  }}>
    <div>
      <h1 style={{
        fontSize: '120px',
        fontWeight: '900',
        color: '#39FF14',
        textShadow: '0 0 50px rgba(57, 255, 20, 0.5)',
        marginBottom: '20px',
        lineHeight: '1'
      }}>
        404
      </h1>
      <p style={{
        fontSize: '24px',
        color: '#cccccc',
        marginBottom: '40px'
      }}>
        Page not found
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{
          background: '#39FF14',
          color: '#0a0e27',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        🏠 Go Home
      </button>
    </div>
  </div>
);

// ========================================
// APP STATE INTERFACE
// ========================================
interface AppState {
  walletConnected: boolean;
  walletAddress: string;
  loading: boolean;
  error: string | null;
  backendConnected: boolean;
}

// ========================================
// MAIN APP COMPONENT
// ========================================
const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    walletConnected: false,
    walletAddress: '',
    loading: true,
    error: null,
    backendConnected: false
  });

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 Initializing Vaarush App...');
      
      try {
        // Check for saved wallet
        const savedAddress = localStorage.getItem('vaarush_wallet');
        if (savedAddress) {
          console.log('💾 Found saved wallet:', savedAddress.slice(0, 10) + '...');
          setState(prev => ({
            ...prev,
            walletConnected: true,
            walletAddress: savedAddress
          }));
        }

        // Check backend health
        try {
          const response = await fetch('http://localhost:8000/health', {
            method: 'GET'
          } as any);
          
          if (response?.ok) {
            console.log('✅ Backend connected successfully');
            setState(prev => ({ ...prev, backendConnected: true }));
          }
        } catch (backendError) {
          console.warn('⚠️ Backend not available, running in demo mode');
          setState(prev => ({ ...prev, backendConnected: false }));
        }

        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('✅ App initialization complete');
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
        setState(prev => ({ 
          ...prev, 
          error: `Failed to initialize app: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }));
      } finally {
        setTimeout(() => {
          setState(prev => ({ ...prev, loading: false }));
        }, 500);
      }
    };

    initializeApp();
  }, []);

  // Wallet connection handler
  const handleWalletConnect = async () => {
    try {
      console.log('🔗 Connecting wallet...');
      
      // Fallback to demo mode
      const demoAddress = 'RQZKSEKU2YFRVZHZYQPXOZI57LXWA67XTUUCULPAV23H4Q0Q6365CYIHII';
      setState(prev => ({
        ...prev,
        walletConnected: true,
        walletAddress: demoAddress
      }));
      localStorage.setItem('vaarush_wallet', demoAddress);
      console.log('✅ Demo wallet connected');
      
      alert('🎉 Wallet Connected Successfully! (Demo Mode)');
      
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      alert('❌ Failed to connect wallet. Please try again.');
    }
  };

  // Handle navigation
  const handleNavigation = (page: string) => {
    console.log('📱 Navigating to:', page);
  };

  // Clear error handler
  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Show loading screen
  if (state.loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0e27',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner 
          size="large" 
          text="🔐 Loading Vaarush Platform..." 
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <ScrollToTop />
          
          {/* Global Error Banner */}
          {state.error && (
            <div style={{
              background: '#ff4c4c',
              color: 'white',
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '14px',
              fontWeight: '600',
              zIndex: 10000
            }}>
              <span>⚠️ {state.error}</span>
              <button 
                onClick={clearError}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '0 5px'
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Backend Status Indicator */}
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: state.backendConnected ? '#39FF14' : '#ff4c4c',
            color: state.backendConnected ? '#0a0e27' : 'white',
            padding: '5px 10px',
            borderRadius: '15px',
            fontSize: '12px',
            fontWeight: '600',
            zIndex: 9999,
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            {state.backendConnected ? '🟢 API Connected' : '🔴 Demo Mode'}
          </div>

          {/* Header */}
          <Header
            walletConnected={state.walletConnected}
            walletAddress={state.walletAddress}
            onConnect={handleWalletConnect}
            onNavigate={handleNavigation}
          />

          {/* Main Content */}
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/create" element={<CreateWillPage />} />
                <Route path="/create-will" element={<Navigate to="/create" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/docs" element={<DocsPageInline />} />
                <Route path="/support" element={<SupportPageInline />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer */}
          <Footer />

          {/* AI Assistant - Always Available */}
          <AIAssistant />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
