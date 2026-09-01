import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, initDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'jojos-bizarre-coffee-secret-key-morioh-2026';

app.use(cors());
app.use(express.json());

// Initialize database tables & seeds
initDb();

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Administrator access required' });
  }
}

// ------------------------------------
// AUTH ENDPOINTS
// ------------------------------------

app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Please provide username, password, and email' });
  }

  if (username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.trim());
    if (existing) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)')
      .run(username.trim(), hash, email.trim(), 'user');

    const user = { id: Number(result.lastInsertRowid), username: username.trim(), role: 'user' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { username, password, requiredRole } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  try {
    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim());
    if (!row) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const valid = bcrypt.compareSync(password, row.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    if (requiredRole && requiredRole === 'admin' && row.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Speedwagon Foundation Admin credentials required.' });
    }

    const user = { id: row.id, username: row.username, email: row.email, role: row.role };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const row = db.prepare('SELECT id, username, email, role FROM users WHERE id = ?').get(req.user.id);
    if (!row) return res.status(404).json({ error: 'User not found' });
    res.json({ user: row });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// ------------------------------------
// MENU ENDPOINTS
// ------------------------------------

app.get('/api/menu', (req, res) => {
  const { category, q } = req.query;

  try {
    let sql = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (q && q.trim()) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${q.trim()}%`, `%${q.trim()}%`);
    }

    sql += ' ORDER BY category, name';

    const items = db.prepare(sql).all(...params);
    res.json(items);
  } catch (err) {
    console.error('Menu error:', err);
    res.status(500).json({ error: 'Failed to load menu' });
  }
});

app.get('/api/menu/categories', (req, res) => {
  try {
    const rows = db.prepare('SELECT DISTINCT category FROM menu_items ORDER BY category').all();
    const categories = rows.map(r => r.category).filter(Boolean);
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Admin Add Menu Item
app.post('/api/menu', authenticateToken, requireAdmin, (req, res) => {
  const { name, category, description, price, image_url } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO menu_items (name, category, description, price, image_url) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(name.trim(), category.trim(), description || '', parseFloat(price), image_url || 'assets/coffee.jpg');
    res.status(201).json({ id: Number(result.lastInsertRowid), message: 'Item added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Admin Edit Menu Item
app.put('/api/menu/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, image_url } = req.body;

  try {
    const stmt = db.prepare('UPDATE menu_items SET name = ?, category = ?, description = ?, price = ?, image_url = ? WHERE id = ?');
    stmt.run(name.trim(), category.trim(), description || '', parseFloat(price), image_url || 'assets/coffee.jpg', id);
    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// Admin Delete Menu Item
app.delete('/api/menu/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ------------------------------------
// CART ENDPOINTS
// ------------------------------------

app.get('/api/cart', authenticateToken, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT c.id, c.menu_item_id, c.size, c.qty, m.name, m.category, m.description, m.price, m.image_url
      FROM user_cart_items c
      JOIN menu_items m ON c.menu_item_id = m.id
      WHERE c.user_id = ?
    `).all(req.user.id);

    // Calculate dynamic pricing based on size
    const items = rows.map(item => {
      let finalPrice = item.price;
      if (item.category === 'Joestar Blends') {
        finalPrice = item.size === '22oz' ? 179.0 : 159.0;
      } else if (item.category === 'Mixed Hamon') {
        finalPrice = item.size === '22oz' ? 159.0 : 139.0;
      }
      return {
        ...item,
        unit_price: finalPrice,
        subtotal: finalPrice * item.qty
      };
    });

    const total = items.reduce((sum, i) => sum + i.subtotal, 0);
    const count = items.reduce((sum, i) => sum + i.qty, 0);

    res.json({ items, total, count });
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

app.post('/api/cart/add', authenticateToken, (req, res) => {
  const { menu_item_id, size = '16oz', qty = 1 } = req.body;

  try {
    const existing = db.prepare('SELECT id, qty FROM user_cart_items WHERE user_id = ? AND menu_item_id = ? AND size = ?')
      .get(req.user.id, menu_item_id, size);

    if (existing) {
      db.prepare('UPDATE user_cart_items SET qty = qty + ? WHERE id = ?').run(qty, existing.id);
    } else {
      db.prepare('INSERT INTO user_cart_items (user_id, menu_item_id, size, qty) VALUES (?, ?, ?, ?)')
        .run(req.user.id, menu_item_id, size, qty);
    }

    const totalCount = db.prepare('SELECT SUM(qty) as count FROM user_cart_items WHERE user_id = ?')
      .get(req.user.id).count || 0;

    res.json({ success: true, cart_count: totalCount });
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

app.put('/api/cart/update', authenticateToken, (req, res) => {
  const { cart_id, qty } = req.body;

  try {
    if (qty <= 0) {
      db.prepare('DELETE FROM user_cart_items WHERE id = ? AND user_id = ?').run(cart_id, req.user.id);
    } else {
      db.prepare('UPDATE user_cart_items SET qty = ? WHERE id = ? AND user_id = ?').run(qty, cart_id, req.user.id);
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

app.delete('/api/cart/item/:id', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM user_cart_items WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

app.delete('/api/cart/clear', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM user_cart_items WHERE user_id = ?').run(req.user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// ------------------------------------
// ORDER & CHECKOUT ENDPOINTS
// ------------------------------------

app.post('/api/orders/checkout', authenticateToken, (req, res) => {
  try {
    // 1. Get cart items
    const rows = db.prepare(`
      SELECT c.id, c.menu_item_id, c.size, c.qty, m.name, m.category, m.price
      FROM user_cart_items c
      JOIN menu_items m ON c.menu_item_id = m.id
      WHERE c.user_id = ?
    `).all(req.user.id);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Your stand (cart) is empty.' });
    }

    let orderTotal = 0;
    const itemsToInsert = rows.map(item => {
      let finalPrice = item.price;
      if (item.category === 'Joestar Blends') {
        finalPrice = item.size === '22oz' ? 179.0 : 159.0;
      } else if (item.category === 'Mixed Hamon') {
        finalPrice = item.size === '22oz' ? 159.0 : 139.0;
      }
      const subtotal = finalPrice * item.qty;
      orderTotal += subtotal;
      return {
        menu_item_id: item.menu_item_id,
        name: item.name,
        price: finalPrice,
        size: item.size,
        qty: item.qty
      };
    });

    // 2. Create order
    const orderResult = db.prepare('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)')
      .run(req.user.id, orderTotal, 'pending');
    const orderId = Number(orderResult.lastInsertRowid);

    // 3. Insert order items
    const insertItem = db.prepare('INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, size, qty) VALUES (?, ?, ?, ?, ?, ?)');
    for (const it of itemsToInsert) {
      insertItem.run(orderId, it.menu_item_id, it.name, it.price, it.size, it.qty);
    }

    // 4. Clear user's cart
    db.prepare('DELETE FROM user_cart_items WHERE user_id = ?').run(req.user.id);

    res.status(201).json({
      success: true,
      order_id: orderId,
      total: orderTotal,
      message: `Order #${orderId} has been sent to Tonio's kitchen!`
    });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders/my-orders', authenticateToken, (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    
    const ordersWithItems = orders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
      return {
        ...ord,
        items
      };
    });

    res.json(ordersWithItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// ------------------------------------
// ADMIN DASHBOARD ENDPOINTS
// ------------------------------------

app.get('/api/admin/orders', authenticateToken, requireAdmin, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, u.username, u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `).all();

    const result = orders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(ord.id);
      return {
        ...ord,
        items
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

app.patch('/api/admin/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    res.json({ success: true, message: `Order #${id} marked as ${status}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

app.get('/api/admin/analytics', authenticateToken, requireAdmin, (req, res) => {
  try {
    const totalSales = db.prepare("SELECT SUM(total) as revenue FROM orders WHERE status != 'revoked'").get().revenue || 0;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count || 0;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count || 0;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'").get().count || 0;
    const totalMenuItems = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count || 0;

    res.json({
      totalSales,
      totalOrders,
      pendingOrders,
      totalCustomers,
      totalMenuItems
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// ------------------------------------
// USER PROFILE ENDPOINTS
// ------------------------------------

app.get('/api/profile', authenticateToken, (req, res) => {
  try {
    let profile = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?').get(req.user.id);
    if (!profile) {
      profile = { user_id: req.user.id, full_name: '', phone: '', address: '', favorite_stand: 'Star Platinum' };
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const { full_name, phone, address, favorite_stand } = req.body;

  try {
    const existing = db.prepare('SELECT id FROM user_profiles WHERE user_id = ?').get(req.user.id);
    if (existing) {
      db.prepare('UPDATE user_profiles SET full_name = ?, phone = ?, address = ?, favorite_stand = ? WHERE user_id = ?')
        .run(full_name || '', phone || '', address || '', favorite_stand || '', req.user.id);
    } else {
      db.prepare('INSERT INTO user_profiles (user_id, full_name, phone, address, favorite_stand) VALUES (?, ?, ?, ?, ?)')
        .run(req.user.id, full_name || '', phone || '', address || '', favorite_stand || '');
    }
    res.json({ success: true, message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.listen(PORT, () => {
  console.log(`☕ JoJo's Bizarre Coffee Server running on http://localhost:${PORT}`);
});
