import React from 'react';

export default function Contact() {
  return (
    <section className="contact-section" style={{ paddingTop: '6rem', paddingBottom: '80px' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="menacing-stamp" style={{ marginBottom: '10px' }}>お問い合わせ</span>
          <h3 className="section-title">Get in Touch</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Have questions, catering requests, or feedback for Tonio's kitchen? Reach out to us anytime.
          </p>
        </div>
        
        <div className="login-card" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', marginBottom: '35px' }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-card)' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--gold-light)', fontSize: '1.1rem' }}>✉️ Email</strong>
              <a href="mailto:Brunobrian05@gmail.com" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem' }}>
                Brunobrian05@gmail.com
              </a>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-card)' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--gold-light)', fontSize: '1.1rem' }}>📞 Phone &amp; Orders</strong>
              <a href="tel:09275041084" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem' }}>
                0927 504 1084
              </a>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border-card)' }}>
              <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--gold-light)', fontSize: '1.1rem' }}>📍 Address</strong>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.4' }}>
                2 Homeowners Drive, Sto Nino, Marikina City, 1800
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '16px', color: 'var(--gold-light)', fontSize: '1.2rem' }}>🕒 Grand Café Hours</h4>
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '20px 30px', borderRadius: '16px', display: 'inline-grid', gap: '10px', minWidth: '320px', border: '1px solid var(--border-card)', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Monday – Friday:</span>
                <strong>7:00 AM – 9:00 PM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Saturday:</span>
                <strong>8:00 AM – 10:00 PM</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Sunday:</span>
                <strong>9:00 AM – 8:00 PM</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
