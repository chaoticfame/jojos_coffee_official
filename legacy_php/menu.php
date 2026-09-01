<?php
session_start();
// Ensure cart session exists and compute current count for nav badge
if (!isset($_SESSION['cart'])) {
  $_SESSION['cart'] = [];
}
$cartCount = 0;
foreach ($_SESSION['cart'] as $qty) {
  $cartCount += (int)$qty;
}

require_once 'db.php';

// Inputs
$activeCategory = isset($_GET['category']) ? trim($_GET['category']) : '';
$search = isset($_GET['q']) ? trim($_GET['q']) : '';

// Check table
$tableExists = false;
$tableCheck = $conn->query("SHOW TABLES LIKE 'menu_items'");
if ($tableCheck && $tableCheck->num_rows > 0) {
  $tableExists = true;
}

//  categories
$categories = [];
if ($tableExists) {
  $cats = $conn->query("SELECT DISTINCT category FROM menu_items ORDER BY category");
  if ($cats) {
    while ($row = $cats->fetch_assoc()) {
      if (!empty($row['category'])) { $categories[] = $row['category']; }
    }
  }
}

// Fetch items (optionally filtered)
$itemsByCategory = [];
if ($tableExists) {
  $where = [];
  $params = [];
  $types = '';

  if ($activeCategory !== '') {
    $where[] = 'category = ?';
    $params[] = $activeCategory;
    $types .= 's';
  }
  if ($search !== '') {
    $where[] = '(name LIKE ? OR description LIKE ?)';
    $params[] = "%$search%";
    $params[] = "%$search%";
    $types .= 'ss';
  }

  $sql = 'SELECT id, name, category, description, price FROM menu_items';
  if (!empty($where)) {
    $sql .= ' WHERE ' . implode(' AND ', $where);
  }
  $sql .= ' ORDER BY category, name';

  if (!empty($params)) {
    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $res = $stmt->get_result();
  } else {
    $res = $conn->query($sql);
  }

  if ($res) {
    while ($row = $res->fetch_assoc()) {
      $cat = $row['category'] ?: 'Uncategorized';
      if (!isset($itemsByCategory[$cat])) { $itemsByCategory[$cat] = []; }
      $itemsByCategory[$cat][] = $row;
    }
  }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Menu</title>
  <link rel="stylesheet" href="style.css?v=6">
  <script defer src="script.js?v=6"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <script>
    // Expose login state so Add to Order on public menu can redirect guests
    window.isLoggedIn = <?php echo isset($_SESSION['user_id']) ? 'true' : 'false'; ?>;
  </script>
</head>
<body class="home">
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
          <?php if (isset($_SESSION['user_id'])): ?>
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
          <?php else: ?>
            <li><a href="register.php">Register</a></li>
            <li><a href="login.php">Sign In</a></li>
          <?php endif; ?>
        </ul>
      </nav>

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">☰</button>
    </div>
  </header>

  <section class="menu-layer">
    <div class="menu-overlay-gradient"></div>
    <div class="container menu-content-wrapper">
      <div class="menu-header">
        <h3 class="section-title reveal-on-scroll">Our <span class="text-highlight">Legendary Menu</span></h3>
        <p class="menu-intro reveal-on-scroll">
          Taste the adventure with our Stand-infused delicacies. From Stardust brews to Diamond-unbreakable croffles.
        </p>
      </div>

      <?php if (!$tableExists): ?>
        <div class="empty-box reveal-on-scroll">
          Menu is not available yet. Please ask the administrator to set it up.
        </div>
      <?php else: ?>

        <div class="filters reveal-on-scroll">
          <div class="filter-group">
            <a class="pill <?php echo $activeCategory === '' ? 'active' : ''; ?>" href="menu.php<?php echo $search ? ('?q=' . urlencode($search)) : ''; ?>">All</a>
            <?php foreach ($categories as $cat): ?>
              <?php
                $href = 'menu.php?category=' . urlencode($cat);
                if ($search) { $href .= '&q=' . urlencode($search); }
              ?>
              <a class="pill <?php echo $activeCategory === $cat ? 'active' : ''; ?>" href="<?php echo $href; ?>">
                <?php echo htmlspecialchars($cat); ?>
              </a>
            <?php endforeach; ?>
          </div>
        </div>

        <?php if (empty($itemsByCategory)): ?>
          <div class="empty-box reveal-on-scroll">
            No items found.
          </div>
        <?php else: ?>
          <div class="menu-grid-container">
            <?php foreach ($itemsByCategory as $cat => $items): ?>
              <div class="category-section">
                <h4 class="category-title reveal-on-scroll"><?php echo htmlspecialchars($cat); ?></h4>
                <div class="items-grid">
                  <?php foreach ($items as $it): ?>
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
                        $price16 = (float)$it['price'];
                        $price22 = 0.0;
                      }
                    ?>
                    <div class="menu-item-card reveal-on-scroll">
                      <div class="item-header">
                        <h5 class="item-name"><?php echo htmlspecialchars($it['name']); ?></h5>
                        <?php if ($hasSizes): ?>
                          <span class="item-price">
                            16oz ₱<?php echo number_format($price16, 2); ?>
                            &nbsp;·&nbsp;
                            22oz ₱<?php echo number_format($price22, 2); ?>
                          </span>
                        <?php else: ?>
                          <span class="item-price">₱<?php echo number_format((float)$it['price'], 2); ?></span>
                        <?php endif; ?>
                      </div>
                      <?php if (!empty($it['description'])): ?>
                        <p class="item-desc"><?php echo htmlspecialchars($it['description']); ?></p>
                      <?php endif; ?>

                      <?php if ($hasSizes): ?>
                        <div class="item-size-row">
                          <label class="item-size-label" for="size-<?php echo (int)$it['id']; ?>">Size</label>
                          <select
                            id="size-<?php echo (int)$it['id']; ?>"
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
                          data-item-id="<?php echo (int)$it['id']; ?>"
                          data-item-name="<?php echo htmlspecialchars($it['name'], ENT_QUOTES); ?>">
                          Add to Order
                        </button>
                      </div>
                    </div>
                  <?php endforeach; ?>
                </div>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

      <?php endif; ?>

    </div>
  </section>

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
</body>
</html>
<?php $conn->close(); ?>

