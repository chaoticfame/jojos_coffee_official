<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

require_once 'db.php';

// --- Optional persistent storage tables ---
$cartTableExists = false;
$ordersTableExists = false;
$orderItemsTableExists = false;
$profilesTableExists = false;

if ($conn) {
    $res = $conn->query("SHOW TABLES LIKE 'user_cart_items'");
    if ($res && $res->num_rows > 0) {
        $cartTableExists = true;
    }

    $res = $conn->query("SHOW TABLES LIKE 'orders'");
    if ($res && $res->num_rows > 0) {
        $ordersTableExists = true;
    }

    $res = $conn->query("SHOW TABLES LIKE 'order_items'");
    if ($res && $res->num_rows > 0) {
        $orderItemsTableExists = true;
    }

    $res = $conn->query("SHOW TABLES LIKE 'user_profiles'");
    if ($res && $res->num_rows > 0) {
        $profilesTableExists = true;
    }
}

// --- Simple session-based cart helpers ---
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}
if (!isset($_SESSION['cart_meta'])) {
    $_SESSION['cart_meta'] = [];
}

// Size-based pricing for Joestar Blends / Mixed Hamon
function jojo_get_item_price_with_size($basePrice, $category, $size) {
    $category = trim((string)$category);
    $size = strtolower(trim((string)$size));

    // Joestar Blends: 16oz = 159, 22oz = 179
    if ($category === 'Joestar Blends') {
        if ($size === '22oz') {
            return 179.0;
        }
        // Default / 16oz
        return 159.0;
    }

    // Mixed Hamon: 16oz = 139, 22oz = 159
    if ($category === 'Mixed Hamon') {
        if ($size === '22oz') {
            return 159.0;
        }
        // Default / 16oz
        return 139.0;
    }

    // All other categories use the base price from the menu_items table
    return (float)$basePrice;
}

function cart_add_item($itemId, $qty = 1) {
    $itemId = (int)$itemId;
    $qty = max(1, (int)$qty);

    if (!isset($_SESSION['cart'][$itemId])) {
        $_SESSION['cart'][$itemId] = 0;
    }
    $_SESSION['cart'][$itemId] += $qty;

    // Persist to database cart if available
    global $conn, $cartTableExists;
    if ($cartTableExists && isset($_SESSION['user_id'])) {
        $userId = (int)$_SESSION['user_id'];
        if ($stmt = $conn->prepare("INSERT INTO user_cart_items (user_id, menu_item_id, qty)
                                    VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)")) {
            $stmt->bind_param('iii', $userId, $itemId, $qty);
            $stmt->execute();
            $stmt->close();
        }
    }
}

