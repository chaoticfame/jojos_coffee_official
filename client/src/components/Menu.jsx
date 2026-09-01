import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Menu({ onNavigate }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        setLoading(true);
        const [cats, menuData] = await Promise.all([
          api.getCategories(),
          api.getMenu(activeCategory, '')
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
  }, [activeCategory]);

  const handleSizeChange = (itemId, size) => {
    setSelectedSizes(prev => ({ ...prev, [itemId]: size }));
  };

  const handleAddToCart = async (item) => {
    if (!user) {
      alert('Please sign in to add items to your cart!');
      onNavigate('login');
      return;
    }

    const size = selectedSizes[item.id] || '16oz';

    try {
      await addToCart(item.id, size, 1);
      setToastMessage(`✓ Added "${item.name}" to your order!`);
      setTimeout(() => setToastMessage(null), 3000);
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
      <div className="menu-overlay-gradient"></div>
      <div className="container menu-content-wrapper">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: 'var(--accent-yellow)',
            color: '#1e1032',
            fontWeight: 'bold',
            padding: '14px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            zIndex: 9999
          }}>
            {toastMessage}
          </div>
        )}

        <div className="menu-header">
          <h3 className="section-title reveal-on-scroll is-visible">
            Our <span className="text-highlight">Legendary Menu</span>
          </h3>
          <p className="menu-intro reveal-on-scroll is-visible">
            Taste the adventure with our Stand-infused delicacies. From Stardust brews to Diamond-unbreakable croffles.
          </p>
        </div>

        <div className="filters reveal-on-scroll is-visible">
          <div className="filter-group">
            <button
              className={`pill ${activeCategory === 'All' ? 'active' : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All
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

        {loading ? (
          <div className="empty-box reveal-on-scroll is-visible">
            Loading menu items...
          </div>
        ) : Object.keys(itemsByCategory).length === 0 ? (
          <div className="empty-box reveal-on-scroll is-visible">
            No items found in this category.
          </div>
        ) : (
          <div className="menu-grid-container">
            {Object.entries(itemsByCategory).map(([cat, catItems]) => (
              <div key={cat} className="category-section">
                <h4 className="category-title reveal-on-scroll is-visible">{cat}</h4>
                <div className="items-grid">
                  {catItems.map((it) => {
                    const isJoestarBlend = cat === 'Joestar Blends';
                    const isMixedHamon = cat === 'Mixed Hamon';
                    const hasSizes = isJoestarBlend || isMixedHamon;

                    const price16 = isJoestarBlend ? 159.0 : isMixedHamon ? 139.0 : Number(it.price);
                    const price22 = isJoestarBlend ? 179.0 : isMixedHamon ? 159.0 : 0.0;
                    const curSize = selectedSizes[it.id] || '16oz';

                    return (
                      <div key={it.id} className="menu-item-card reveal-on-scroll is-visible">
                        <div className="item-header">
                          <h5 className="item-name">{it.name}</h5>
                          {hasSizes ? (
                            <span className="item-price">
                              16oz ₱{price16.toFixed(2)} &nbsp;·&nbsp; 22oz ₱{price22.toFixed(2)}
                            </span>
                          ) : (
                            <span className="item-price">₱{Number(it.price).toFixed(2)}</span>
                          )}
                        </div>

                        {it.description && (
                          <p className="item-desc">{it.description}</p>
                        )}

                        {hasSizes && (
                          <div className="item-size-row">
                            <label className="item-size-label" htmlFor={`size-${it.id}`}>Size</label>
                            <select
                              id={`size-${it.id}`}
                              className="item-size-select"
                              value={curSize}
                              onChange={(e) => handleSizeChange(it.id, e.target.value)}
                            >
                              <option value="16oz">16oz — ₱{price16.toFixed(2)}</option>
                              <option value="22oz">22oz — ₱{price22.toFixed(2)}</option>
                            </select>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 'auto', width: '100%' }}>
                          <button
                            type="button"
                            className="btn-add add-to-cart-btn"
                            onClick={() => handleAddToCart(it)}
                          >
                            Add to Order
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
