import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Our Payment System</h1>
        <p className="subtitle">Secure, Fast, and Reliable Payment Processing</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>🌟 Our Mission</h2>
          <p>
            We're dedicated to providing seamless and secure payment experiences
            for our customers. Our payment system is built with cutting-edge
            technology to ensure your transactions are safe, fast, and reliable.
          </p>
        </section>

        <section className="about-section">
          <h2>🛡️ Security Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Bank-Level Encryption</h3>
              <p>All transactions are protected with 256-bit SSL encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Fraud Detection</h3>
              <p>Advanced AI-powered fraud prevention systems</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>PCI DSS Compliant</h3>
              <p>Fully compliant with payment card industry standards</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Tokenization</h3>
              <p>Card details are tokenized for maximum security</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>💳 Supported Payment Methods</h2>
          <ul className="payment-methods-list">
            <li>💳 All major credit and debit cards (Visa, MasterCard, American Express, Discover)</li>
            <li>🔗 PayPal integration</li>
            <li>🍎 Apple Pay</li>
            <li>📱 Google Pay</li>
            <li>🏦 Direct bank transfers</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>⚡ How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Select Payment Method</h3>
              <p>Choose from our secure payment options</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Enter Details</h3>
              <p>Securely enter your payment information</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Confirm & Pay</h3>
              <p>Review and confirm your payment</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Instant Confirmation</h3>
              <p>Receive immediate payment confirmation</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>📞 Need Help?</h2>
          <div className="contact-info">
            <p>Our support team is available 24/7 to assist you:</p>
            <div className="contact-details">
              <p>📧 Email: hesolenterprises@gmail.com</p>
              <p>📞 Phone: 0717930932</p>
              <p>💬 Live Chat: Available on our website</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;