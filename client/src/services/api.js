const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('jojo_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

export const api = {
  // Auth
  async login(username, password, requiredRole = null) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, requiredRole })
    });
    return handleResponse(res);
  },

  async register(username, password, email) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Menu
  async getMenu(category = '', q = '') {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (q) params.append('q', q);

    const res = await fetch(`${API_BASE}/menu?${params.toString()}`);
    return handleResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/menu/categories`);
    return handleResponse(res);
  },

  async addMenuItem(item) {
    const res = await fetch(`${API_BASE}/menu`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    return handleResponse(res);
  },

  async updateMenuItem(id, item) {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item)
    });
    return handleResponse(res);
  },

  async deleteMenuItem(id) {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Cart
  async getCart() {
    const res = await fetch(`${API_BASE}/cart`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async addToCart(menu_item_id, size = '16oz', qty = 1) {
    const res = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ menu_item_id, size, qty })
    });
    return handleResponse(res);
  },

  async updateCartQty(cart_id, qty) {
    const res = await fetch(`${API_BASE}/cart/update`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ cart_id, qty })
    });
    return handleResponse(res);
  },

  async removeCartItem(id) {
    const res = await fetch(`${API_BASE}/cart/item/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async clearCart() {
    const res = await fetch(`${API_BASE}/cart/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Orders
  async checkout() {
    const res = await fetch(`${API_BASE}/orders/checkout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminOrders() {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async getAdminAnalytics() {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  }
};
