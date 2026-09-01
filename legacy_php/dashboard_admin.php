<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

// Check if user is admin
if ($_SESSION['user_role'] !== 'admin') {
    header('Location: dashboard_user.php');
    exit();
}

require_once 'db.php';

$message = '';
$messageType = '';

// Pending orders data
$ordersTableExists = false;
$pendingOrders = [];

// Check if orders table exists and load pending orders
$tableCheckOrders = $conn->query("SHOW TABLES LIKE 'orders'");
if ($tableCheckOrders && $tableCheckOrders->num_rows > 0) {
    $ordersTableExists = true;
    $pendingOrdersResult = $conn->query("SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at DESC");
    if ($pendingOrdersResult && $pendingOrdersResult->num_rows > 0) {
        while ($row = $pendingOrdersResult->fetch_assoc()) {
            $pendingOrders[] = $row;
        }
    }
}

// Handle delete action
if (isset($_GET['delete']) && is_numeric($_GET['delete'])) {
    $tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
    if ($tableCheck && $tableCheck->num_rows > 0) {
        $id = intval($_GET['delete']);
        $stmt = $conn->prepare("DELETE FROM menu_items WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $message = 'Menu item deleted successfully.';
            $messageType = 'success';
        } else {
            $message = 'Error deleting item: ' . $conn->error;
            $messageType = 'error';
        }
        $stmt->close();
    } else {
        $message = 'Menu items table does not exist.';
        $messageType = 'error';
    }
}

