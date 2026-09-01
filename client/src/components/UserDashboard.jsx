import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const STANDS = [
  'Star Platinum (スタープラチナ)',
  'Crazy Diamond (クレイジー・ダイヤモンド)',
  'Gold Experience (ゴールド・エクスペリエンス)',
  'Stone Free (ストーン・フリー)',
  'Hermit Purple (ハーミット・パープル)',
  'The World (ザ・ワールド)',
  'Silver Chariot (シルバーチャリオッツ)',
  'Killer Queen (キラークイーン)',
  'Sticky Fingers (スティッキィ・フィンガーズ)'
];

export default function UserDashboard({ initialTab = 'cart', onNavigate }) {
  const { user } = useAuth();
  const { items, total, count, updateQty, removeItem, clearCart, checkout } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: '', favorite_stand: 'Star Platinum (スタープラチナ)' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'profile') {
      loadProfile();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const data = await api.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;
    try {
      const res = await checkout();
      setMessage({ type: 'success', text: `✓ ${res.message || 'Transmission sent! Order placed with Tonio\'s kitchen.'}` });
      setActiveTab('orders');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to place order.' });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(profile);
      setMessage({ type: 'success', text: '✓ Stand Master Profile updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    }
  };

  return (
    <div className="dashboard-container" style={{ paddingTop: '5rem', paddingBottom: '5rem', minHeight: '80vh' }}>
      <main className="dashboard-content container">
        
        {/* Navigation Tabs */}
        <div className="filters" style={{ marginBottom: '35px' }}>
          <div className="filter-group">
            <button
              className={`pill ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => { setActiveTab('cart'); setMessage(null); }}
            >
              🛒 My Stand Cart ({count})
            </button>
            <button
              className={`pill ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setMessage(null); }}
            >
              📜 Order Transmissions ({orders.length})
            </button>
            <button
              className={`pill ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setMessage(null); }}
            >
              ★ Stand Master Settings
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            fontWeight: '700'
          }}>
            {message.text}
          </div>
        )}

        {/* CART VIEW */}
        {activeTab === 'cart' && (
          <div className="dash-view active">
            <div className="menu-header" style={{ marginTop: 0, textAlign: 'left', marginBottom: '25px' }}>
              <span className="menacing-stamp" style={{ marginBottom: '8px' }}>現在の注文</span>
              <h3 className="section-title">My Stand <span className="text-highlight">Cart</span></h3>
              <p className="menu-intro">Confirm your order items before sending to Tonio's kitchen.</p>
            </div>

            {items.length === 0 ? (
              <div className="login-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
                <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>☕</span>
                <h4 style={{ color: 'var(--gold-light)', fontSize: '1.4rem', marginBottom: '8px' }}>Your Stand is Empty</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Explore our menu and summon your favorite anime-inspired brews.</p>
                <button 
                  onClick={() => onNavigate('menu')} 
                  className="btn-app-store"
                  style={{ border: 'none', margin: '0 auto' }}
                >
                  <span className="small-text">Explore Menu</span>
                  <span className="big-text">View Stand Brews ➔</span>
                </button>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '20px', padding: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                  {items.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px',
                        padding: '16px 20px',
                        borderRadius: '14px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div>
                        <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.15rem' }}>{it.name}</h4>
                        <span style={{ color: 'var(--gold-light)', fontSize: '0.88rem', fontWeight: '700' }}>
                          {it.size} · ₱{Number(it.unit_price).toFixed(2)} each
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        {/* Quantity Stepper */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0e051c', padding: '4px 8px', borderRadius: '10px', border: '1px solid var(--border-card)' }}>
                          <button
                            onClick={() => updateQty(it.id, it.qty - 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '800' }}
                          >
                            -
                          </button>
                          <span style={{ color: '#fff', fontWeight: '800', minWidth: '24px', textAlign: 'center' }}>{it.qty}</span>
                          <button
                            onClick={() => updateQty(it.id, it.qty + 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--gold-light)', color: '#1a0826', border: 'none', cursor: 'pointer', fontWeight: '800' }}
                          >
                            +
                          </button>
                        </div>

                        <span style={{ color: 'var(--gold-light)', fontWeight: '800', minWidth: '90px', textAlign: 'right', fontSize: '1.15rem' }}>
                          ₱{Number(it.subtotal).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeItem(it.id)}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.2rem' }}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Receipt Summary Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', borderTop: '1px solid var(--border-card)', paddingTop: '24px' }}>
                  <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Total</span>
                    <h3 style={{ color: 'var(--gold-light)', fontSize: '2.2rem', margin: '2px 0 0' }}>
                      ₱{Number(total).toFixed(2)}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '14px' }}>
                    <button
                      onClick={clearCart}
                      style={{ padding: '12px 20px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border-card)', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: '600' }}
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="btn-app-store"
                      style={{ border: 'none' }}
                    >
                      <span className="small-text">Tonio's Kitchen</span>
                      <span className="big-text">Place Order ➔</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ORDER HISTORY VIEW */}
        {activeTab === 'orders' && (
          <div className="dash-view active">
            <div className="menu-header" style={{ marginTop: 0, textAlign: 'left', marginBottom: '25px' }}>
              <span className="menacing-stamp" style={{ marginBottom: '8px' }}>過去の注文履歴</span>
              <h3 className="section-title">Order <span className="text-highlight">Transmissions</span></h3>
              <p className="menu-intro">Track the status of your Stand beverages in Morioh.</p>
            </div>

            {ordersLoading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading transmissions...</div>
            ) : orders.length === 0 ? (
              <div className="login-card" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--gold-light)', fontSize: '1.3rem', marginBottom: '8px' }}>No Transmissions Found</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't ordered from the Morioh Grand Café yet.</p>
                <button onClick={() => onNavigate('menu')} className="btn-add" style={{ padding: '10px 24px' }}>
                  Browse Menu ➔
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-card)',
                      borderRadius: '18px',
                      padding: '24px',
                      boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '1.2rem' }}>Transmission #{ord.id}</strong>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.88rem', marginLeft: '14px' }}>
                          {new Date(ord.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          background: ord.status === 'completed' ? 'rgba(34,197,94,0.2)' : ord.status === 'revoked' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                          color: ord.status === 'completed' ? '#4ade80' : ord.status === 'revoked' ? '#f87171' : 'var(--gold-light)',
                          border: `1px solid ${ord.status === 'completed' ? '#22c55e' : ord.status === 'revoked' ? '#ef4444' : 'var(--gold-border)'}`
                        }}>
                          {ord.status === 'processed' ? '☕ Brewing...' : ord.status}
                        </span>
                        <span style={{ color: 'var(--gold-light)', fontWeight: '900', fontSize: '1.3rem' }}>
                          ₱{Number(ord.total).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                      {ord.items?.map((it, idx) => (
                        <div key={idx} style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                          • {it.qty}x {it.item_name} {it.size ? `(${it.size})` : ''} — ₱{Number(it.item_price * it.qty).toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE VIEW */}
        {activeTab === 'profile' && (
          <div className="dash-view active">
            <div className="menu-header" style={{ marginTop: 0, textAlign: 'left', marginBottom: '25px' }}>
              <span className="menacing-stamp" style={{ marginBottom: '8px' }}>スタンド使いの情報</span>
              <h3 className="section-title">Stand Master <span className="text-highlight">Settings</span></h3>
              <p className="menu-intro">Customize your identity, delivery destination, and guardian Stand.</p>
            </div>

            <div className="login-card" style={{ maxWidth: '600px', margin: 0 }}>
              {profileLoading ? (
                <p style={{ color: 'var(--text-muted)' }}>Loading Stand specs...</p>
              ) : (
                <form onSubmit={handleProfileSubmit}>
                  <div className="form-group">
                    <label>Full Stand Master Name</label>
                    <input
                      type="text"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="e.g. Demi Elago"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="e.g. 09123456789"
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Address (Morioh or Beyond)</label>
                    <textarea
                      rows="2"
                      value={profile.address || ''}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Street, City, Province..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Guardian Stand</label>
                    <select
                      value={profile.favorite_stand || 'Star Platinum (スタープラチナ)'}
                      onChange={(e) => setProfile({ ...profile, favorite_stand: e.target.value })}
                    >
                      {STANDS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-login"
                    style={{ marginTop: '10px' }}
                  >
                    Save Stand Profile
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