function cart_update_qty($itemId, $qty) {
    $itemId = (int)$itemId;
    $qty = (int)$qty;

    if ($qty <= 0) {
        unset($_SESSION['cart'][$itemId]);
    } else {
        $_SESSION['cart'][$itemId] = $qty;
    }

    // Persist update to database cart if available
    global $conn, $cartTableExists;
    if ($cartTableExists && isset($_SESSION['user_id'])) {
        $userId = (int)$_SESSION['user_id'];

        if ($qty <= 0) {
            if ($stmt = $conn->prepare("DELETE FROM user_cart_items WHERE user_id = ? AND menu_item_id = ?")) {
                $stmt->bind_param('ii', $userId, $itemId);
                $stmt->execute();
                $stmt->close();
            }
        } else {
            if ($stmt = $conn->prepare("INSERT INTO user_cart_items (user_id, menu_item_id, qty)
                                        VALUES (?, ?, ?)
                                        ON DUPLICATE KEY UPDATE qty = VALUES(qty)")) {
                $stmt->bind_param('iii', $userId, $itemId, $qty);
                $stmt->execute();
                $stmt->close();
            }
        }
    }
}

function cart_remove_item($itemId) {
    $itemId = (int)$itemId;
    unset($_SESSION['cart'][$itemId]);

    // Remove from database cart if available
    global $conn, $cartTableExists;
    if ($cartTableExists && isset($_SESSION['user_id'])) {
        $userId = (int)$_SESSION['user_id'];
        if ($stmt = $conn->prepare("DELETE FROM user_cart_items WHERE user_id = ? AND menu_item_id = ?")) {
            $stmt->bind_param('ii', $userId, $itemId);
            $stmt->execute();
            $stmt->close();
        }
    }
}

function cart_get_count() {
    $count = 0;
    foreach ($_SESSION['cart'] as $qty) {
        $count += (int)$qty;
    }
    return $count;
}

// Handle cart actions & profile/checkout for non-AJAX (dashboard forms)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    if ($action === 'update' && isset($_POST['item_id'], $_POST['qty'])) {
        cart_update_qty($_POST['item_id'], $_POST['qty']);
        header('Location: dashboard_user.php?view=cart');
        exit();
    } elseif ($action === 'remove' && isset($_POST['item_id'])) {
        cart_remove_item($_POST['item_id']);
        header('Location: dashboard_user.php?view=cart');
        exit();
    } elseif ($action === 'checkout') {
        // Convert current cart into a saved order + items
        if (empty($_SESSION['cart'])) {
            header('Location: dashboard_user.php?view=cart&order=empty');
            exit();
        }

        global $conn, $ordersTableExists, $orderItemsTableExists, $cartTableExists;

        if (!$ordersTableExists || !$orderItemsTableExists) {
            header('Location: dashboard_user.php?view=cart&order=error');
            exit();
        }

        $userId = (int)$_SESSION['user_id'];
        $ids = array_keys($_SESSION['cart']);
        $ids = array_map('intval', $ids);
        $idsList = implode(',', $ids);

        if ($idsList === '') {
            header('Location: dashboard_user.php?view=cart&order=empty');
            exit();
        }

        $result = $conn->query("SELECT id, name, category, price FROM menu_items WHERE id IN ($idsList)");
        if (!$result || $result->num_rows === 0) {
            header('Location: dashboard_user.php?view=cart&order=empty');
            exit();
        }

        $itemsForOrder = [];
        $subtotal = 0.0;
        while ($row = $result->fetch_assoc()) {
            $id = (int)$row['id'];
            $qty = isset($_SESSION['cart'][$id]) ? (int)$_SESSION['cart'][$id] : 0;
            if ($qty <= 0) {
                continue;
            }

            $category = $row['category'];
            $basePrice = (float)$row['price'];
            $size = '';
            if (isset($_SESSION['cart_meta'][$id]['size'])) {
                $size = $_SESSION['cart_meta'][$id]['size'];
            }

            $finalPrice = jojo_get_item_price_with_size($basePrice, $category, $size);
            $displayName = $row['name'];
            if ($size) {
                $displayName .= ' (' . strtoupper($size) . ')';
            }

            $itemsForOrder[] = [
                'menu_item_id'   => $id,
                'name'           => $displayName,
                'size'           => $size,
                'price'          => $finalPrice,
                'qty'            => $qty,
            ];
            $subtotal += $finalPrice * $qty;
        }

        if (empty($itemsForOrder)) {
            header('Location: dashboard_user.php?view=cart&order=empty');
            exit();
        }

        $total = $subtotal; // Extend later for tax/fees if needed

        $stmt = $conn->prepare("INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'pending')");
        if ($stmt) {
            $stmt->bind_param('id', $userId, $total);
            if ($stmt->execute()) {
                $orderId = $stmt->insert_id;
                $stmt->close();

                if ($itemStmt = $conn->prepare("INSERT INTO order_items (order_id, menu_item_id, item_name, item_price, qty) VALUES (?, ?, ?, ?, ?)")) {
                    foreach ($itemsForOrder as $it) {
                        $menuItemId = $it['menu_item_id'];
                        $name = $it['name'];
                        $price = $it['price'];
                        $qty = $it['qty'];
                        $itemStmt->bind_param('iisdi', $orderId, $menuItemId, $name, $price, $qty);
                        $itemStmt->execute();
                    }
                    $itemStmt->close();
                }

                // Clear cart in session & persistent cart
                $_SESSION['cart'] = [];
                if ($cartTableExists) {
                    if ($clearStmt = $conn->prepare("DELETE FROM user_cart_items WHERE user_id = ?")) {
                        $clearStmt->bind_param('i', $userId);
                        $clearStmt->execute();
                        $clearStmt->close();
                    }
                }

                header('Location: dashboard_user.php?view=cart&order=success');
                exit();
            }

            $stmt->close();
        }

        header('Location: dashboard_user.php?view=cart&order=error');
        exit();
    } elseif ($action === 'save_profile') {
        // Save / update profile for current user
        global $conn, $profilesTableExists;

        if (!$profilesTableExists || !isset($_SESSION['user_id'])) {
            header('Location: dashboard_user.php?view=profile&saved=0');
            exit();
        }

        $userId = (int)$_SESSION['user_id'];
        $fullName = trim($_POST['full_name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $favoriteStand = trim($_POST['favorite_stand'] ?? '');
        $coffeeNotes = trim($_POST['coffee_notes'] ?? '');

        $stmt = $conn->prepare("
            INSERT INTO user_profiles (user_id, full_name, phone, favorite_stand, coffee_notes)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              full_name = VALUES(full_name),
              phone = VALUES(phone),
              favorite_stand = VALUES(favorite_stand),
              coffee_notes = VALUES(coffee_notes)
        ");

        if ($stmt) {
            $stmt->bind_param('issss', $userId, $fullName, $phone, $favoriteStand, $coffeeNotes);
            $stmt->execute();
            $stmt->close();
        }

        header('Location: dashboard_user.php?view=profile&saved=1');
        exit();
    }
}

// Fetch menu items dynamically for Order Menu view (grouped like public menu)
$menuItems = null;
$orderItemsByCategory = [];
$orderCategories = [];
$orderActiveCategory = isset($_GET['order_category']) ? trim($_GET['order_category']) : '';

$tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
if ($tableCheck && $tableCheck->num_rows > 0) {
    $menuItems = $conn->query("SELECT * FROM menu_items ORDER BY category, name");
    if ($menuItems && $menuItems->num_rows > 0) {
                        while ($row = $menuItems->fetch_assoc()) {
            $cat = $row['category'] ?: 'Uncategorized';
            if (!isset($orderItemsByCategory[$cat])) {
                $orderItemsByCategory[$cat] = [];
                $orderCategories[] = $cat;
            }
            $orderItemsByCategory[$cat][] = $row;
        }
    }
}

$cartCount = cart_get_count();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — User Dashboard</title>
  <link rel="stylesheet" href="style.css?v=6">
  <script defer src="script.js?v=6"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
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
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="home.php">
        <img src="assets/jojo.png" alt="JoJo's logo" class="logo-small">
        <div class="brand-text">
          <span class="brand-top">JoJo's</span>
          <span class="brand-sub">Bizarre <strong>COFFEE</strong></span>
        </div>
      </a>

      <nav class="main-nav" id="mainNav">
        <ul>
          <li><a href="home.php">Home</a></li>
          <li><a href="menu.php">Menu</a></li>
          <li><a href="aboutJojo.php">About JoJo</a></li>
          <li class="nav-user">
            <button type="button" class="nav-user-trigger">
              Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>
              <span class="nav-user-caret">▾</span>
            </button>
            <ul class="nav-user-menu">
              <?php if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin'): ?>
                <li><a href="dashboard_admin.php">Admin Dashboard</a></li>
              <?php else: ?>
                <li><a href="menu.php">Order Menu</a></li>
                <li>
                  <a href="dashboard_user.php?view=cart">
                    My Cart
                    <span class="cart-badge <?php echo $cartCount ? '' : 'is-empty'; ?>" data-cart-count><?php echo (int)$cartCount; ?></span>
                  </a>
                </li>
                <li><a href="dashboard_user.php?view=orders">Order History</a></li>
                <li><a href="dashboard_user.php?view=profile">Profile &amp; Settings</a></li>
              <?php endif; ?>
              <li><a href="logout.php">Logout</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">☰</button>
    </div>
  </header>

  <?php
  // Determine active dashboard view
  $view = isset($_GET['view']) ? $_GET['view'] : 'menu';
  ?>

  <div class="dashboard-container">
    <main class="dashboard-content">
      <!-- Order / Menu View -->
      <div class="dash-view <?php echo $view === 'menu' ? 'active' : ''; ?>">
        <section class="order-menu-layer">
          <div class="order-menu-inner">
            <div class="menu-header" style="margin-top: 0;">
              <h3 class="section-title">Order <span class="text-highlight">Menu</span></h3>
              <p class="menu-intro">
                Select your items and add them to your cart.
              </p>
            </div>

            <?php if (!empty($orderItemsByCategory)): ?>
              <!-- Category filter pills (same pattern as public menu) -->
              <div class="filters reveal-on-scroll">
                <div class="filter-group">
                  <a class="pill <?php echo $orderActiveCategory === '' ? 'active' : ''; ?>"
                     href="dashboard_user.php?view=menu">All</a>
                  <?php foreach ($orderCategories as $cat): ?>
                    <?php $href = 'dashboard_user.php?view=menu&order_category=' . urlencode($cat); ?>
                    <a class="pill <?php echo $orderActiveCategory === $cat ? 'active' : ''; ?>"
                       href="<?php echo $href; ?>">
                      <?php echo htmlspecialchars($cat); ?>
                    </a>
                  <?php endforeach; ?>
                </div>
              </div>

              <div class="menu-grid-container">
                <?php foreach ($orderItemsByCategory as $cat => $items): ?>
                  <?php
                  if ($orderActiveCategory !== '' && $orderActiveCategory !== $cat) {
                    continue;
                  }
                  ?>
                  <div class="category-section">
                    <h4 class="category-title reveal-on-scroll"><?php echo htmlspecialchars($cat); ?></h4>
                    <div class="items-grid">
                      <?php foreach ($items as $item): ?>
                        <?php
                          $isJoestarBlend = ($cat === 'Joestar Blends');
                          $isMixedHamon   = ($cat === 'Mixed Hamon');
                          $hasSizes       = $isJoestarBlend || $isMixedHamon;
                          if ($isJoestarBlend) {
                            $price16 = 159.0;
                            $price22 = 179.0;
                          } elseif ($isMixedHamon) {
                            $price16 = 139.0;
                            $price22 = 159.0;
                          } else {
                            $price16 = (float)$item['price'];
                            $price22 = 0.0;
                          }
                        ?>
                        <div class="menu-item-card reveal-on-scroll">
                          <div class="item-header">
                            <h5 class="item-name"><?php echo htmlspecialchars($item['name']); ?></h5>
                            <?php if ($hasSizes): ?>
                              <span class="item-price">
                                16oz ₱<?php echo number_format($price16, 2); ?>
                                &nbsp;·&nbsp;
                                22oz ₱<?php echo number_format($price22, 2); ?>
                              </span>
                            <?php else: ?>
                              <span class="item-price">₱<?php echo number_format($item['price'], 2); ?></span>
                            <?php endif; ?>
                          </div>
                          <?php if (!empty($item['description'])): ?>
                            <p class="item-desc"><?php echo htmlspecialchars($item['description']); ?></p>
                          <?php endif; ?>

                          <?php if ($hasSizes): ?>
                            <div class="item-size-row">
                              <label class="item-size-label" for="dash-size-<?php echo (int)$item['id']; ?>">Size</label>
                              <select
                                id="dash-size-<?php echo (int)$item['id']; ?>"
                                class="item-size-select"
                                data-size-select
                              >
                                <option value="16oz">
                                  16oz — ₱<?php echo number_format($price16, 2); ?>
                                </option>
                                <option value="22oz">
                                  22oz — ₱<?php echo number_format($price22, 2); ?>
                                </option>
                              </select>
                            </div>
                          <?php endif; ?>

                          <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: auto; width: 100%;">
                            <button
                              type="button"
                              class="btn-add add-to-cart-btn"
                              data-item-id="<?php echo (int)$item['id']; ?>"
                              data-item-name="<?php echo htmlspecialchars($item['name'], ENT_QUOTES); ?>">
                              Add to Order
                            </button>
                          </div>
                        </div>
                      <?php endforeach; ?>
                    </div>
                  </div>
                <?php endforeach; ?>
              </div>
            <?php else: ?>
              <div class="empty-box reveal-on-scroll">
                No menu items available at the moment.
              </div>
            <?php endif; ?>
          </div>
        </section>
      </div>

      <!-- Cart View: Review Your Order -->
      <div class="dash-view <?php echo $view === 'cart' ? 'active' : ''; ?>">
        <section class="order-shell">
          <div class="order-header">
            <h1 class="order-title">Review Your Order</h1>
            <p class="order-subtitle">Check your items, adjust quantities, and get ready to proceed to checkout.</p>
            <?php
            $orderStatus = isset($_GET['order']) ? $_GET['order'] : '';
            if ($orderStatus === 'success'): ?>
              <div class="order-alert order-alert-success">
                Your order has been placed and added to your history.
              </div>
            <?php elseif ($orderStatus === 'empty'): ?>
              <div class="order-alert order-alert-warning">
                Your cart is empty. Add items before checking out.
              </div>
            <?php elseif ($orderStatus === 'error'): ?>
              <div class="order-alert order-alert-error">
                Something went wrong placing your order. Please try again.
              </div>
            <?php endif; ?>
          </div>

          <div class="order-layout">
            <!-- Left: Items -->
            <div class="order-items">
              <?php
              // Build cart items from session + database
              $cartItems = [];
              if (!empty($_SESSION['cart'])) {
                  $ids = array_keys($_SESSION['cart']);
                  $ids = array_map('intval', $ids);
                  $idsList = implode(',', $ids);

                  if ($idsList !== '') {
        $result = $conn->query("SELECT id, name, category, price FROM menu_items WHERE id IN ($idsList)");
                      if ($result) {
                          while ($row = $result->fetch_assoc()) {
                              $id = (int)$row['id'];
                              $qty = isset($_SESSION['cart'][$id]) ? (int)$_SESSION['cart'][$id] : 1;
                              if ($qty <= 0) continue;
                              $category = $row['category'];
                              $basePrice = (float)$row['price'];
                              $size = '';
                              if (isset($_SESSION['cart_meta'][$id]['size'])) {
                                  $size = $_SESSION['cart_meta'][$id]['size'];
                              }

                              $finalPrice = jojo_get_item_price_with_size($basePrice, $category, $size);
                              $meta = $size ? strtoupper($size) . ' size' : '';

                              $cartItems[] = [
                                  'id'    => $id,
                                  'name'  => $row['name'],
                                  'price' => $finalPrice,
                                  'qty'   => $qty,
                                  'meta'  => $meta,
                              ];
                          }
                      }
                  }
              }
              ?>

              <?php if (!empty($cartItems)): ?>
                <?php foreach ($cartItems as $item): ?>
                  <article class="order-item" data-price="<?php echo number_format($item['price'], 2, '.', ''); ?>">
                    <div class="order-item-main">
                      <div class="order-item-thumb">
                        <span class="order-item-initials">
                          <?php
                          $words = explode(' ', $item['name']);
                          $initials = '';
                          foreach ($words as $w) {
                            $initials .= strtoupper(mb_substr($w, 0, 1));
                            if (mb_strlen($initials) >= 2) break;
                          }
                          echo htmlspecialchars($initials);
                          ?>
                        </span>
                      </div>
                      <div class="order-item-info">
                        <h3 class="order-item-name"><?php echo htmlspecialchars($item['name']); ?></h3>
                        <?php if (!empty($item['meta'])): ?>
                          <p class="order-item-meta"><?php echo htmlspecialchars($item['meta']); ?></p>
                        <?php endif; ?>
                      </div>
                    </div>

                    <div class="order-item-right">
                      <form method="post" action="dashboard_user.php?view=cart" class="order-qty-control">
                        <input type="hidden" name="action" value="update">
                        <input type="hidden" name="item_id" value="<?php echo (int)$item['id']; ?>">
                        <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">−</button>
                        <span class="qty-value"><?php echo (int)$item['qty']; ?></span>
                        <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                        <input type="hidden" name="qty" value="<?php echo (int)$item['qty']; ?>" class="qty-input-hidden">
                      </form>
                      <div class="order-item-price">
                        ₱<span class="order-item-price-value"><?php echo number_format($item['price'], 2); ?></span>
                      </div>
                      <form method="post" action="dashboard_user.php?view=cart" style="margin: 0;">
                        <input type="hidden" name="action" value="remove">
                        <input type="hidden" name="item_id" value="<?php echo (int)$item['id']; ?>">
                        <button type="submit" class="order-item-remove" aria-label="Remove item">🗑</button>
                      </form>
                    </div>
                  </article>
                <?php endforeach; ?>
              <?php else: ?>
                <div class="empty-box">
                  <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">🛒</span>
                  <p>Your cart is currently empty.</p>
                  <a href="menu.php" class="btn-primary" style="display: inline-block; margin-top: 1rem;">Browse Menu</a>
                </div>
              <?php endif; ?>
            </div>

            <!-- Right: Summary -->
            <aside class="order-summary">
              <div class="order-summary-card">
                <h2 class="order-summary-title">Order Summary</h2>
                <dl class="order-summary-list">
                  <div class="order-summary-row order-summary-total">
                    <dt>Total</dt>
                    <dd>₱<span data-order-total>0.00</span></dd>
                  </div>
                </dl>
                <form method="post" action="dashboard_user.php?view=cart">
                  <input type="hidden" name="action" value="checkout">
                  <button type="submit" class="order-checkout-btn">
                    Place Order
                  </button>
                </form>
                <p class="order-summary-note">Your order will be saved in your history. Payment &amp; pickup details can be added later.</p>
              </div>
            </aside>
          </div>
        </section>
    </div>

      <!-- Order History View -->
      <div class="dash-view <?php echo $view === 'orders' ? 'active' : ''; ?>">
        <section class="order-history-shell">
          <div class="order-header">
            <h1 class="order-title">Order History</h1>
            <p class="order-subtitle">See your past orders at JoJo's Bizarre Coffee.</p>
          </div>
          <?php
          $orders = [];
          if (isset($_SESSION['user_id']) && $ordersTableExists && $orderItemsTableExists) {
              $userId = (int)$_SESSION['user_id'];
              if ($stmt = $conn->prepare("SELECT id, total, status, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC")) {
                  $stmt->bind_param('i', $userId);
                  $stmt->execute();
                  $result = $stmt->get_result();
                  while ($row = $result->fetch_assoc()) {
                      $orders[] = $row;
                  }
                  $stmt->close();
              }
          }
          ?>
          <?php if (!empty($orders)): ?>
            <div class="order-history-list">
              <?php foreach ($orders as $order): ?>
                <?php
                  $items = [];
                  if ($orderItemsTableExists) {
                      if ($itemStmt = $conn->prepare("SELECT item_name, item_price, qty FROM order_items WHERE order_id = ?")) {
                          $orderId = (int)$order['id'];
                          $itemStmt->bind_param('i', $orderId);
                          $itemStmt->execute();
                          $itemRes = $itemStmt->get_result();
                          while ($irow = $itemRes->fetch_assoc()) {
                              $items[] = $irow;
                          }
                          $itemStmt->close();
                      }
                  }
                ?>
                <article class="order-history-card">
                  <header class="order-history-card-header">
                    <div>
                      <h2 class="order-history-id">Order #<?php echo (int)$order['id']; ?></h2>
                      <p class="order-history-date">
                        <?php
                        $ts = $order['created_at'] ?? '';
                        echo htmlspecialchars($ts ? date('M j, Y g:ia', strtotime($ts)) : '');
                        ?>
                      </p>
                    </div>
                    <div class="order-history-meta">
                      <span class="order-history-status"><?php echo htmlspecialchars(ucfirst($order['status'])); ?></span>
                      <span class="order-history-total">₱<?php echo number_format((float)$order['total'], 2); ?></span>
                    </div>
                  </header>
                  <?php if (!empty($items)): ?>
                    <ul class="order-history-items">
                      <?php foreach ($items as $it): ?>
                        <li class="order-history-item">
                          <span class="order-history-item-name">
                            <?php echo htmlspecialchars($it['item_name']); ?>
                          </span>
                          <span class="order-history-item-qty">
                            ×<?php echo (int)$it['qty']; ?>
                          </span>
                          <span class="order-history-item-price">
                            ₱<?php echo number_format((float)$it['item_price'], 2); ?>
                          </span>
                        </li>
                      <?php endforeach; ?>
                    </ul>
                  <?php else: ?>
                    <p class="order-history-empty-items">No items recorded for this order.</p>
                  <?php endif; ?>
                </article>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <div class="empty-box">
              <p>You haven't placed any orders yet.</p>
            </div>
          <?php endif; ?>
        </section>
      </div>

      <!-- Profile / Settings View -->
      <div class="dash-view <?php echo $view === 'profile' ? 'active' : ''; ?>">
        <section class="profile-shell">
          <div class="order-header">
            <h1 class="order-title">Profile &amp; Settings</h1>
            <p class="order-subtitle">Update your Joestar identity and contact details.</p>
          </div>
          <?php
          $profile = [
              'full_name' => '',
              'phone' => '',
              'favorite_stand' => '',
              'coffee_notes' => ''
          ];
          if (isset($_SESSION['user_id']) && $profilesTableExists) {
              $userId = (int)$_SESSION['user_id'];
              if ($stmt = $conn->prepare("SELECT full_name, phone, favorite_stand, coffee_notes FROM user_profiles WHERE user_id = ? LIMIT 1")) {
                  $stmt->bind_param('i', $userId);
                  $stmt->execute();
                  $res = $stmt->get_result();
                  if ($row = $res->fetch_assoc()) {
                      $profile = array_merge($profile, $row);
                  }
                  $stmt->close();
              }
          }
          $profileSaved = isset($_GET['saved']) && $_GET['saved'] === '1';
          ?>
          <?php if ($profileSaved): ?>
            <div class="profile-alert profile-alert-success">
              Your profile has been updated.
            </div>
          <?php endif; ?>

          <form method="post" action="dashboard_user.php?view=profile" class="profile-form">
            <input type="hidden" name="action" value="save_profile">
            <div class="profile-grid">
              <div class="profile-field">
                <label for="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value="<?php echo htmlspecialchars($profile['full_name'] ?? ''); ?>"
                  placeholder="e.g. Jolus Joestar"
                >
              </div>
              <div class="profile-field">
                <label for="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value="<?php echo htmlspecialchars($profile['phone'] ?? ''); ?>"
                  placeholder="Your contact number"
                >
              </div>
              <div class="profile-field">
                <label for="favorite_stand">Favorite Stand</label>
                <input
                  type="text"
                  id="favorite_stand"
                  name="favorite_stand"
                  value="<?php echo htmlspecialchars($profile['favorite_stand'] ?? ''); ?>"
                  placeholder="Star Platinum, Crazy Diamond, ..."
                >
              </div>
              <div class="profile-field profile-field-notes">
                <label for="coffee_notes">Coffee Notes</label>
                <textarea
                  id="coffee_notes"
                  name="coffee_notes"
                  rows="4"
                  placeholder="Tell us how you like your coffee or any allergies."
                ><?php echo htmlspecialchars($profile['coffee_notes'] ?? ''); ?></textarea>
              </div>
            </div>
            <button type="submit" class="order-checkout-btn profile-save-btn">
              Save Profile
            </button>
          </form>
        </section>
      </div>
  </main>
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
          <h4>JoJo's Bizarre Café</h4>
          <p>Where every sip is an adventure.</p>
        </div>
      </div>
      <div class="footer-bottom">
        © JoJo's Bizarre Café — All Rights Reserved
      </div>
    </div>
  </footer>
</body>
</html>
<?php
$conn->close();
?>

