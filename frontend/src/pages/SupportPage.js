import React, { useState } from 'react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, send to backend or email service
    console.log('Support request:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '80px 40px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ color: '#39FF14', fontSize: '42px', marginBottom: '20px', textAlign: 'center' }}>
         Support
      </h1>
      <p style={{ color: '#ccc', textAlign: 'center', marginBottom: '40px', fontSize: '18px' }}>
        Need help? Contact us and we'll get back to you soon!
      </p>

      <div style={{ background: '#1a1f3a', padding: '40px', borderRadius: '15px', border: '2px solid #39FF14' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0e27',
                border: '1px solid #39FF14',
                borderRadius: '8px',
                color: '#eee',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0e27',
                border: '1px solid #39FF14',
                borderRadius: '8px',
                color: '#eee',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0e27',
                border: '1px solid #39FF14',
                borderRadius: '8px',
                color: '#eee',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ color: '#39FF14', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              style={{
                width: '100%',
                padding: '12px',
                background: '#0a0e27',
                border: '1px solid #39FF14',
                borderRadius: '8px',
                color: '#eee',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              background: '#39FF14',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Send Message
          </button>

          {submitted && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#163a16',
              border: '1px solid #39FF14',
              borderRadius: '8px',
              color: '#39FF14',
              textAlign: 'center'
            }}>
               Message sent successfully! We'll get back to you soon.
            </div>
          )}
        </form>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', color: '#ccc' }}>
        <h3 style={{ color: '#39FF14', marginBottom: '20px' }}>Other Ways to Reach Us</h3>
        <p> Email: <a href="mailto:shashankdumpala6@gmail.com" style={{ color: '#39FF14' }}>shashankdumpala6@gmail.com</a></p>
        <p> GitHub: <a href="https://github.com/shashank6-alt/Vaarush" target="_blank" rel="noopener noreferrer" style={{ color: '#39FF14' }}>github.com/shashank6-alt/Vaarush</a></p>
      </div>
    </div>
  );
}
