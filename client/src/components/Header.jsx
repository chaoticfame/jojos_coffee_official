import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ currentView, setCurrentView }) {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (view, extraParams = null) => {
    setCurrentView(view, extraParams);
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <a 
          className="brand" 
          href="#home" 
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
        >
          <img src="/assets/jojo.png" alt="JoJo's logo" className="logo-small" />
          <div className="brand-text">
            <span className="brand-top">JoJo's</span>
            <span className="brand-sub">Bizarre <strong>COFFEE</strong></span>
          </div>
          <span className="menacing-stamp" style={{ marginLeft: '6px' }}>
            杜王町
          </span>
        </a>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`} id="mainNav">
          <ul>
            <li>
              <a 
                href="#home" 
                className={currentView === 'home' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#menu" 
                className={currentView === 'menu' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}
              >
                Menu
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={currentView === 'about' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigateTo('about'); }}
              >
                About JoJo
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={currentView === 'contact' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}
              >
                Contact
              </a>
            </li>

            {user ? (
              <li className={`nav-user ${userDropdownOpen ? 'open' : ''}`}>
                <button 
                  type="button" 
                  className="nav-user-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <span>Welcome, <strong>{user.username}</strong></span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>▾</span>
                </button>
                <ul className="nav-user-menu">
                  {isAdmin ? (
                    <li>
                      <a 
                        href="#admin" 
                        onClick={(e) => { e.preventDefault(); navigateTo('admin-dashboard'); }}
                      >
                        Admin Dashboard
                      </a>
                    </li>
                  ) : (
                    <>
                      <li>
                        <a 
                          href="#menu" 
                          onClick={(e) => { e.preventDefault(); navigateTo('menu'); }}
                        >
                          Order Menu
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#cart" 
                          onClick={(e) => { e.preventDefault(); navigateTo('user-dashboard', { tab: 'cart' }); }}
                        >
                          <span>My Cart</span>
                          <span className={`cart-badge ${count ? '' : 'is-empty'}`}>
                            {count}
                          </span>
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#orders" 
                          onClick={(e) => { e.preventDefault(); navigateTo('user-dashboard', { tab: 'orders' }); }}
                        >
                          Order History
                        </a>
                      </li>
                      <li>
                        <a 
                          href="#profile" 
                          onClick={(e) => { e.preventDefault(); navigateTo('user-dashboard', { tab: 'profile' }); }}
                        >
                          Profile &amp; Settings
                        </a>
                      </li>
                    </>
                  )}
                  <li style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '4px', paddingTop: '4px' }}>
                    <a 
                      href="#logout" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        logout(); 
                        navigateTo('home'); 
                      }}
                      style={{ color: '#f87171' }}
                    >
                      Sign Out
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li>
                  <a 
                    href="#register" 
                    className={currentView === 'register' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); navigateTo('register'); }}
                  >
                    Register
                  </a>
                </li>
                <li>
                  <a 
                    href="#login" 
                    className={currentView === 'login' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); navigateTo('login'); }}
                  >
                    Sign In
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>

        <button 
          className="nav-toggle" 
          id="navToggle" 
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
