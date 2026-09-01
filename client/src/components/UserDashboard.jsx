import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

const STANDS = [
  'Star Platinum',
  'Crazy Diamond',
  'Gold Experience',
  'Stone Free',
  'Hermit Purple',
  'The World',
  'Silver Chariot',
  'Killer Queen',
  'Sticky Fingers'
];

export default function UserDashboard({ initialTab = 'cart', onNavigate }) {
  const { user } = useAuth();
  const { items, total, count, updateQty, removeItem, clearCart, checkout } = useCart();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '', address: '', favorite_stand: 'Star Platinum' });
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
      setMessage({ type: 'success', text: `✓ ${res.message || 'Order placed successfully!'}` });
      setActiveTab('orders');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to place order.' });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile(profile);
      setMessage({ type: 'success', text: '✓ Profile details saved!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    }
  };

  return (
    <div className="dashboard-container" style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <main className="dashboard-content container">
        
        {/* Navigation Tabs */}
        <div className="filters" style={{ marginBottom: '30px' }}>
          <div className="filter-group">
            <button
              className={`pill ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => { setActiveTab('cart'); setMessage(null); }}
            >
              My Cart ({count})
            </button>
            <button
              className={`pill ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setMessage(null); }}
            >
              Order History
            </button>
            <button
              className={`pill ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => { setActiveTab('profile'); setMessage(null); }}
            >
              Profile &amp; Settings
            </button>
          </div>
        </div>

        {message && (
          <div style={{
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            fontWeight: 'bold'
          }}>
            {message.text}
          </div>
        )}

        {/* CART VIEW */}
        {activeTab === 'cart' && (
          <div className="dash-view active">
            <div className="menu-header" style={{ marginTop: 0, textAlign: 'left', marginBottom: '25px' }}>
              <h3 className="section-title">My <span className="text-highlight">Cart</span></h3>
              <p className="menu-intro">Review your selected items and place your order.</p>
            </div>

            {items.length === 0 ? (
              <div className="empty-box" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Your cart is currently empty.</p>
                <button onClick={() => onNavigate('menu')} className="btn-app-store" style={{ display: 'inline-block' }}>
                  <span className="small-text">Browse</span>
                  <span className="big-text">Order Menu</span>
                </button>
              </div>
            ) : (
              <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
                  {items.map((it) => (
                    <div
                      key={it.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}
                    >
                      <div>
                        <h4 style={{ color: '#fff', margin: '0 0 4px', fontSize: '1.1rem' }}>{it.name}</h4>
                        <span style={{ color: 'var(--pink)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                          {it.size} · ₱{Number(it.unit_price).toFixed(2)} each
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => updateQty(it.id, it.qty - 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            -
                          </button>
                          <span style={{ color: '#fff', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{it.qty}</span>
                          <button
                            onClick={() => updateQty(it.id, it.qty + 1)}
                            style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                          >
                            +
                          </button>
                        </div>

                        <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', minWidth: '80px', textAlign: 'right', fontSize: '1.05rem' }}>
                          ₱{Number(it.subtotal).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeItem(it.id)}
                          style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1.1rem' }}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                  <div>
                    <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Total Amount:</span>
                    <h3 style={{ color: 'var(--accent-yellow)', fontSize: '1.8rem', margin: '4px 0 0' }}>
                      ₱{Number(total).toFixed(2)}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={clearCart}
                      style={{ padding: '10px 18px', borderRadius: '6px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--muted)', cursor: 'pointer' }}
                    >
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      style={{ padding: '12px 28px', borderRadius: '6px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                    >
                      Place Order
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
              <h3 className="section-title">Order <span className="text-highlight">History</span></h3>
              <p className="menu-intro">Track your previous orders and their current status.</p>
            </div>

            {ordersLoading ? (
              <div className="empty-box">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-box" style={{ textAlign: 'center', padding: '50px 20px' }}>
                <p>You have not placed any orders yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '1.1rem' }}>Order #{ord.id}</strong>
                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', marginLeft: '12px' }}>
                          {new Date(ord.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          background: ord.status === 'completed' ? 'rgba(34,197,94,0.2)' : ord.status === 'revoked' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                          color: ord.status === 'completed' ? '#4ade80' : ord.status === 'revoked' ? '#f87171' : '#fde047',
                          border: `1px solid ${ord.status === 'completed' ? '#22c55e' : ord.status === 'revoked' ? '#ef4444' : '#eab308'}`
                        }}>
                          {ord.status}
                        </span>
                        <span style={{ color: 'var(--accent-yellow)', fontWeight: 'bold', fontSize: '1.15rem' }}>
                          ₱{Number(ord.total).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                      {ord.items?.map((it, idx) => (
                        <div key={idx} style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
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
              <h3 className="section-title">Profile &amp; <span className="text-highlight">Settings</span></h3>
              <p className="menu-intro">Update your contact and delivery preferences.</p>
            </div>

            <div style={{ maxWidth: '550px', background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '30px' }}>
              {profileLoading ? (
                <p style={{ color: 'var(--muted)' }}>Loading profile...</p>
              ) : (
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Full Name</label>
                    <input
                      type="text"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="e.g. Demi Elago"
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Phone Number</label>
                    <input
                      type="text"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="e.g. 09123456789"
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Delivery Address</label>
                    <textarea
                      rows="2"
                      value={profile.address || ''}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Enter address in Morioh..."
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--muted)' }}>Favorite Stand</label>
                    <select
                      value={profile.favorite_stand || 'Star Platinum'}
                      onChange={(e) => setProfile({ ...profile, favorite_stand: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', background: '#1e1032', border: '1px solid var(--accent-yellow)', color: '#fff' }}
                    >
                      {STANDS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{ marginTop: '10px', padding: '12px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    Save Changes
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
