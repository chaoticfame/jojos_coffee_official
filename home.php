<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Home</title>
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;600&display=swap" rel="stylesheet">
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

  <section class="intro" style="background-image: url('assets/background.jpg');">
    <div class="container">
      <h2 class="intro-title">EXPERIENCE A BIZARRE BREW</h2>
      <p class="intro-lead">Bold tastes, strange delights — welcome to JoJo's Bizarre Café</p>
      <div style="margin-top: 30px; text-align: center;">
        <a href="menu.php" class="btn-primary" style="text-decoration: none; display: inline-block; margin-right: 15px;">View Menu</a>
        <a href="contact.php" class="btn-secondary" style="text-decoration: none; display: inline-block;">Contact Us</a>
      </div>
    </div>
  </section>

  <!-- Featured Legendary Items -->
  <section class="menu-section">
    <div class="container">
      <h3 class="section-title">OUR FEATURED ITEMS</h3>

      <div class="menu-grid">
        <div class="card">
          <h4>STAND BREWS</h4>
          <ul class="menu-list">
            <li><strong>Americano</strong> <span class="price"></span></li>
            <li class="muted">Classic espresso with hot water</li>
            <li><strong>Caramel Macchiato</strong> <span class="price"></span></li>
            <li class="muted">Espresso with vanilla syrup and caramel drizzle</li>
            <li><strong>Spanish Latte</strong> <span class="price"></span></li>
            <li class="muted">Espresso with condensed milk</li>
            <li><strong>Iced Mocha</strong> <span class="price"></span></li>
            <li class="muted">Chocolate espresso over ice</li>
          </ul>
        </div>

        <div class="card">
          <h4>SPEEDWAGON BLENDS</h4>
          <ul class="menu-list">
            <li><strong>Blue Ocean</strong> <span class="price"></span></li>
            <li class="muted">Butterfly pea flower latte with a mysterious blue hue</li>
            <li><strong>Golden Experience</strong> <span class="price"></span></li>
            <li class="muted">Turmeric golden milk latte infused with honey</li>
            <li><strong>Phantom Blood</strong> <span class="price"></span></li>
            <li class="muted">Rich red velvet mocha with cream</li>
          </ul>
        </div>

        <div class="card">
          <h4>JOESTAR BLENDS</h4>
          <ul class="menu-list">
            <li><strong>Biscoff Coffee</strong> <span class="price"></span></li>
            <li class="muted">Creamy coffee with Biscoff cookie crumbles</li>
            <li><strong>Salted Caramel</strong> <span class="price"></span></li>
            <li class="muted">Sweet and salty caramel latte perfection</li>
          </ul>
        </div>

        <div class="card">
          <h4>BIZARRE BLENDS</h4>
          <ul class="menu-list">
            <li><strong>Strawberry Coffee</strong> <span class="price"></span></li>
            <li class="muted">Unique blend of strawberry and coffee</li>
            <li><strong>Dirty Matcha</strong> <span class="price"></span></li>
            <li class="muted">Matcha latte with a shot of espresso</li>
            <li><strong>Oolong Latte</strong> <span class="price"></span></li>
            <li class="muted">Smooth oolong tea with creamy milk</li>
          </ul>
        </div>
      </div>

      <div class="card" style="margin-top: 1rem;">
        <h4>Our Stand Users</h4>
        <p class="muted">Welcome to Stardust Café, where the world of JoJo's Bizarre Adventure meets the art of coffee crafting. Our café is a tribute to the legendary series that has captivated millions with its unique style, unforgettable characters, and dramatic flair.</p>
        <p class="muted">Every drink on our menu is inspired by iconic moments and characters from the JoJo universe. From Giorno's life-giving gold to Jotaro's unstoppable ORA ORA rush, each beverage tells a story and delivers an experience as bold and unforgettable as a Stand battle.</p>
        <p class="muted">Step into our café and join the adventure. Whether you're a seasoned Stand user or a newcomer to the bizarre world, we promise you a coffee experience like no other. Your bizarre journey starts here!</p>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
  </footer>
</body>
</html>