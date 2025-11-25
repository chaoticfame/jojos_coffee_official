<?php
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

require_once 'db.php';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — User Dashboard</title>
  <link rel="stylesheet" href="style.css?v=2">
  <script defer src="script.js"></script>
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
        <span>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></span>
        <a href="logout.php" class="btn-secondary" style="text-decoration: none; display: inline-block;">Logout</a>
      </div>
    </div>
  </header>

  <main class="container dashboard-main">
    <h2>User Dashboard</h2>
    
    <div style="margin-bottom: 30px;">
      <h3>Menu Items</h3>
      <p>Browse our available menu items below:</p>
    </div>

    <table class="admin-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Golden Classic Croffle</td>
          <td>Croffle</td>
          <td>Whipped Cream, Maple Syrup, Butter</td>
          <td>₱159</td>
        </tr>

        <tr>
          <td>Americano (16oz)</td>
          <td>Stand Brews</td>
          <td>Classic espresso with hot water</td>
          <td>₱99</td>
        </tr>

        <tr>
          <td>Biscoff Coffee</td>
          <td>Joestar Blends</td>
          <td>Biscoff syrup and signature blend</td>
          <td>₱159</td>
        </tr>
      </tbody>
    </table>
    <p class="muted">User dashboard - View menu items and place orders</p>
  </main>

  <footer class="site-footer">
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
  </footer>
</body>
</html>
<?php
$conn->close();
?>

