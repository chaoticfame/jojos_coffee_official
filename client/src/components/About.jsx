import React, { useState } from 'react';

const SLIDES = [
  {
    part: 'Part 1: Phantom Blood',
    name: 'Jonathan Joestar',
    desc: 'The noble gentleman who started the Joestar legacy. A true gentleman with a heart of gold, embodying honor and chivalry. His mastery of Hamon was the first light against the darkness.',
    stats: [
      { label: 'Power', val: 'Ripple' },
      { label: 'Origin', val: 'England' }
    ],
    image: 'assets/jonathan.jpg'
  },
  {
    part: 'Part 2: Battle Tendency',
    name: 'Joseph Joestar',
    desc: 'The cunning trickster who outsmarts his enemies. Quick-witted and resourceful, known for his "Your next line is..." catchphrase. He saved the world with clackers and sheer wit.',
    stats: [
      { label: 'Power', val: 'Hamon / Hermit Purple' },
      { label: 'Origin', val: 'England / USA' }
    ],
    image: 'assets/joseph.jpg'
  },
  {
    part: 'Part 3: Stardust Crusaders',
    name: 'Jotaro Kujo',
    desc: 'The stoic Stand user with Star Platinum. Famous for his "ORA ORA ORA" battle cry and unwavering determination. He embarked on a journey to Egypt to save his mother.',
    stats: [
      { label: 'Stand', val: 'Star Platinum' },
      { label: 'Origin', val: 'Japan' }
    ],
    image: 'assets/jotaro.jpg'
  },
  {
    part: 'Part 4: Diamond is Unbreakable',
    name: 'Josuke Higashikata',
    desc: 'The friendly high schooler with Crazy Diamond. Protects his town of Morioh with his Stand\'s restoration powers. Just don\'t insult his hair!',
    stats: [
      { label: 'Stand', val: 'Crazy Diamond' },
      { label: 'Origin', val: 'Japan (Morioh)' }
    ],
    image: 'assets/josuke.jpg'
  },
  {
    part: 'Part 5: Golden Wind',
    name: 'Giorno Giovanna',
    desc: 'The ambitious gangster with Golden Experience. Dreams of becoming a "Gang-Star" to rid the city of drugs and corruption. He resolves to create a better world.',
    stats: [
      { label: 'Stand', val: 'Gold Experience' },
      { label: 'Origin', val: 'Italy' }
    ],
    image: 'assets/giorno.jpg'
  },
  {
    part: 'Part 6: Stone Ocean',
    name: 'Jolyne Cujoh',
    desc: 'The determined daughter of Jotaro. Uses Stone Free to unravel mysteries within Green Dolphin Street Prison. She fights to reclaim her father\'s stolen discs.',
    stats: [
      { label: 'Stand', val: 'Stone Free' },
      { label: 'Origin', val: 'USA' }
    ],
    image: 'assets/jolyne.jpg'
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

  return (
    <>
      {/* Story of Jolus Joestar Section */}
      <section className="story-section">
        <div className="story-overlay-gradient"></div>
        <div className="container h-100">
          <div className="story-content-wrapper">
            <div className="story-split">
              {/* Left: Images Grid */}
              <div className="story-image-col">
                <div className="story-grid-images reveal-on-scroll is-visible">
                  <div className="story-img-main">
                    <img src="assets/1.jpg" alt="Jolus Joestar's Journey" />
                  </div>
                  <div className="story-img-sub">
                    <img src="assets/9.jpg" alt="The Beginning" />
                  </div>
                  <div className="story-img-sub">
                    <img src="assets/cafeinterior2.jpg" alt="The Struggle" />
                  </div>
                </div>

                {/* Secondary grid to fill lower-left space */}
                <div className="story-grid-secondary reveal-on-scroll is-visible">
                  <div className="story-img-secondary">
                    <img src="assets/4.jpg" alt="Café celebrations" />
                  </div>
                  <div className="story-img-secondary">
                    <img src="assets/13.jpg" alt="JoJo fans enjoying coffee" />
                  </div>
                </div>
              </div>

              {/* Right: Text Content */}
              <div className="story-text-col">
                <span className="story-badge reveal-on-scroll is-visible">EST. 2025</span>
                <h2 className="story-title reveal-on-scroll is-visible">
                  THE STORY OF <br /><span className="text-highlight">JOLUS JOESTAR</span>
                </h2>
                
                <p className="story-desc reveal-on-scroll is-visible">
                  JoJo's Bizarre Coffee was born from the passion and perseverance of its founder, Bryan. A devoted fan of the series, Bryan adopted the moniker "Jolus Joestar"—a fusion of his real nickname and the legendary family name—and even bears the iconic Joestar birthmark tattoo on his back as a symbol of his fandom.
                </p>

                <p className="story-desc reveal-on-scroll is-visible">
                  Bryan describes his entrepreneurial journey as a personal battle against Dio Brando. His first business venture was fraught with dilemmas and struggles, feeling "out of date" and constantly challenged. Yet, it was this very adversity that paved the way for something new.
                </p>

                <p className="story-desc reveal-on-scroll is-visible">
                  "I think my life is connected to the family of Joestars," Bryan reflects. This connection inspired the name 'JoJo's Bizarre Coffee', creating a platform for creativity and tribute, with plans to expand into teas, honoring Josuke's love for the drink.
                </p>

                <div className="story-tags reveal-on-scroll is-visible">
                  <span className="tag-pill">Stand Power</span>
                  <span className="tag-pill">Coffee Craft</span>
                  <span className="tag-pill">Joestar Legacy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JoJo Characters Showcase (Slider) */}
      <section className="characters-section">
        <div className="container">
          <h3 className="section-title">THE LEGENDARY JOESTARS</h3>
          
          <div className="joestar-slider">
            <div className="slider-container">
              {SLIDES.map((slide, idx) => (
                <div key={idx} className={`joestar-slide ${idx === currentSlide ? 'active' : ''}`}>
                  <div className="slide-content">
                    <div className="slide-info">
                      <span className="slide-part">{slide.part}</span>
                      <h2 className="slide-name">{slide.name}</h2>
                      <div className="slide-divider"></div>
                      <p className="slide-desc">{slide.desc}</p>
                      <div className="slide-stats">
                        {slide.stats.map((st, i) => (
                          <div key={i} className="stat-box">
                            <span className="stat-label">{st.label}</span>
                            <span className="stat-val">{st.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="slide-visual">
                      <img src={slide.image} alt={slide.name} className="character-image" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="slider-controls">
              <button className="slider-btn prev-btn" aria-label="Previous Character" onClick={prevSlide}>❮</button>
              <div className="slider-indicators">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    className={`indicator ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
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

      {/* Location / Google Maps Layer */}
      <section className="map-layer">
        <div className="map-shell">
          <h3 className="map-title">FIND JOJO'S BIZARRE COFFEE</h3>
          <p className="map-subtitle">
            Visit us at 2 Homeowners Drive, Marikina City, Philippines, 1800 — tap the map to open in Google Maps.
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
