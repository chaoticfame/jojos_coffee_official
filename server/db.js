import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'jojos_cafe.db');

export const db = new DatabaseSync(dbPath);

export function initDb() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      size TEXT DEFAULT '16oz',
      qty INTEGER NOT NULL DEFAULT 1,
      UNIQUE(user_id, menu_item_id, size)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      item_price REAL NOT NULL,
      size TEXT,
      qty INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      full_name TEXT,
      phone TEXT,
      address TEXT,
      favorite_stand TEXT
    );
  `);

  // Seed sample users if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const insertUser = db.prepare('INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)');
    
    // admin
    insertUser.run('admin', bcrypt.hashSync('admin123', 10), 'speedwagon@foundation.org', 'admin');
    // customers
    insertUser.run('demi_elago', bcrypt.hashSync('demi123', 10), 'demi@jojocafe.com', 'user');
    insertUser.run('demsdemi', bcrypt.hashSync('demi123', 10), 'demsdemi@jojocafe.com', 'user');
    insertUser.run('AngwyBean', bcrypt.hashSync('testing', 10), 'angwy@bean.com', 'user');
    insertUser.run('Angel', bcrypt.hashSync('testing123', 10), 'angel@jojo.com', 'user');
  }

  // Seed menu items if empty
  const menuCount = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count;
  if (menuCount === 0) {
    const insertItem = db.prepare('INSERT INTO menu_items (name, category, description, price, image_url) VALUES (?, ?, ?, ?, ?)');
    
    const sampleItems = [
      // Stand Brews
      ['Americano (16oz)', 'Stand Brews', 'Classic espresso with pure Morioh mineral hot water', 99.00, 'assets/coffee.jpg'],
      ['Star Platinum Espresso', 'Stand Brews', 'High-velocity double shot dark roast brewed with pinpoint precision', 119.00, 'assets/coffee1.jpg'],
      ['Hermit Purple Cold Brew', 'Stand Brews', 'Divined overnight cold brew infused with purple berry notes and herbal tonic', 139.00, 'assets/coffee2.jpg'],
      ["Magician's Red Roast", 'Stand Brews', 'Fiery cinnamon spice espresso with a kick of heat and smoky molasses', 129.00, 'assets/coffee.jpg'],
      
      // Joestar Blends
      ['Biscoff Coffee', 'Joestar Blends', 'Biscoff syrup and signature Joestar blend with crushed spiced cookie rim', 159.00, 'assets/1.jpg'],
      ['Morioh Caramel Macchiato', 'Joestar Blends', 'Layered steamed vanilla milk, rich espresso shots, and butter caramel drizzle', 159.00, 'assets/2.jpg'],
      ["Giorno's Golden Foam Latte", 'Joestar Blends', 'Smooth Italian espresso topped with honey golden foam and edible gold dust', 169.00, 'assets/3.jpg'],
      ['Stone Ocean Sea Salt Latte', 'Joestar Blends', 'Sweet condensed milk espresso under a thick sea salt foam layer', 159.00, 'assets/4.jpg'],

      // Mixed Hamon
      ['Overdrive Strawberry Matcha Latte', 'Mixed Hamon', 'Vibrant strawberry puree layered with ceremonial grade Uji matcha', 139.00, 'assets/5.jpg'],
      ["Caesar's Bubble Berry Cooler", 'Mixed Hamon', 'Sparkling Hamon berry infusion with bursting fruit juice spheres', 139.00, 'assets/6.jpg'],
      ['Sunlight Yellow Citrus Tea', 'Mixed Hamon', 'Energizing yuzu citrus, sparkling tonic, and natural honey Hamon energy', 129.00, 'assets/7.jpg'],

      // Croffle
      ['Golden Classic Croffle', 'Croffle', 'Whipped Cream, Grade A Maple Syrup, Golden Creamery Butter', 159.00, 'assets/8.jpg'],
      ['Choco Dio Over Heaven Croffle', 'Croffle', 'Rich hazelnut Nutella drizzle, dark Belgian chocolate shavings, whipped cream', 179.00, 'assets/9.jpg'],
      ['Crazy Diamond Berry Croffle', 'Croffle', 'Restorative fresh mixed berries, strawberry glaze, and vanilla mascarpone', 189.00, 'assets/11.jpg'],
      ["Kira's Handcrafted Tiramisu", 'Croffle', 'Quietly indulgent espresso-soaked ladyfingers with cocoa powder', 169.00, 'assets/13.jpg'],

      // Tonio's Specials
      ["Tonio's Pearl Jam Pasta", "Tonio's Specials", 'Fresh spicy cherry tomato sauce and handmade spaghetti that heals fatigue', 249.00, "assets/tonio's blend.jpg"],
      ['Caprese Salad with Morioh Mozzarella', "Tonio's Specials", 'Water buffalo mozzarella, ripe vine tomatoes, fresh basil, and aged balsamic', 199.00, 'assets/cafeinterior.jpg']
    ];

    for (const item of sampleItems) {
      insertItem.run(item[0], item[1], item[2], item[3], item[4]);
    }
  }
}
