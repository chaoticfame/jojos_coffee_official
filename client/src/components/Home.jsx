import React from 'react';

export default function Home({ onNavigate }) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-layer">
        <div className="hero-bg" style={{ backgroundImage: "url('assets/jojo4k3.jpg')" }}></div>
        <div className="hero-overlay-gradient"></div>
        <div className="container hero-content-wrapper">
          <div className="hero-text-col">
            <div className="hero-badge-wrapper">
              <span className="hero-badge">WHERE EVERY SIP IS AN ADVENTURE</span>
            </div>
            <h1 className="hero-main-title">
              Experience a <br />
              <span className="text-highlight">Bizarre Brew</span>
            </h1>
            <p className="hero-description">
              Bold tastes, strange delights — welcome to JoJo's Bizarre Coffee. 
              Experience the future of coffee crafting with our Stand-powered blends.
            </p>
            
            <div className="hero-features-list">
              <span className="feature-item">● Premium Coffee</span>
              <span className="feature-item">● Standpowered Staff</span>
              <span className="feature-item">● Community-Driven</span>
            </div>

            <div className="hero-actions">
              <a 
                href="#menu" 
                className="btn-app-store"
                onClick={(e) => { e.preventDefault(); onNavigate('menu'); }}
              >
                <span className="small-text">View Our</span>
                <span className="big-text">Full Menu</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Life at JoJo's Bizarre Coffee */}
      <section className="life-section">
        <div className="container">
          <h3 className="section-title">LIFE AT JOJO'S BIZARRE COFFEE</h3>

          <div className="life-grid">
            <div className="life-card">
              <img src="assets/6.jpg" alt="Life at JoJo's" />
              <div className="life-caption">
                <h4>Cozy Atmosphere</h4>
                <p>Relax in our Stand-themed lounge</p>
              </div>
            </div>
            <div className="life-card">
              <img src="assets/coffee2.jpg" alt="Life at JoJo's" />
              <div className="life-caption">
                <h4>Signature Brews</h4>
                <p>Experience flavors from across the multiverse</p>
              </div>
            </div>
            <div className="life-card">
              <img src="assets/5.jpg" alt="Life at JoJo's" />
              <div className="life-caption">
                <h4>Community Events</h4>
                <p>Join fellow Stand users for special nights</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stand Users / Stats Layer */}
      <section className="stand-layer" style={{ backgroundImage: "url('assets/jojosoft.jpg')" }}>
        <div className="stand-overlay-gradient"></div>
        <div className="container stand-content-wrapper">
          <div className="stand-header">
            <h2 className="stand-main-title">
              Make Our <span className="text-highlight">Soft Opening</span> Meaningful
            </h2>
            <p className="stand-description">
              You are part of the very first chapter of JoJo's Bizarre Coffee. Help us power up this soft opening by spreading the word,
              bringing your friends, and sharing your Stand-worthy coffee moments online.
            </p>
          </div>

          <div className="stand-stats">
            <div className="stat-card">
              <span className="stat-icon">📣</span>
              <span className="stat-number">01</span>
              <span className="stat-label">Share a photo or story and tag JoJo's Bizarre Coffee.</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👥</span>
              <span className="stat-number">02</span>
              <span className="stat-label">Invite a friend or family member to visit during the soft opening.</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-number">03</span>
              <span className="stat-label">Leave a kind review or reaction on our Facebook page.</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">☕</span>
              <span className="stat-number">04</span>
              <span className="stat-label">Try a signature drink and tell us what Stand it reminds you of.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coffee Blends */}
      <section className="featured-blends">
        <div className="container">
          <div className="featured-blends-header">
            <h3 className="featured-blends-title">FEATURED MENACING PRODUCTS</h3>
            <p className="featured-blends-subtitle">
              Our latest coffee and pastry creations, roasted in small batches and inspired by vibrant anime worlds.
            </p>
          </div>
          <div className="featured-blends-grid">
            <article className="featured-card">
              <div className="featured-card-image">
                <img src="assets/coffee.jpg" alt="Featured coffee blend one" />
              </div>
              <div className="featured-card-body">
                <h4 className="featured-card-name">Biscoff Coffee</h4>
                <p className="featured-card-origin">Caramel sweetness with bright citrus and cacao nib.</p>
                <p className="featured-card-price">₱179.00</p>
              </div>
            </article>
            <article className="featured-card">
              <div className="featured-card-image">
                <img src="assets/coffee1.jpg" alt="Featured coffee blend two" />
              </div>
              <div className="featured-card-body">
                <h4 className="featured-card-name">Black Forest Croffle</h4>
                <p className="featured-card-origin">Whipped Cream, Chocolate Syrup, and Chocolate Sprinkles</p>
                <p className="featured-card-price">₱169.00</p>
              </div>
            </article>
            <article className="featured-card">
              <div className="featured-card-image">
                <img src="assets/tonio's blend.jpg" alt="Featured coffee blend three" />
              </div>
              <div className="featured-card-body">
                <h4 className="featured-card-name">Tonio's Blend</h4>
                <p className="featured-card-origin">Stonefruit acidity layered over chocolate sweetness.</p>
                <p className="featured-card-price">₱159.00</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
