<?php
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
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;600&display=swap" rel="stylesheet">
  <style>
    .filters { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin: 20px 0; }
    .pill { padding: 6px 12px; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; text-decoration: none; color: rgba(255,255,255,0.95); font-size: 14px; background: transparent; }
    .pill.active { background: var(--accent-yellow); color: #2a1530; border-color: var(--accent-yellow); }
    .search-box { display: flex; gap: 8px; margin-left: auto; }
    .search-box input { padding: 8px 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.02); color: #fff; border-radius: 4px; min-width: 220px; }
    .menu-card-header { display: flex; align-items: baseline; justify-content: space-between; }
    .price { font-weight: 700; }
    .empty-box { padding:20px; background: var(--glass); border:1px solid rgba(255,255,255,0.06); border-radius:6px; color: var(--muted); }
  </style>
</head>
<body class="home">
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
          <li><a href="contact.php">Contact</a></li>
          <li><a href="register.php">Register</a></li>
          <li><a href="login.php">User Login</a></li>
          <li><a href="login_admin.php">Admin Login</a></li>
        </ul>
      </nav>

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">☰</button>
    </div>
  </header>

  <section class="menu-section" style="padding-top: 100px;">
    <div class="container">
      <h3 class="section-title">Our Menu</h3>

      <?php if (!$tableExists): ?>
        <div class="empty-box">
          Menu is not available yet. Please ask the administrator to set it up.
        </div>
      <?php else: ?>

        <div class="filters">
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <a class="pill <?php echo $activeCategory === '' ? 'active' : ''; ?>" href="menu.php<?php echo $search ? ('?q=' . urlencode($search)) : ''; ?>">All</a>
            <?php foreach ($categories as $cat): ?>
              <?php
                $href = 'menu.php?category=' . urlencode($cat);
                if ($search) { $href .= '&q=' . urlencode($search); }
              ?>
              <a class="pill <?php echo $activeCategory === $cat ? 'active' : ''; ?>" href="<?php echo $href; ?>"><?php echo htmlspecialchars($cat); ?></a>
            <?php endforeach; ?>
          </div>
          <form class="search-box" method="get" action="menu.php">
            <?php if ($activeCategory): ?><input type="hidden" name="category" value="<?php echo htmlspecialchars($activeCategory); ?>"><?php endif; ?>
            <input type="text" name="q" value="<?php echo htmlspecialchars($search); ?>" placeholder="Search menu...">
            <button class="btn-primary" type="submit">Search</button>
          </form>
        </div>

        <?php if (empty($itemsByCategory)): ?>
          <div class="empty-box">
            No items found.
          </div>
        <?php else: ?>
          <div class="menu-grid">
            <?php foreach ($itemsByCategory as $cat => $items): ?>
              <div class="card">
                <div class="menu-card-header">
                  <h4><?php echo htmlspecialchars($cat); ?></h4>
                </div>
                <ul class="menu-list">
                  <?php foreach ($items as $it): ?>
                    <li>
                      <strong><?php echo htmlspecialchars($it['name']); ?></strong>
                      <?php if (!empty($it['description'])): ?> — <?php echo htmlspecialchars($it['description']); ?><?php endif; ?>
                      <span class="price">₱<?php echo number_format((float)$it['price'], 2); ?></span>
                    </li>
                  <?php endforeach; ?>
                </ul>
              </div>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>

        <div class="menu-image" style="margin-top: 40px;">
          <img src="assets/jjbamenu.jpg" alt="Full menu reference">
        </div>

      <?php endif; ?>

    </div>
  </section>

  <footer class="site-footer">
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
  </footer>
</body>
</html>
<?php $conn->close(); ?>

