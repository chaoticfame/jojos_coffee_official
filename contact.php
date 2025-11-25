<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Contact</title>
  <link rel="stylesheet" href="style.css?v=2">
  <script defer src="script.js"></script>
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
          <li><a href="contact.php">Contact</a></li>
          <li><a href="register.php">Register</a></li>
          <li><a href="login.php">User Login</a></li>
          <li><a href="login_admin.php">Admin Login</a></li>
        </ul>
      </nav>

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">☰</button>
    </div>
  </header>

  <section class="contact-section" style="padding-top: 100px; padding-bottom: 80px;">
    <div class="container">
      <h3 class="section-title">Contact Us</h3>
      
      <div class="login-card" style="max-width: 800px; margin: 0 auto;">
        <div style="margin-bottom: 40px; text-align: center;">
          <h4 style="margin-bottom: 20px; color: var(--accent-yellow);">Get in Touch</h4>
          <p style="font-size: 1.1rem; line-height: 1.8; color: #fff;">
            Have questions? Want to place an order? We'd love to hear from you!
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 30px;">
          <div>
            <strong style="display: block; margin-bottom: 8px; color: var(--accent-yellow);">Email</strong>
            <a href="mailto:Brunobrian05@gmail.com" style="color: var(--pink); text-decoration: none; font-size: 1.1rem;">
              Brunobrian05@gmail.com
            </a>
          </div>

          <div>
            <strong style="display: block; margin-bottom: 8px; color: var(--accent-yellow);">Phone</strong>
            <a href="tel:09275041084" style="color: var(--pink); text-decoration: none; font-size: 1.1rem;">
              09275041084
            </a>
          </div>

          <div>
            <strong style="display: block; margin-bottom: 8px; color: var(--accent-yellow);">Address</strong>
            <p style="margin: 0; color: #fff; font-size: 1.1rem;">
              2 Homeowners Drive<br>
              Sto Nino Marikina
            </p>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center;">
          <h4 style="margin-bottom: 20px; color: var(--accent-yellow);">Opening Hours</h4>
          <div style="background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 8px; display: inline-block; min-width: 300px; border: 1px solid rgba(255,255,255,0.1);">
            <p style="margin: 8px 0; color: #fff;"><strong>Monday - Friday:</strong> 7:00 AM - 9:00 PM</p>
            <p style="margin: 8px 0; color: #fff;"><strong>Saturday:</strong> 8:00 AM - 10:00 PM</p>
            <p style="margin: 8px 0; color: #fff;"><strong>Sunday:</strong> 9:00 AM - 8:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
  </footer>
</body>
</html>

