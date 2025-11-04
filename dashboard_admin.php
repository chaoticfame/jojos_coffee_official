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

// Handle form submission (add/edit)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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

// Fetch all menu items
$menuItems = null;
$tableExists = false;

// Check if menu_items table exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
if ($tableCheck && $tableCheck->num_rows > 0) {
    $tableExists = true;
    $menuItems = $conn->query("SELECT * FROM menu_items ORDER BY category, name");
    if (!$menuItems) {
        $message = 'Error loading menu items: ' . $conn->error;
        $messageType = 'error';
    }
} else {
    $tableExists = false;
    $message = 'Menu items table does not exist. Please run <a href="create_menu_table.php">create_menu_table.php</a> first.';
    $messageType = 'error';
}
?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Admin Dashboard</title>
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
  <style>
    .message {
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
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
      background: white;
      padding: 30px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
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
      color: #666;
    }
  </style>
</head>
<body class="dashboard-page">
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
    <h2>Admin Dashboard — Menu Management</h2>
    
    <?php if ($message): ?>
      <div class="message <?php echo $messageType; ?>">
        <?php echo htmlspecialchars($message); ?>
      </div>
    <?php endif; ?>
    
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
        <p class="muted">Total items: <?php echo $menuItems->num_rows; ?></p>
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
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
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
