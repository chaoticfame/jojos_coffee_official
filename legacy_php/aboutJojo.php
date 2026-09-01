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
  <title>JoJo's Bizarre Café — About JoJo</title>
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

  <!-- Story of Jolus Joestar Section -->
  <section class="story-section">
    <div class="story-overlay-gradient"></div>
    <div class="container h-100">
      <div class="story-content-wrapper">
        <div class="story-split">
        <!-- Left: Images Grid -->
        <div class="story-image-col">
          <div class="story-grid-images reveal-on-scroll">
            <div class="story-img-main">
              <img src="assets/1.jpg" alt="Jolus Joestar's Journey">
            </div>
            <div class="story-img-sub">
              <img src="assets/9.jpg" alt="The Beginning">
            </div>
            <div class="story-img-sub">
              <img src="assets/cafeinterior2.jpg" alt="The Struggle">
            </div>
          </div>

          <!-- Secondary grid to fill lower-left space -->
          <div class="story-grid-secondary reveal-on-scroll">
            <div class="story-img-secondary">
              <img src="assets/4.jpg" alt="Café celebrations">
            </div>
            <div class="story-img-secondary">
              <img src="assets/13.jpg" alt="JoJo fans enjoying coffee">
            </div>
          </div>
        </div>

          <!-- Right: Text Content -->
          <div class="story-text-col">
            <span class="story-badge reveal-on-scroll">EST. 2025</span>
            <h2 class="story-title reveal-on-scroll">THE STORY OF <br><span class="text-highlight">JOLUS JOESTAR</span></h2>
            
            <p class="story-desc reveal-on-scroll">
              JoJo's Bizarre Coffee was born from the passion and perseverance of its founder, Bryan. A devoted fan of the series, Bryan adopted the moniker "Jolus Joestar"—a fusion of his real nickname and the legendary family name—and even bears the iconic Joestar birthmark tattoo on his back as a symbol of his fandom.
            </p>

            <p class="story-desc reveal-on-scroll">
              Bryan describes his entrepreneurial journey as a personal battle against Dio Brando. His first business venture was fraught with dilemmas and struggles, feeling "out of date" and constantly challenged. Yet, it was this very adversity that paved the way for something new.
            </p>

            <p class="story-desc reveal-on-scroll">
              "I think my life is connected to the family of Joestars," Bryan reflects. This connection inspired the name 'JoJo's Bizarre Coffee', creating a platform for creativity and tribute, with plans to expand into teas, honoring Josuke's love for the drink.
            </p>

            <div class="story-tags reveal-on-scroll">
               <span class="tag-pill">Stand Power</span>
               <span class="tag-pill">Coffee Craft</span>
               <span class="tag-pill">Joestar Legacy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- JoJo Characters Showcase (Slider) -->
  <section class="characters-section">
    <div class="container">
      <h3 class="section-title">THE LEGENDARY JOESTARS</h3>
      
      <div class="joestar-slider">
        <div class="slider-container">
          
          <!-- Slide 1: Jonathan -->
          <div class="joestar-slide active">
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-part">Part 1: Phantom Blood</span>
                <h2 class="slide-name">Jonathan Joestar</h2>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  The noble gentleman who started the Joestar legacy. A true gentleman with a heart of gold, embodying honor and chivalry. His mastery of Hamon was the first light against the darkness.
                </p>
                <div class="slide-stats">
                  <div class="stat-box">
                    <span class="stat-label">Power</span>
                    <span class="stat-val">Ripple</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">Origin</span>
                    <span class="stat-val">England</span>
                  </div>
                </div>
              </div>
              <div class="slide-visual">
                <img src="assets/jonathan.jpg" alt="Jonathan Joestar" class="character-image">
              </div>
            </div>
          </div>

          <!-- Slide 2: Joseph -->
          <div class="joestar-slide">
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-part">Part 2: Battle Tendency</span>
                <h2 class="slide-name">Joseph Joestar</h2>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  The cunning trickster who outsmarts his enemies. Quick-witted and resourceful, known for his "Your next line is..." catchphrase. He saved the world with clackers and sheer wit.
                </p>
                <div class="slide-stats">
                  <div class="stat-box">
                    <span class="stat-label">Power</span>
                    <span class="stat-val">Hamon / Hermit Purple</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">Origin</span>
                    <span class="stat-val">England / USA</span>
                  </div>
                </div>
              </div>
              <div class="slide-visual">
                <img src="assets/joseph.jpg" alt="Joseph Joestar" class="character-image">
              </div>
            </div>
          </div>

          <!-- Slide 3: Jotaro -->
          <div class="joestar-slide">
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-part">Part 3: Stardust Crusaders</span>
                <h2 class="slide-name">Jotaro Kujo</h2>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  The stoic Stand user with Star Platinum. Famous for his "ORA ORA ORA" battle cry and unwavering determination. He embarked on a journey to Egypt to save his mother.
                </p>
                <div class="slide-stats">
                  <div class="stat-box">
                    <span class="stat-label">Stand</span>
                    <span class="stat-val">Star Platinum</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">Origin</span>
                    <span class="stat-val">Japan</span>
                  </div>
                </div>
              </div>
              <div class="slide-visual">
                <img src="assets/jotaro.jpg" alt="Jotaro Kujo" class="character-image">
              </div>
            </div>
          </div>

          <!-- Slide 4: Josuke -->
          <div class="joestar-slide">
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-part">Part 4: Diamond is Unbreakable</span>
                <h2 class="slide-name">Josuke Higashikata</h2>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  The friendly high schooler with Crazy Diamond. Protects his town of Morioh with his Stand's restoration powers. Just don't insult his hair!
                </p>
                <div class="slide-stats">
                  <div class="stat-box">
                    <span class="stat-label">Stand</span>
                    <span class="stat-val">Crazy Diamond</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">Origin</span>
                    <span class="stat-val">Japan (Morioh)</span>
                  </div>
                </div>
              </div>
              <div class="slide-visual">
                <img src="assets/josuke.jpg" alt="Josuke Higashikata" class="character-image">
              </div>
            </div>
          </div>

          <!-- Slide 5: Giorno -->
          <div class="joestar-slide">
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-part">Part 5: Golden Wind</span>
                <h2 class="slide-name">Giorno Giovanna</h2>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  The ambitious gangster with Golden Experience. Dreams of becoming a "Gang-Star" to rid the city of drugs and corruption. He resolves to create a better world.
                </p>
                <div class="slide-stats">
                  <div class="stat-box">
                    <span class="stat-label">Stand</span>
                    <span class="stat-val">Gold Experience</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">Origin</span>
                    <span class="stat-val">Italy</span>
                  </div>
                </div>
              </div>
              <div class="slide-visual">
                <img src="assets/giorno.jpg" alt="Giorno Giovanna" class="character-image">
              </div>
            </div>
          </div>

          <!-- Slide 6: Jolyne -->
          <div class="joestar-slide">
            <div class="slide-content">
              <div class="slide-info">
                <span class="slide-part">Part 6: Stone Ocean</span>
                <h2 class="slide-name">Jolyne Cujoh</h2>
                <div class="slide-divider"></div>
                <p class="slide-desc">
                  The determined daughter of Jotaro. Uses Stone Free to unravel mysteries within Green Dolphin Street Prison. She fights to reclaim her father's stolen discs.
                </p>
                <div class="slide-stats">
                  <div class="stat-box">
                    <span class="stat-label">Stand</span>
                    <span class="stat-val">Stone Free</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">Origin</span>
                    <span class="stat-val">USA</span>
                  </div>
                </div>
              </div>
              <div class="slide-visual">
                <img src="assets/jolyne.jpg" alt="Jolyne Cujoh" class="character-image">
              </div>
            </div>
          </div>

        </div>

        <!-- Navigation Controls -->
        <div class="slider-controls">
          <button class="slider-btn prev-btn" aria-label="Previous Character">❮</button>
          <div class="slider-indicators">
            <!-- Thumbnails/Dots -->
            <button class="indicator active" data-index="0">1</button>
            <button class="indicator" data-index="1">2</button>
            <button class="indicator" data-index="2">3</button>
            <button class="indicator" data-index="3">4</button>
            <button class="indicator" data-index="4">5</button>
            <button class="indicator" data-index="5">6</button>
          </div>
          <button class="slider-btn next-btn" aria-label="Next Character">❯</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Location / Google Maps Layer -->
  <section class="map-layer">
    <div class="map-shell">
      <h3 class="map-title">FIND JOJO'S BIZARRE COFFEE</h3>
      <p class="map-subtitle">
        Visit us at 2 Homeowners Drive, Marikina City, Philippines, 1800 — tap the map to open in Google Maps.
      </p>
      <div class="map-card">
        <iframe
          src="https://www.google.com/maps?q=2+Homeowners+Drive,+Marikina+City,+Philippines,+1800&output=embed"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
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

