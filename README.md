# ☕ JoJo's Bizarre Coffee (Web App 2.0)

> *"You thought it was just a vanilla PHP project, but it was me, a modern Full-Stack React + Node.js Web App!"*

A full-stack modern web application for **JoJo's Bizarre Coffee**, faithfully preserving 100% of the original Morioh aesthetic, character artwork, Stand motifs, animations, and color palette.

---

## 🌟 Modernized Architecture

* **Frontend**: React 18, Vite, Google Fonts (`Cinzel Decorative` & `Roboto`), SVG Diamond Background, Lucide Icons
* **Backend**: Express REST API, JSON Web Token (JWT) Authentication, Bcrypt password hashing
* **Database**: Node.js Native SQLite (`node:sqlite`) with pre-seeded menu items and user accounts
* **Features**:
  * 🎭 **Joestar Generations Showcase**: Interactive slider with Jonathan, Joseph, Jotaro, Josuke, Giorno, and Jolyne.
  * ☕ **Dynamic Menu & Cart ("My Stand")**: Real-time filtering, 16oz/22oz dynamic pricing, quantity adjustments, and 1-click checkout.
  * 📜 **Order Tracking & History**: Real-time transmission records with status updates (`pending`, `processed`, `completed`, `revoked`).
  * 🛡️ **Speedwagon Foundation Admin Portal**: Full CRUD management of menu items and live order status processing.
  * 👤 **Stand Master Profile**: Personalized profile settings, phone, delivery address, and favorite Stand selector.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# In the root directory:
npm run install:all
```

### 2. Run Development Servers
```bash
# Starts both Backend (Port 5001) and Frontend (Port 3001):
npm run dev
```

* **Frontend**: `http://localhost:3001`
* **Backend API**: `http://localhost:5001`
