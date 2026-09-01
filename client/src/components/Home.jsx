import React from 'react';

export default function Home({ onNavigate }) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-layer">
        <div className="hero-bg" style={{ backgroundImage: "url('/assets/jojo4k3.jpg')" }}></div>
        <div className="hero-overlay-gradient"></div>
        <div className="container hero-content-wrapper">
          <div className="hero-text-col">
            <div className="hero-badge-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span className="hero-badge">WHERE EVERY SIP IS AN ADVENTURE</span>
              <span className="menacing-stamp">ゴゴゴ STAND BREWED ゴゴゴ</span>
            </div>
            <h1 className="hero-main-title">
              Experience a <br />
              <span className="text-highlight">Bizarre Brew</span>
            </h1>
            <p className="hero-description">
              Bold tastes, strange delights — welcome to Morioh's premier destination for Stand-infused artisan coffee, celestial blends, and restorative Italian pastries.
            </p>
            
            <div className="hero-features-list">
              <span className="feature-item">◆ Premium Roasted Beans</span>
              <span className="feature-item">◆ Standpowered Baristas</span>
              <span className="feature-item">◆ Speedwagon Certified</span>
            </div>

            <div className="hero-actions" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                className="btn-app-store"
                onClick={() => onNavigate('menu')}
                style={{ border: 'none' }}
              >
                <span className="small-text">Explore Stand Menu</span>
                <span className="big-text">View Full Menu ➔</span>
              </button>

              <button
                onClick={() => onNavigate('about')}
                style={{
                  padding: '14px 28px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border-card)',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                The Joestar Lore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Life at JoJo's Bizarre Coffee */}
      <section className="life-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 20px' }}>
            <span className="menacing-stamp" style={{ marginBottom: '12px' }}>杜王町の日常</span>
            <h3 className="section-title">LIFE AT JOJO'S BIZARRE COFFEE</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Step into the vibrant ambiance of our Morioh-inspired coffee sanctuary.
            </p>
          </div>

          <div className="life-grid">
            <div className="life-card">
              <img src="/assets/6.jpg" alt="Cozy Atmosphere" />
              <div className="life-caption">
                <h4>Cozy Stand Lounge</h4>
                <p>Unwind in our custom-themed sanctuary surrounded by Morioh artifacts and retro manga aesthetic.</p>
              </div>
            </div>
            <div className="life-card">
              <img src="/assets/coffee2.jpg" alt="Signature Brews" />
              <div className="life-caption">
                <h4>Hermit Purple Brews</h4>
                <p>Divined overnight cold brew with subtle purple berry undertones and restorative Hamon energy.</p>
              </div>
            </div>
            <div className="life-card">
              <img src="/assets/5.jpg" alt="Community Events" />
              <div className="life-caption">
                <h4>Stand User Nights</h4>
                <p>Join fellow enthusiasts for special tasting sessions, trivia showdowns, and anime gatherings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stand Users / Soft Opening Layer */}
      <section className="stand-layer" style={{ backgroundImage: "url('/assets/jojosoft.jpg')" }}>
        <div className="stand-overlay-gradient"></div>
        <div className="container stand-content-wrapper">
          <div className="stand-header">
            <span className="menacing-stamp" style={{ marginBottom: '12px' }}>第一章 · 開幕</span>
            <h2 className="stand-main-title">
              Make Our <span className="text-highlight">Soft Opening</span> Meaningful
            </h2>
            <p className="stand-description">
              You are an essential part of the very first chapter of JoJo's Bizarre Coffee. Help us elevate Morioh's finest café experience:
            </p>
          </div>

          <div className="stand-stats">
            <div className="stat-card">
              <span className="stat-icon">📣</span>
              <span className="stat-number">01</span>
              <span className="stat-label">Capture a photo of your brew and tag <strong>@JoJosBizarreCoffee</strong> online.</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <span className="stat-number">02</span>
              <span className="stat-label">Invite your fellow Stand users and companions for an afternoon tasting.</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-number">03</span>
              <span className="stat-label">Leave an honest review to help Tonio and the baristas refine their craft.</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">☕</span>
              <span className="stat-number">04</span>
              <span className="stat-label">Try our signature Joestar blend and tell us which Stand power it unlocks!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menacing Products */}
      <section className="featured-blends">
        <div className="container">
          <div className="featured-blends-header">
            <span className="menacing-stamp" style={{ marginBottom: '12px' }}>ドドド MENACING SELECTION ドドド</span>
            <h3 className="featured-blends-title">FEATURED MENACING CREATIONS</h3>
            <p className="featured-blends-subtitle">
              Roasted in small batches and crafted with precision inspired by legendary anime stands.
            </p>
          </div>
          
          <div className="featured-blends-grid">
            <article className="featured-card">
              <div className="featured-card-image">
                <img src="/assets/1.jpg" alt="Biscoff Coffee" />
              </div>
              <div className="featured-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 className="featured-card-name">Biscoff Coffee</h4>
                  <span className="featured-card-price">₱179.00</span>
                </div>
                <p className="featured-card-origin">Layered espresso with authentic Lotus Biscoff syrup and spiced caramel biscuit rim.</p>
                <button 
                  onClick={() => onNavigate('menu')}
                  className="btn-add" 
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Order Now ➔
                </button>
              </div>
            </article>

            <article className="featured-card">
              <div className="featured-card-image">
                <img src="/assets/9.jpg" alt="Choco Dio Croffle" />
              </div>
              <div className="featured-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 className="featured-card-name">Choco Dio Croffle</h4>
                  <span className="featured-card-price">₱179.00</span>
                </div>
                <p className="featured-card-origin">Warm butter-pressed croissant waffle coated in dark Belgian cocoa and Nutella drizzle.</p>
                <button 
                  onClick={() => onNavigate('menu')}
                  className="btn-add" 
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Order Now ➔
                </button>
              </div>
            </article>

            <article className="featured-card">
              <div className="featured-card-image">
                <img src="/assets/tonio's blend.jpg" alt="Tonio's Blend" />
              </div>
              <div className="featured-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 className="featured-card-name">Tonio's Special Blend</h4>
                  <span className="featured-card-price">₱159.00</span>
                </div>
                <p className="featured-card-origin">Italian espresso blend with stonefruit acidity and delicate chocolate finish that cures fatigue.</p>
                <button 
                  onClick={() => onNavigate('menu')}
                  className="btn-add" 
                  style={{ width: '100%', marginTop: '10px' }}
                >
                  Order Now ➔
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
