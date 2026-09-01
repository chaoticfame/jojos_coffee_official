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
      setMessage({ type: 'success', text: `✓ Order #${orderId} marked as ${newStatus}` });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update order' });
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
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.deleteMenuItem(id);
        setMessage({ type: 'success', text: `✓ "${name}" deleted successfully.` });
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
        setMessage({ type: 'success', text: `✓ Added new item "${payload.name}".` });
      }
      setModalActive(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save menu item');
    }
  };

  return (
    <div className="dashboard-container" style={{ paddingTop: '6rem', paddingBottom: '4rem', minHeight: '80vh' }}>
      <main className="dashboard-content container">
        
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(255,211,59,0.3)', paddingBottom: '15px' }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>
              Admin <span className="text-highlight">Dashboard</span>
            </h2>
            <p style={{ color: 'var(--muted)', margin: '4px 0 0', fontSize: '0.9rem' }}>Speedwagon Foundation Management</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className={`pill ${section === 'menu' ? 'active' : ''}`}
              onClick={() => setSection('menu')}
            >
              Menu Items
            </button>
            <button
              className={`pill ${section === 'orders' ? 'active' : ''}`}
              onClick={() => setSection('orders')}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={handleOpenAdd}
              style={{ padding: '8px 16px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              + Add Item
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* SECTION 1: MENU ITEMS */}
        {section === 'menu' && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-yellow)' }}>
                  <tr>
                    <th style={{ padding: '12px 16px' }}>Name</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Description</th>
                    <th style={{ padding: '12px 16px' }}>Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{item.name}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,111,179,0.2)', color: 'var(--pink)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: '0.85rem', maxWidth: '300px' }}>
                        {item.description || '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                        ₱{Number(item.price).toFixed(2)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,211,59,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginRight: '6px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          style={{ padding: '4px 10px', borderRadius: '4px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
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

        {/* SECTION 2: ORDERS */}
        {section === 'orders' && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--accent-yellow)' }}>
                  <tr>
                    <th style={{ padding: '12px 16px' }}>Order #</th>
                    <th style={{ padding: '12px 16px' }}>Customer</th>
                    <th style={{ padding: '12px 16px' }}>Items</th>
                    <th style={{ padding: '12px 16px' }}>Total</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: 'var(--muted)' }}>
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>#{ord.id}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <strong>{ord.username}</strong>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{ord.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                          {ord.items?.map((it, i) => (
                            <div key={i}>{it.qty}x {it.item_name} {it.size ? `(${it.size})` : ''}</div>
                          ))}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--accent-yellow)', fontWeight: 'bold' }}>
                          ₱{Number(ord.total).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            background: ord.status === 'completed' ? 'rgba(34,197,94,0.2)' : ord.status === 'revoked' ? 'rgba(239,68,68,0.2)' : 'rgba(234,179,8,0.2)',
                            color: ord.status === 'completed' ? '#4ade80' : ord.status === 'revoked' ? '#f87171' : '#fde047',
                            border: `1px solid ${ord.status === 'completed' ? '#22c55e' : ord.status === 'revoked' ? '#ef4444' : '#eab308'}`
                          }}>
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {ord.status === 'pending' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'processed')}
                                style={{ padding: '4px 8px', borderRadius: '4px', background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                              >
                                Process
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(ord.id, 'revoked')}
                                style={{ padding: '4px 8px', borderRadius: '4px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                          {ord.status === 'processed' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, 'completed')}
                              style={{ padding: '4px 8px', borderRadius: '4px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
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

        {/* Modal */}
        {modalActive && (
          <div className="form-modal active" style={{ display: 'flex' }}>
            <div className="form-container">
              <h3 style={{ color: 'var(--accent-yellow)', marginTop: 0, marginBottom: '20px' }}>
                {editingItem ? `Edit Item: ${editingItem.name}` : 'Add New Menu Item'}
              </h3>

              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="modal-name">Name</label>
                  <input
                    type="text"
                    id="modal-name"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Star Platinum Espresso"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-category">Category</label>
                  <input
                    type="text"
                    id="modal-category"
                    required
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="e.g. Stand Brews, Joestar Blends..."
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-desc">Description</label>
                  <textarea
                    id="modal-desc"
                    rows="2"
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    placeholder="Description and ingredients..."
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="modal-price">Price (₱)</label>
                  <input
                    type="number"
                    step="0.01"
                    id="modal-price"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="159.00"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setModalActive(false)}
                    style={{ padding: '8px 16px', borderRadius: '4px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '8px 20px', borderRadius: '4px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {editingItem ? 'Update' : 'Add'}
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
