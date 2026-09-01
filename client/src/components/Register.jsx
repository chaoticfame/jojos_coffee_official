import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(username, password, email);
      onNavigate('menu');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container login-container" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '6rem', paddingBottom: '3rem' }}>
      <div className="login-card">
        <h2>Register</h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>Create an account to order.</p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '4px', marginBottom: '15px', border: '1px solid #ef4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="reg-username" style={{ display: 'block', marginBottom: '5px' }}>Username</label>
            <input
              type="text"
              id="reg-username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="reg-email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
            <input
              type="email"
              id="reg-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="reg-password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              type="password"
              id="reg-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a password"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="reg-confirm" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
            <input
              type="password"
              id="reg-confirm"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-login"
            style={{ width: '100%', padding: '12px', background: 'var(--accent-yellow)', color: '#1e1032', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
          Already have an account?{' '}
          <a
            href="#login"
            onClick={(e) => { e.preventDefault(); onNavigate('login'); }}
            style={{ color: 'var(--pink)', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Sign In here
          </a>
        </div>
      </div>
    </main>
  );
}
