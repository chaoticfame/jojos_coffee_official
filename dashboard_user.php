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
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
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

