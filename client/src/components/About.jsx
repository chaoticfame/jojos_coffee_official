import React, { useState } from 'react';

const SLIDES = [
  {
    part: 'Part 1: Phantom Blood',
    jpPart: 'ファントムブラッド',
    name: 'Jonathan Joestar',
    quote: '"I will not lose! My heart is singing with Hamon!"',
    desc: 'The noble gentleman who started the Joestar legacy. Embodying chivalry, honor, and courage, his mastery of Sunlight Yellow Overdrive was humanity\'s first shield against the undead.',
    stats: [
      { label: 'Technique', val: 'Sunlight Ripple' },
      { label: 'Origin', val: 'England' },
      { label: 'Birthmark', val: '★ Star (Nape)' }
    ],
    image: '/assets/jonathan.jpg'
  },
  {
    part: 'Part 2: Battle Tendency',
    jpPart: '戦闘潮流',
    name: 'Joseph Joestar',
    quote: '"Your next line is: \'How did you know?!\'"',
    desc: 'The cunning trickster who outsmarts ultimate beings with clackers, psychological warfare, and Hamon. Known for turning defeat into victory with sheer wit.',
    stats: [
      { label: 'Ability', val: 'Hermit Purple' },
      { label: 'Origin', val: 'England / USA' },
      { label: 'Catchphrase', val: 'Next Line...' }
    ],
    image: '/assets/joseph.jpg'
  },
  {
    part: 'Part 3: Stardust Crusaders',
    jpPart: 'スターダストクルセイダース',
    name: 'Jotaro Kujo',
    quote: '"Good grief... (やれやれだぜ)"',
    desc: 'The stoic high schooler wielding Star Platinum — the supreme Stand with unmatched velocity, lethal precision, and the ability to stop time itself.',
    stats: [
      { label: 'Stand', val: 'Star Platinum' },
      { label: 'Origin', val: 'Japan' },
      { label: 'Battle Cry', val: 'ORA ORA ORA' }
    ],
    image: '/assets/jotaro.jpg'
  },
  {
    part: 'Part 4: Diamond is Unbreakable',
    jpPart: 'ダイヤモンドは砕けない',
    name: 'Josuke Higashikata',
    quote: '"Great-o daze! (グレートですよ、こいつは！)"',
    desc: 'Morioh\'s warm-hearted protector wielding Crazy Diamond. Capable of instantly repairing shattered objects and healing mortal wounds with tender speed.',
    stats: [
      { label: 'Stand', val: 'Crazy Diamond' },
      { label: 'Origin', val: 'Morioh, Japan' },
      { label: 'Battle Cry', val: 'DORA RA RA' }
    ],
    image: '/assets/josuke.jpg'
  },
  {
    part: 'Part 5: Golden Wind',
    jpPart: '黄金の風',
    name: 'Giorno Giovanna',
    quote: '"I, Giorno Giovanna, have a dream."',
    desc: 'The golden-hearted strategist of Passione wielding Gold Experience. Resolves to breathe life into inert objects and lead his companions to true justice.',
    stats: [
      { label: 'Stand', val: 'Gold Experience' },
      { label: 'Origin', val: 'Italy' },
      { label: 'Battle Cry', val: 'MUDA MUDA' }
    ],
    image: '/assets/giorno.jpg'
  },
  {
    part: 'Part 6: Stone Ocean',
    jpPart: 'ストーンオーシャン',
    name: 'Jolyne Cujoh',
    quote: '"Yare Yare Dawa... Free me from this ocean."',
    desc: 'The resilient daughter of Jotaro wielding Stone Free. Unravels her body into razor-sharp strings to solve the darkest conspiracies of Green Dolphin Prison.',
    stats: [
      { label: 'Stand', val: 'Stone Free' },
      { label: 'Origin', val: 'USA' },
      { label: 'Battle Cry', val: 'ORA ORA ORA' }
    ],
    image: '/assets/jolyne.jpg'
  }
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const currentJoestar = SLIDES[currentSlide];

  return (
    <>
      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-split">
            {/* Left: Visual Mosaic */}
            <div className="story-image-col">
              <div className="story-grid-images">
                <div className="story-img-main">
                  <img src="/assets/1.jpg" alt="Jolus Joestar Journey" />
                </div>
                <div className="story-img-sub">
                  <img src="/assets/9.jpg" alt="Artisan Pastries" />
                </div>
                <div className="story-img-sub">
                  <img src="/assets/cafeinterior2.jpg" alt="Cafe Interior" />
                </div>
              </div>

              <div className="story-grid-secondary">
                <div className="story-img-secondary">
                  <img src="/assets/4.jpg" alt="Cafe Celebrations" />
                </div>
                <div className="story-img-secondary">
                  <img src="/assets/13.jpg" alt="Stand Users Enjoying Coffee" />
                </div>
              </div>
            </div>

            {/* Right: Editorial Story */}
            <div className="story-text-col">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                <span className="story-badge">EST. 2025</span>
                <span className="menacing-stamp">ジョルスの物語</span>
              </div>

              <h2 className="story-title">
                THE STORY OF <br />
                <span className="text-highlight">JOLUS JOESTAR</span>
              </h2>
              
              <p className="story-desc">
                JoJo's Bizarre Coffee was born from the passion and perseverance of its founder, <strong>Bryan</strong>. A lifelong devotee of the series, Bryan adopted the moniker <em>"Jolus Joestar"</em> — a fusion of his nickname and the legendary lineage — proudly bearing the iconic Joestar birthmark tattoo on his back.
              </p>

              <p className="story-desc">
                Bryan describes his entrepreneurial journey as a personal duel against Dio Brando. His first business venture faced fierce challenges and setbacks, yet that adversity forged the foundation for something extraordinary.
              </p>

              <div style={{
                margin: '20px 0',
                color: 'var(--gold-light)',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid var(--gold-border)',
                padding: '16px 20px',
                borderRadius: '14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}>
                <span style={{ fontSize: '1.4rem', marginRight: '6px', opacity: 0.8 }}>“</span>
                I believe our lives are intertwined with the spirit of the Joestars — facing adversity with courage, creativity, and a great cup of coffee.
                <span style={{ fontSize: '1.4rem', marginLeft: '6px', opacity: 0.8 }}>”</span>
              </div>

              <div className="story-tags">
                <span className="tag-pill">⚡ Stand Power</span>
                <span className="tag-pill">☕ Artisan Roasts</span>
                <span className="tag-pill">★ Joestar Legacy</span>
                <span className="tag-pill">🇮🇹 Tonio's Recipes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Legendary Joestars Showcase */}
      <section className="characters-section">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 30px' }}>
            <span className="menacing-stamp" style={{ marginBottom: '10px' }}>歴代ジョースター家</span>
            <h3 className="section-title">THE LEGENDARY JOESTARS</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Meet the six generations who inspired our signature Stand blends.
            </p>
          </div>
          
          <div className="joestar-slider">
            <div className="joestar-slide active">
              <div className="slide-content">
                <div className="slide-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="slide-part">{currentJoestar.part}</span>
                    <span className="menacing-stamp" style={{ fontSize: '0.75rem' }}>{currentJoestar.jpPart}</span>
                  </div>

                  <h2 className="slide-name">{currentJoestar.name}</h2>
                  <div className="slide-divider"></div>

                  <p style={{ color: 'var(--gold-light)', fontStyle: 'italic', fontSize: '0.95rem', marginBottom: '14px' }}>
                    {currentJoestar.quote}
                  </p>

                  <p className="slide-desc">{currentJoestar.desc}</p>

                  <div className="slide-stats">
                    {currentJoestar.stats.map((st, i) => (
                      <div key={i} className="stat-box">
                        <span className="stat-label">{st.label}</span>
                        <span className="stat-val">{st.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="slide-visual">
                  <img src={currentJoestar.image} alt={currentJoestar.name} className="character-image" />
                </div>
              </div>
            </div>

            {/* Slider Navigation */}
            <div className="slider-controls">
              <button className="slider-btn prev-btn" aria-label="Previous Character" onClick={prevSlide}>❮</button>
              <div className="slider-indicators">
                {SLIDES.map((slide, idx) => (
                  <button
                    key={idx}
                    className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                    title={slide.name}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button className="slider-btn next-btn" aria-label="Next Character" onClick={nextSlide}>❯</button>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section className="map-layer">
        <div className="map-shell">
          <span className="menacing-stamp" style={{ marginBottom: '10px' }}>店舗案内 · 杜王町</span>
          <h3 className="map-title">FIND JOJO'S BIZARRE COFFEE</h3>
          <p className="map-subtitle">
            2 Homeowners Drive, Marikina City, Philippines, 1800 — Open Daily: 12:00 PM – 10:00 PM
          </p>
          <div className="map-card">
            <iframe
              title="JoJo's Bizarre Coffee Location"
              src="https://www.google.com/maps?q=2+Homeowners+Drive,+Marikina+City,+Philippines,+1800&output=embed"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>
      </section>
    </>
  );
}
