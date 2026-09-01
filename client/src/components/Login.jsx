import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onNavigate }) {
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
      const user = await login(username, password);
      if (user.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('menu');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container login-container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '3rem' }}>
      <div className="login-card">
        <h2>Sign In</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>Regular users Sign In here.</p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input
              type="text"
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-login"
            style={{ width: '100%', padding: '12px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
          Don't have an account?{' '}
          <a
            href="#register"
            onClick={(e) => { e.preventDefault(); onNavigate('register'); }}
            style={{ color: 'var(--pink)', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Register here
          </a>
        </div>

        <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '13px' }}>
          <a
            href="#admin-login"
            onClick={(e) => { e.preventDefault(); onNavigate('admin-login'); }}
            style={{ color: 'var(--muted)', textDecoration: 'underline' }}
          >
            Administrator Login
          </a>
        </div>
      </div>
    </main>
  );
}
