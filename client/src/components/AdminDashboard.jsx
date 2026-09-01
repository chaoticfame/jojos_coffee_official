import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminDashboard({ onNavigate }) {
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [section, setSection] = useState('menu');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Modal State
  const [modalActive, setModalActive] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Stand Brews');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, ords, menu] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminOrders(),
        api.getMenu('All', '')
      ]);
      setAnalytics(stats);
      setOrders(ords || []);
      setMenuItems(menu || []);
    } catch (err) {
      console.error('Admin load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setMessage({ type: 'success', text: `✓ Transmission #${orderId} set to "${newStatus}"` });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update transmission status' });
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setItemName('');
    setItemCategory('Stand Brews');
    setItemDescription('');
    setItemPrice('');
    setModalActive(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemDescription(item.description || '');
    setItemPrice(item.price);
    setModalActive(true);
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Speedwagon Confirmation: Delete "${name}" from the menu catalog?`)) {
      try {
        await api.deleteMenuItem(id);
        setMessage({ type: 'success', text: `✓ "${name}" deleted.` });
        loadData();
      } catch (err) {
        setMessage({ type: 'error', text: err.message || 'Failed to delete item' });
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: itemName.trim(),
      category: itemCategory.trim(),
      description: itemDescription.trim(),
      price: parseFloat(itemPrice),
      image_url: editingItem?.image_url || 'assets/coffee.jpg'
    };

    try {
      if (editingItem) {
        await api.updateMenuItem(editingItem.id, payload);
        setMessage({ type: 'success', text: `✓ Updated "${payload.name}".` });
      } else {
        await api.addMenuItem(payload);
        setMessage({ type: 'success', text: `✓ Added "${payload.name}".` });
      }
      setModalActive(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save menu item');
    }
  };

  return (
    <div className="dashboard-container" style={{ paddingTop: '5rem', paddingBottom: '5rem', minHeight: '80vh' }}>
      <main className="dashboard-content container">
        
        {/* Header Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px', borderBottom: '1px solid var(--border-card)', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
              <span className="menacing-stamp">スピードワゴン財団</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Speedwagon Foundation</span>
            </div>
            <h2 className="section-title" style={{ margin: 0, textAlign: 'left' }}>
              Admin <span className="text-highlight">Command Center</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`pill ${section === 'menu' ? 'active' : ''}`}
              onClick={() => setSection('menu')}
            >
              Menu Catalog ({menuItems.length})
            </button>
            <button
              className={`pill ${section === 'orders' ? 'active' : ''}`}
              onClick={() => setSection('orders')}
            >
              Live Orders ({orders.length})
            </button>
            <button
              onClick={handleOpenAdd}
              className="btn-add"
              style={{ borderRadius: '20px', padding: '8px 18px' }}
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div style={{
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '25px',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: message.type === 'success' ? '#4ade80' : '#f87171',
            fontWeight: '700'
          }}>
            {message.text}
          </div>
        )}

        {/* Quick Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          <div className="stat-card">
            <span className="stat-label">Total Stand Revenue</span>
            <span className="stat-number">₱{Number(analytics?.totalSales || 0).toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Transmissions</span>
            <span className="stat-number" style={{ color: '#fbbf24' }}>{analytics?.pendingOrders || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Completed Orders</span>
            <span className="stat-number" style={{ color: '#60a5fa' }}>{analytics?.totalOrders || 0}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Stand Menu Items</span>
            <span className="stat-number" style={{ color: 'var(--stand-pink)' }}>{analytics?.totalMenuItems || 0}</span>
          </div>
        </div>

        {/* MENU ITEMS TABLE */}
        {section === 'menu' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid var(--border-card)', color: 'var(--gold-light)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px' }}>Name</th>
                    <th style={{ padding: '14px 20px' }}>Category</th>
                    <th style={{ padding: '14px 20px' }}>Description</th>
                    <th style={{ padding: '14px 20px' }}>Price</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: '700' }}>{item.name}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className="menacing-stamp" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px' }}>
                        {item.description || '—'}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--gold-light)', fontWeight: '800' }}>
                        ₱{Number(item.price).toFixed(2)}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid var(--border-card)', cursor: 'pointer', fontSize: '0.82rem', marginRight: '8px', fontWeight: '600' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          style={{ padding: '6px 12px', borderRadius: '6px', background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid #ef4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TABLE */}
        {section === 'orders' && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid var(--border-card)', color: 'var(--gold-light)' }}>
                  <tr>
                    <th style={{ padding: '14px 20px' }}>Transmission #</th>
                    <th style={{ padding: '14px 20px' }}>Customer</th>
                    <th style={{ padding: '14px 20px' }}>Ordered Items</th>
                    <th style={{ padding: '14px 20px' }}>Total</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No transmissions recorded in Morioh logs yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 20px', fontWeight: '800' }}>#{ord.id}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <strong>{ord.username}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{ord.email}</div>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '0.88rem' }}>
                          {ord.items?.map((it, i) => (
                            <div key={i}>{it.qty}x {it.item_name} {it.size ? `(${it.size})` : ''}</div>
                          ))}
                        </td>
                        <td style={{ padding: '14px 20px', color: 'var(--gold-light)', fontWeight: '800' }}>
                          ₱{Number(ord.total).toFixed(2)}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.78rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            background: ord.status === 'completed' ? 'rgba(34,197,94,0.2)' : ord.status === 'revoked' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                            color: ord.status === 'completed' ? '#4ade80' : ord.status === 'revoked' ? '#f87171' : 'var(--gold-light)',
                            border: `1px solid ${ord.status === 'completed' ? '#22c55e' : ord.status === 'revoked' ? '#ef4444' : 'var(--gold-border)'}`
                          }}>
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          {ord.status === 'pending' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'processed')}
                                style={{ padding: '5px 10px', borderRadius: '6px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                              >
                                Process (Brew)
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'revoked')}
                                style={{ padding: '5px 10px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                          {ord.status === 'processed' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'completed')}
                              style={{ padding: '5px 12px', borderRadius: '6px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                            >
                              Complete ✓
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Add / Edit */}
        {modalActive && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 9999
          }}>
            <div className="login-card" style={{ maxWidth: '500px' }}>
              <h3 style={{ color: 'var(--gold-light)', marginTop: 0, marginBottom: '20px' }}>
                {editingItem ? `Edit: ${editingItem.name}` : 'Add New Stand Menu Item'}
              </h3>

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Star Platinum Espresso"
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    required
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="e.g. Stand Brews, Joestar Blends, Croffle..."
                  />
                </div>

                <div className="form-group">
                  <label>Description &amp; Stand Lore</label>
                  <textarea
                    rows="2"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Flavor profile, origins..."
                  />
                </div>

                <div className="form-group">
                  <label>Base Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="159.00"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setModalActive(false)}
                    style={{ padding: '10px 18px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-card)', color: '#fff', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-add"
                  >
                    {editingItem ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
