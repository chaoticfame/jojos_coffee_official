import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password, 'admin');
      onNavigate('admin-dashboard');
    } catch (err) {
      setError(err.message || 'Access denied. Administrator credentials required.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container login-container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '3rem' }}>
      <div className="login-card" style={{ border: '2px solid var(--accent-yellow)' }}>
        <h2>Administrator Sign In</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>Speedwagon Foundation Personnel only.</p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="admin-username" style={{ display: 'block', marginBottom: '5px' }}>Admin Username</label>
            <input
              type="text"
              id="admin-username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="admin-password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              id="admin-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-login"
            style={{ width: '100%', padding: '12px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px' }}>
          <a
            href="#login"
            onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
            style={{ color: 'var(--muted)', textDecoration: 'underline' }}
          >
            ← Back to Customer Login
          </a>
        </div>
      </div>
    </main>
  );
}