// Handle form submission (add/edit menu items, or order status changes)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Order status actions from Pending Orders view
    if (isset($_POST['order_action'], $_POST['order_id']) && $ordersTableExists) {
        $orderId = (int)$_POST['order_id'];
        $action = $_POST['order_action'];
        $newStatus = null;

        if ($action === 'process') {
            $newStatus = 'processed';
        } elseif ($action === 'revoke') {
            $newStatus = 'revoked';
        }

        if ($newStatus !== null && $orderId > 0) {
            if ($stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?")) {
                $stmt->bind_param("si", $newStatus, $orderId);
                if ($stmt->execute()) {
                    $message = 'Order #' . $orderId . ' marked as ' . $newStatus . '.';
                    $messageType = 'success';
                } else {
                    $message = 'Error updating order: ' . $conn->error;
                    $messageType = 'error';
                }
                $stmt->close();
            }
        }

        header('Location: dashboard_admin.php?section=orders');
        exit();
    }

    // Menu item add/edit
    $tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
    if ($tableCheck && $tableCheck->num_rows > 0) {
        $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
        $name = trim($_POST['name'] ?? '');
        $category = trim($_POST['category'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        
        if (empty($name) || empty($category) || $price <= 0) {
            $message = 'Please fill in all required fields (name, category, and price).';
            $messageType = 'error';
        } else {
            if ($id > 0) {
                // Update existing item
                $stmt = $conn->prepare("UPDATE menu_items SET name = ?, category = ?, description = ?, price = ? WHERE id = ?");
                $stmt->bind_param("sssdi", $name, $category, $description, $price, $id);
                if ($stmt->execute()) {
                    $message = 'Menu item updated successfully.';
                    $messageType = 'success';
                } else {
                    $message = 'Error updating item: ' . $conn->error;
                    $messageType = 'error';
                }
            } else {
                // Insert new item
                $stmt = $conn->prepare("INSERT INTO menu_items (name, category, description, price) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("sssd", $name, $category, $description, $price);
                if ($stmt->execute()) {
                    $message = 'Menu item added successfully.';
                    $messageType = 'success';
                } else {
                    $message = 'Error adding item: ' . $conn->error;
                    $messageType = 'error';
                }
            }
            $stmt->close();
        }
    } else {
        $message = 'Menu items table does not exist. Please run create_menu_table.php first.';
        $messageType = 'error';
    }
}

// Get item for editing
$editItem = null;
if (isset($_GET['edit']) && is_numeric($_GET['edit'])) {
    $tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
    if ($tableCheck && $tableCheck->num_rows > 0) {
        $editId = intval($_GET['edit']);
        $stmt = $conn->prepare("SELECT * FROM menu_items WHERE id = ?");
        $stmt->bind_param("i", $editId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows === 1) {
            $editItem = $result->fetch_assoc();
        }
        $stmt->close();
    }
}

// Fetch all menu items (with simple pagination)
$menuItems = null;
$tableExists = false;
$perPage = 10;
$page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
$menuTotal = 0;
$menuTotalPages = 1;
$offset = 0;

// Check if menu_items table exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
if ($tableCheck && $tableCheck->num_rows > 0) {
    $tableExists = true;

    // Count total items for pagination
    $countRes = $conn->query("SELECT COUNT(*) AS cnt FROM menu_items");
    if ($countRes && ($row = $countRes->fetch_assoc())) {
        $menuTotal = (int)$row['cnt'];
        $menuTotalPages = max(1, (int)ceil($menuTotal / $perPage));
        if ($page > $menuTotalPages) {
            $page = $menuTotalPages;
        }
    }

    $offset = ($page - 1) * $perPage;

    // Load one page of items
    $stmtList = $conn->prepare("SELECT * FROM menu_items ORDER BY category, name LIMIT ?, ?");
    if ($stmtList) {
        $stmtList->bind_param("ii", $offset, $perPage);
        $stmtList->execute();
        $menuItems = $stmtList->get_result();
    }

    if (!$menuItems) {
        $message = 'Error loading menu items: ' . $conn->error;
        $messageType = 'error';
    }
} else {
    $tableExists = false;
    $message = 'Menu items table does not exist. Please run <a href="create_menu_table.php">create_menu_table.php</a> first.';
    $messageType = 'error';
}

// Determine active admin section (menu / orders)
$section = isset($_GET['section']) ? $_GET['section'] : 'menu';
?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Admin Dashboard</title>
  <link rel="stylesheet" href="style.css?v=6">
  <script defer src="script.js?v=6"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <style>
    .message {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 10px;
      background: rgba(20, 10, 30, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.16);
      color: #f0e6ff;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.75);
    }
    .message.success {
      border-color: rgba(255, 211, 59, 0.85);
      color: #ffe9a6;
    }
    .message.error {
      border-color: rgba(255, 111, 179, 0.8);
      color: #ffd0e3;
    }
    .form-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }
    .form-modal.active {
      display: flex;
    }
    .form-container {
      background: rgba(20, 10, 30, 0.97);
      padding: 30px;
      border-radius: 16px;
      max-width: 520px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 20px 55px rgba(0, 0, 0, 0.9);
      color: #f0e6ff;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 8px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: rgba(255, 211, 59, 0.85);
      background: rgba(255, 255, 255, 0.12);
    }
    .form-group textarea {
      resize: vertical;
      min-height: 80px;
    }
    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .btn-danger:hover {
      background-color: #c82333;
    }
    .empty-state {
      text-align: center;
      padding: 40px;
      color: rgba(255, 255, 255, 0.8);
    }
  </style>
</head>
<body class="dashboard-page">
  <div class="diamond-background">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="diamond-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="40" height="40" fill="#9B3D9B" transform="rotate(45 20 20)" />
          <rect x="40" y="0" width="40" height="40" fill="#8B7355" transform="rotate(45 60 20)" />
          <rect x="0" y="40" width="40" height="40" fill="#8B7355" transform="rotate(45 20 60)" />
          <rect x="40" y="40" width="40" height="40" fill="#9B3D9B" transform="rotate(45 60 60)" />
          <g transform="translate(60, 20) scale(0.15)">
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
          </g>
          <g transform="translate(20, 60) scale(0.15)">
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5zm20 0c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diamond-pattern)" />
    </svg>
  </div>
  <header class="site-header small">
    <div class="container header-inner">
      <a class="brand" href="home.php">
        <img src="assets/jojo.png" alt="JoJo's logo" class="logo-small">
        <div class="brand-text">
          <span class="brand-top">JoJo's</span>
          <span class="brand-sub">Bizarre <strong>COFFEE</strong></span>
        </div>
      </a>
      <div style="margin-left: auto; display: flex; align-items: center; gap: 15px;">
        <span>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?> (Admin)</span>
        <a href="logout.php" class="btn-secondary" style="text-decoration: none; display: inline-block;">Logout</a>
      </div>
    </div>
  </header>

  <main class="container dashboard-main">
    <h2>Admin Dashboard</h2>

    <div class="admin-section-tabs">
      <a href="dashboard_admin.php?section=menu" class="admin-section-tab <?php echo $section === 'orders' ? '' : 'is-active'; ?>">
        Menu Management
      </a>
      <a href="dashboard_admin.php?section=orders" class="admin-section-tab <?php echo $section === 'orders' ? 'is-active' : ''; ?>">
        Pending Orders
      </a>
    </div>
    
    <?php if ($message): ?>
      <div class="message <?php echo $messageType; ?>">
        <?php echo htmlspecialchars($message); ?>
      </div>
    <?php endif; ?>

    <?php if ($section !== 'orders'): ?>
      <div class="dashboard-controls">
        <button class="btn-primary" onclick="openAddForm()" <?php echo !$tableExists ? 'disabled title="Please create the menu_items table first"' : ''; ?>>Add New Item</button>
      </div>

      <?php if ($tableExists): ?>
        <?php if ($menuItems && $menuItems->num_rows > 0): ?>
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <?php while ($item = $menuItems->fetch_assoc()): ?>
                <tr>
                  <td><?php echo $item['id']; ?></td>
                  <td><?php echo htmlspecialchars($item['name']); ?></td>
                  <td><?php echo htmlspecialchars($item['category']); ?></td>
                  <td><?php echo htmlspecialchars($item['description']); ?></td>
                  <td>₱<?php echo number_format($item['price'], 2); ?></td>
                  <td>
                    <button class="btn-small" onclick="openEditForm(<?php echo $item['id']; ?>)">Edit</button>
                    <button class="btn-danger" onclick="confirmDelete(<?php echo $item['id']; ?>, '<?php echo htmlspecialchars(addslashes($item['name'])); ?>')">Delete</button>
                  </td>
                </tr>
              <?php endwhile; ?>
            </tbody>
          </table>
          <?php
          $start = $offset + 1;
          $end = $offset + ($menuItems ? $menuItems->num_rows : 0);
          if ($end > $menuTotal) {
              $end = $menuTotal;
          }
          ?>
          <p class="muted">
            Showing <?php echo $menuTotal ? $start : 0; ?>–<?php echo $end; ?> of <?php echo $menuTotal; ?> items
          </p>
          <?php if ($menuTotalPages > 1): ?>
            <nav class="admin-pagination">
              <?php for ($p = 1; $p <= $menuTotalPages; $p++): ?>
                <a
                  href="dashboard_admin.php?section=menu&page=<?php echo $p; ?>"
                  class="admin-page-link <?php echo $p === $page ? 'is-active' : ''; ?>"
                >
                  <?php echo $p; ?>
                </a>
              <?php endfor; ?>
            </nav>
          <?php endif; ?>
        <?php else: ?>
          <div class="empty-state">
            <p>No menu items found. Click "Add New Item" to get started.</p>
          </div>
          <p class="muted">Total items: 0</p>
        <?php endif; ?>
      <?php else: ?>
        <div class="empty-state">
          <p><strong>Menu items table not found.</strong></p>
          <p>Please run <a href="create_menu_table.php" style="color: #007bff; text-decoration: underline;">create_menu_table.php</a> first to create the database table.</p>
        </div>
      <?php endif; ?>
    <?php else: ?>
      <h3>Pending Orders</h3>
      <p class="muted">Orders placed from the customer dashboards that are still marked as pending.</p>

      <?php if ($ordersTableExists && !empty($pendingOrders)): ?>
        <table class="admin-table" style="margin-top: 1rem;">
          <thead>
            <tr>
              <th>Order #</th>
              <th>User ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Placed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($pendingOrders as $order): ?>
              <tr>
                <td><?php echo (int)$order['id']; ?></td>
                <td><?php echo (int)$order['user_id']; ?></td>
                <td>₱<?php echo number_format((float)$order['total'], 2); ?></td>
                <td><?php echo htmlspecialchars(ucfirst($order['status'])); ?></td>
                <td><?php echo htmlspecialchars($order['created_at']); ?></td>
                <td>
                  <form method="post" action="dashboard_admin.php?section=orders" style="display:inline-block; margin-right: 0.25rem;">
                    <input type="hidden" name="order_id" value="<?php echo (int)$order['id']; ?>">
                    <input type="hidden" name="order_action" value="process">
                    <button type="submit" class="btn-small">Mark Processed</button>
                  </form>
                  <form method="post" action="dashboard_admin.php?section=orders" style="display:inline-block;">
                    <input type="hidden" name="order_id" value="<?php echo (int)$order['id']; ?>">
                    <input type="hidden" name="order_action" value="revoke">
                    <button type="submit" class="btn-danger btn-small">Revoke</button>
                  </form>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
        <p class="muted">Total pending orders: <?php echo count($pendingOrders); ?></p>
      <?php elseif ($ordersTableExists): ?>
        <div class="empty-state">
          <p>No pending orders at the moment.</p>
        </div>
      <?php else: ?>
        <div class="empty-state">
          <p><strong>No orders table found.</strong></p>
          <p>Once you run the SQL to create the <code>orders</code> table, new orders will appear here.</p>
        </div>
      <?php endif; ?>
    <?php endif; ?>
  </main>

  <!-- Add/Edit Form Modal -->
  <div id="formModal" class="form-modal">
    <div class="form-container">
      <h3><?php echo $editItem ? 'Edit Menu Item' : 'Add New Menu Item'; ?></h3>
      <form method="POST" action="dashboard_admin.php">
        <?php if ($editItem): ?>
          <input type="hidden" name="id" value="<?php echo $editItem['id']; ?>">
        <?php endif; ?>
        
        <div class="form-group">
          <label for="name">Item Name *</label>
          <input type="text" id="name" name="name" required 
                 value="<?php echo $editItem ? htmlspecialchars($editItem['name']) : ''; ?>">
        </div>
        
        <div class="form-group">
          <label for="category">Category *</label>
          <input type="text" id="category" name="category" required list="categories"
                 value="<?php echo $editItem ? htmlspecialchars($editItem['category']) : ''; ?>">
          <datalist id="categories">
            <option value="Croffle">
            <option value="Stand Brews">
            <option value="Joestar Blends">
            <option value="Bizarre Blends">
          </datalist>
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" name="description"><?php echo $editItem ? htmlspecialchars($editItem['description']) : ''; ?></textarea>
        </div>
        
        <div class="form-group">
          <label for="price">Price (₱) *</label>
          <input type="number" id="price" name="price" step="0.01" min="0" required 
                 value="<?php echo $editItem ? $editItem['price'] : ''; ?>">
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn-primary"><?php echo $editItem ? 'Update' : 'Add'; ?> Item</button>
          <button type="button" class="btn-secondary" onclick="closeForm()">Cancel</button>
        </div>
      </form>
    </div>
  </div>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Contact Us</h4>
          <p>0927 504 1084</p>
          <p>Open: 12PM - 10PM</p>
          <p>Email: Brunobrian05@gmail.com</p>
          <p>2 Homeowners Drive, Marikina City, Philippines, 1800</p>
        </div>
        <div class="footer-section">
          <h4>Social</h4>
          <a href="https://www.facebook.com/profile.php?id=61576343903474" target="_blank">Facebook</a>
        </div>
        <div class="footer-section">
          <h4>JoJo's Bizarre Coffee</h4>
          <p>Where every sip is an adventure.</p>
        </div>
      </div>
      <div class="footer-bottom">
        © JoJo's Bizarre Coffee — All Rights Reserved
      </div>
    </div>
  </footer>

  <script>
    function openAddForm() {
      // Reset form and show modal
      document.getElementById('formModal').classList.add('active');
      document.querySelector('#formModal form').reset();
      document.querySelector('#formModal input[name="id"]')?.remove();
      document.querySelector('#formModal h3').textContent = 'Add New Menu Item';
      document.querySelector('#formModal button[type="submit"]').textContent = 'Add Item';
    }

    function openEditForm(id) {
      window.location.href = 'dashboard_admin.php?edit=' + id;
    }

    function closeForm() {
      document.getElementById('formModal').classList.remove('active');
      // If editing, redirect to remove edit parameter
      if (window.location.search.includes('edit=')) {
        window.location.href = 'dashboard_admin.php';
      }
    }

    function confirmDelete(id, name) {
      if (confirm('Are you sure you want to delete "' + name + '"? This action cannot be undone.')) {
        window.location.href = 'dashboard_admin.php?delete=' + id;
      }
    }

    // Show modal if editing
    <?php if ($editItem): ?>
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('formModal').classList.add('active');
    });
    <?php endif; ?>

    // Close modal on outside click
    document.getElementById('formModal')?.addEventListener('click', function(e) {
      if (e.target === this) {
        closeForm();
      }
    });
  </script>
</body>
</html>
<?php
$conn->close();
?>
