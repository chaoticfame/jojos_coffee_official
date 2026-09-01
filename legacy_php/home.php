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
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Coffee — Home</title>
  <link rel="stylesheet" href="style.css?v=6">
  <script defer src="script.js?v=6"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
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
            <path d="M50 10c-15 0-25 10-25 25 0 8 4 15 10 20l-5 15h10l5-10 5 10h10l-5-15c6-5 10-12 10-20 0-15-10-25-25-25zm-10 30c-2.5 0-5-2.5-5-5s2.5-5 5-5 5 2.5 5 5-2.5 5-5 5z" fill="#4A4A4A" opacity="0.6"/>
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

  <section class="hero-layer">
    <div class="hero-bg" style="background-image: url('assets/jojo4k3.jpg');"></div>
    <div class="hero-overlay-gradient"></div>
    <div class="container hero-content-wrapper">
      <div class="hero-text-col">
        <div class="hero-badge-wrapper">
          <span class="hero-badge">WHERE EVERY SIP IS AN ADVENTURE</span>
        </div>
        <h1 class="hero-main-title">Experience a <br><span class="text-highlight">Bizarre Brew</span></h1>
        <p class="hero-description">
          Bold tastes, strange delights — welcome to JoJo's Bizarre Coffee. 
          Experience the future of coffee crafting with our Stand-powered blends.
        </p>
        
        <div class="hero-features-list">
          <span class="feature-item">● Premium Coffee</span>
          <span class="feature-item">● Standpowered Staff</span>
          <span class="feature-item">● Community-Driven</span>
        </div>

        <div class="hero-actions">
          <a href="menu.php" class="btn-app-store">
            <span class="small-text">View Our</span>
            <span class="big-text">Full Menu</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Life at JoJo's Bizarre Coffee -->
  <section class="life-section">
    <div class="container">
      <h3 class="section-title">LIFE AT JOJO'S BIZARRE COFFEE</h3>

      <div class="life-grid">
        <div class="life-card">
          <img src="assets/6.jpg" alt="Life at JoJo's">
          <div class="life-caption">
            <h4>Cozy Atmosphere</h4>
            <p>Relax in our Stand-themed lounge</p>
          </div>
        </div>
        <div class="life-card">
          <img src="assets/coffee2.jpg" alt="Life at JoJo's">
          <div class="life-caption">
            <h4>Signature Brews</h4>
            <p>Experience flavors from across the multiverse</p>
          </div>
        </div>
        <div class="life-card">
          <img src="assets/5.jpg" alt="Life at JoJo's">
          <div class="life-caption">
            <h4>Community Events</h4>
            <p>Join fellow Stand users for special nights</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stand Users / Stats Layer -->
  <section class="stand-layer" style="background-image: url('assets/jojosoft.jpg');">
    <div class="stand-overlay-gradient"></div>
    <div class="container stand-content-wrapper">
      <div class="stand-header">
        <h2 class="stand-main-title">Make Our <span class="text-highlight">Soft Opening</span> Meaningful</h2>
        <p class="stand-description">
          You are part of the very first chapter of JoJo's Bizarre Coffee. Help us power up this soft opening by spreading the word,
          bringing your friends, and sharing your Stand-worthy coffee moments online.
        </p>
      </div>

      <div class="stand-stats">
        <div class="stat-card">
          <span class="stat-icon">📣</span>
          <span class="stat-number">01</span>
          <span class="stat-label">Share a photo or story and tag JoJo's Bizarre Coffee.</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <span class="stat-number">02</span>
          <span class="stat-label">Invite a friend or family member to visit during the soft opening.</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⭐</span>
          <span class="stat-number">03</span>
          <span class="stat-label">Leave a kind review or reaction on our Facebook page.</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">☕</span>
          <span class="stat-number">04</span>
          <span class="stat-label">Try a signature drink and tell us what Stand it reminds you of.</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Coffee Blends -->
  <section class="featured-blends">
    <div class="container">
      <div class="featured-blends-header">
        <h3 class="featured-blends-title">FEATURED MENACING PRODUCTS</h3>
        <p class="featured-blends-subtitle">
          Our latest coffee and pastry creations, roasted in small batches and inspired by vibrant anime worlds.
        </p>
      </div>
      <div class="featured-blends-grid">
        <article class="featured-card">
          <div class="featured-card-image">
            <img src="assets/coffee.jpg" alt="Featured coffee blend one">
          </div>
          <div class="featured-card-body">
            <h4 class="featured-card-name">Biscoff Coffee</h4>
            <p class="featured-card-origin">Caramel sweetness with bright citrus and cacao nib.</p>
            <p class="featured-card-price">₱179.00</p>
          </div>
        </article>
        <article class="featured-card">
          <div class="featured-card-image">
            <img src="assets/coffee1.jpg" alt="Featured coffee blend two">
          </div>
          <div class="featured-card-body">
            <h4 class="featured-card-name">Black Forest Croffle</h4>
            <p class="featured-card-origin">Whipped Cream, Chocolate Syrup, and Chocolate Sprinkles</p>
            <p class="featured-card-price">₱169.00</p>
          </div>
        </article>
        <article class="featured-card">
          <div class="featured-card-image">
            <img src="assets/tonio's blend.jpg" alt="Featured coffee blend three">
          </div>
          <div class="featured-card-body">
            <h4 class="featured-card-name">Tonio's Blend</h4>
            <p class="featured-card-origin">Stonefruit acidity layered over chocolate sweetness.</p>
            <p class="featured-card-price">₱159.00</p>
          </div>
        </article>
      </div>
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