import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Menu({ onNavigate }) {
  const { user } = useAuth();
  const { addToCart, count } = useCart();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const [cats, menuData] = await Promise.all([
          api.getCategories(),
          api.getMenu(activeCategory, searchQuery)
        ]);
        setCategories(cats || []);
        setItems(menuData || []);
      } catch (err) {
        console.error('Failed to load menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, [activeCategory, searchQuery]);

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }));
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      alert('Please sign in to place items in your Stand!');
      onNavigate('login');
      return;
    }

    const size = selectedSizes[item.id] || '16oz';

    try {
      await addToCart(item.id, size, 1);
      setToastMessage(`✨ Added "${item.name}" (${size}) to your Stand!`);
      setTimeout(() => setToastMessage(null), 3200);
    } catch (err) {
      alert(err.message || 'Failed to add item');
    }
  };

  // Group items by category
  const itemsByCategory = items.reduce((acc, it) => {
    const cat = it.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(it);
    return acc;
  }, {});

  return (
    <section className="menu-layer">
      <div className="container menu-content-wrapper">
        
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#1a0826',
            color: '#fbbf24',
            border: '2px solid #fbbf24',
            fontWeight: '700',
            padding: '14px 24px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span>{toastMessage}</span>
            <button
              onClick={() => onNavigate('user-dashboard', { tab: 'cart' })}
              style={{
                background: '#fbbf24',
                color: '#1a0826',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '8px',
                fontWeight: '800',
                cursor: 'pointer'
              }}
            >
              View Cart ({count})
            </button>
          </div>
        )}

        {/* Menu Header */}
        <div className="menu-header">
          <span className="menacing-stamp" style={{ marginBottom: '12px' }}>杜王町 · 名物メニュー</span>
          <h3 className="section-title">
            Our <span className="text-highlight">Legendary Menu</span>
          </h3>
          <p className="menu-intro">
            Taste the adventure with our Stand-infused delicacies — from Stardust cold brews to Golden Wind Italian espressos and restorative croffles.
          </p>

          {/* Search Bar */}
          <div style={{ marginTop: '24px', maxWidth: '420px', margin: '24px auto 0', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search Stand brews, croffles, pasta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px 12px 42px',
                borderRadius: '30px',
                background: 'rgba(19, 9, 36, 0.9)',
                border: '1px solid var(--border-card)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="filters">
          <div className="filter-group">
            <button
              className={`pill ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All Stand Treats
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Catalog */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Summoning Stand Brews...</p>
          </div>
        ) : Object.keys(itemsByCategory).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem' }}>No menacing items found for "{searchQuery || activeCategory}".</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              style={{ marginTop: '12px', padding: '8px 18px', borderRadius: '8px', background: 'var(--gold-light)', color: '#1a0826', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="menu-grid-container">
            {Object.entries(itemsByCategory).map(([cat, catItems]) => (
              <div key={cat} className="category-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <h4 className="category-title" style={{ margin: 0, border: 'none', padding: 0 }}>{cat}</h4>
                  <span className="menacing-stamp" style={{ fontSize: '0.75rem' }}>{catItems.length} items</span>
                </div>

                <div className="items-grid">
                  {catItems.map((it) => {
                    const isJoestarBlend = cat === 'Joestar Blends';
                    const isMixedHamon = cat === 'Mixed Hamon';
                    const hasSizes = isJoestarBlend || isMixedHamon;

                    const price16 = isJoestarBlend ? 159.0 : isMixedHamon ? 139.0 : Number(it.price);
                    const price22 = isJoestarBlend ? 179.0 : isMixedHamon ? 159.0 : 0.0;
                    const curSize = selectedSizes[it.id] || '16oz';
                    const curDisplayPrice = (hasSizes && curSize === '22oz') ? price22 : price16;

                    return (
                      <div key={it.id} className="menu-item-card">
                        
                        <div className="item-header">
                          <h5 className="item-name">{it.name}</h5>
                          <span className="item-price">
                            ₱{curDisplayPrice.toFixed(2)}
                          </span>
                        </div>

                        {it.description && (
                          <p className="item-desc">{it.description}</p>
                        )}

                        {hasSizes && (
                          <div className="item-size-row">
                            <label className="item-size-label">Cup Size:</label>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleSizeChange(it.id, '16oz')}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  border: curSize === '16oz' ? '1px solid var(--gold-light)' : '1px solid var(--border-card)',
                                  background: curSize === '16oz' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                                  color: curSize === '16oz' ? 'var(--gold-light)' : 'var(--text-dim)'
                                }}
                              >
                                16oz (₱{price16.toFixed(0)})
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSizeChange(it.id, '22oz')}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  border: curSize === '22oz' ? '1px solid var(--gold-light)' : '1px solid var(--border-card)',
                                  background: curSize === '22oz' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
                                  color: curSize === '22oz' ? 'var(--gold-light)' : 'var(--text-dim)'
                                }}
                              >
                                22oz (₱{price22.toFixed(0)})
                              </button>
                            </div>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                          <button
                            type="button"
                            className="btn-add"
                            onClick={() => handleAddToCart(it)}
                            style={{ width: '100%' }}
                          >
                            + Add to Stand
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
