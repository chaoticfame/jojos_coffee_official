import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import DiamondBackground from './components/DiamondBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Menu from './components/Menu';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [viewParams, setViewParams] = useState(null);

  const handleNavigate = (view, params = null) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <DiamondBackground />
      <Header currentView={currentView} setCurrentView={handleNavigate} />

      <main style={{ flex: 1, position: 'relative', zIndex: 10 }}>
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        {currentView === 'menu' && <Menu onNavigate={handleNavigate} />}
        {currentView === 'about' && <About onNavigate={handleNavigate} />}
        {currentView === 'contact' && <Contact onNavigate={handleNavigate} />}
        {currentView === 'login' && <Login onNavigate={handleNavigate} />}
        {currentView === 'register' && <Register onNavigate={handleNavigate} />}
        {currentView === 'admin-login' && <AdminLogin onNavigate={handleNavigate} />}
        {currentView === 'user-dashboard' && (
          <UserDashboard 
            initialTab={viewParams?.tab || 'cart'} 
            onNavigate={handleNavigate} 
          />
        )}
        {currentView === 'admin-dashboard' && (
          isAdmin ? (
            <AdminDashboard onNavigate={handleNavigate} />
          ) : (
            <AdminLogin onNavigate={handleNavigate} />
          )
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
