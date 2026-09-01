import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      setTotal(0);
      setCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getCart();
      setItems(res.items || []);
      setTotal(res.total || 0);
      setCount(res.count || 0);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (menuItemId, size = '16oz', qty = 1) => {
    if (!user) {
      throw new Error('Please sign in to add items to your Stand!');
    }
    const res = await api.addToCart(menuItemId, size, qty);
    await fetchCart();
    return res;
  };

  const updateQty = async (cartId, qty) => {
    await api.updateCartQty(cartId, qty);
    await fetchCart();
  };

  const removeItem = async (cartId) => {
    await api.removeCartItem(cartId);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    await fetchCart();
  };

  const checkout = async () => {
    const res = await api.checkout();
    await fetchCart();
    return res;
  };

  return (
    <CartContext.Provider value={{
      items,
      total,
      count,
      loading,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      checkout,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
