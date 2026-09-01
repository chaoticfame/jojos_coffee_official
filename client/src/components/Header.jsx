import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header({ currentView, setCurrentView }) {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigateTo = (view, extraParams = null) => {
    setCurrentView(view, extraParams);
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a 
          className="brand" 
          href="#home" 
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
        >
          <img src="assets/jojo.png" alt="JoJo's logo" className="logo-small" />
          <div className="brand-text">
            <span className="brand-top">JoJo's</span>
            <span className="brand-sub">Bizarre <strong>COFFEE</strong></span>
          </div>
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

            {user ? (
              <li className={`nav-user ${userDropdownOpen ? 'open' : ''}`}>
                <button 
                  type="button" 
                  className="nav-user-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  Welcome, {user.username}
                  <span className="nav-user-caret">▾</span>
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
                          My Cart
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
                  <li>
                    <a 
                      href="#logout" 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        logout(); 
                        navigateTo('home'); 
                      }}
                    >
                      Logout
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
