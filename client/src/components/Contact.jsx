import React from 'react';

export default function Contact() {
  return (
    <section className="contact-section" style={{ paddingTop: '8rem', paddingBottom: '80px' }}>
      <div className="container">
        <h3 className="section-title">Contact Us</h3>
        
        <div className="login-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '20px', color: 'var(--accent-yellow)' }}>Get in Touch</h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#fff' }}>
              Have questions? Want to place an order? We'd love to hear from you!
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '30px' }}>
            <div>
              <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-yellow)' }}>Email</strong>
              <a href="mailto:Brunobrian05@gmail.com" style={{ color: 'var(--pink)', textDecoration: 'none', fontSize: '1.1rem' }}>
                Brunobrian05@gmail.com
              </a>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-yellow)' }}>Phone</strong>
              <a href="tel:09275041084" style={{ color: 'var(--pink)', textDecoration: 'none', fontSize: '1.1rem' }}>
                09275041084
              </a>
            </div>

            <div>
              <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-yellow)' }}>Address</strong>
              <p style={{ margin: 0, color: '#fff', fontSize: '1.1rem' }}>
                2 Homeowners Drive<br />
                Sto Nino Marikina
              </p>
            </div>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '20px', color: 'var(--accent-yellow)' }}>Opening Hours</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px', display: 'inline-block', minWidth: '300px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ margin: '8px 0', color: '#fff' }}><strong>Monday - Friday:</strong> 7:00 AM - 9:00 PM</p>
              <p style={{ margin: '8px 0', color: '#fff' }}><strong>Saturday:</strong> 8:00 AM - 10:00 PM</p>
              <p style={{ margin: '8px 0', color: '#fff' }}><strong>Sunday:</strong> 9:00 AM - 8:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
