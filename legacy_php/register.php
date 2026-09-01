<?php
session_start();

// If user is already logged in, redirect to appropriate dashboard
if (isset($_SESSION['user_id'])) {
    if ($_SESSION['user_role'] === 'admin') {
        header('Location: dashboard_admin.php');
    } else {
        header('Location: dashboard_user.php');
    }
    exit();
}

require_once 'db.php';

$error = '';
$success = '';
$debug = false; // Set to true for debugging

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $email = trim($_POST['email'] ?? '');
    
    // Validation
    if (empty($username) || empty($password) || empty($confirm_password) || empty($email)) {
        $error = 'Please fill in all required fields (including email).';
    } elseif (strlen($username) < 3) {
        $error = 'Username must be at least 3 characters long.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters long.';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match.';
    } else {
        // Email is required; validate format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Please enter a valid email address.';
        } else {
        // Check if users table exists
        $tableCheck = $conn->query("SHOW TABLES LIKE 'users'");
        if (!$tableCheck || $tableCheck->num_rows === 0) {
            $error = 'Users table does not exist. Please contact the administrator.';
        } else {
            // Check if username already exists
            $checkUser = $conn->prepare("SELECT id FROM users WHERE username = ?");
            $checkUser->bind_param("s", $username);
            $checkUser->execute();
            $result = $checkUser->get_result();
            
            if ($result->num_rows > 0) {
                $error = 'Username already exists. Please choose a different username.';
            } else {
                // Hash the password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                
                // Check if role/email columns exist
                $checkRole = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
                $hasRole = ($checkRole && $checkRole->num_rows > 0);
                $checkEmail = $conn->query("SHOW COLUMNS FROM users LIKE 'email'");
                $hasEmail = ($checkEmail && $checkEmail->num_rows > 0);
                
                // Insert new user
                if ($hasRole && $hasEmail) {
                    $stmt = $conn->prepare("INSERT INTO users (username, password, role, email) VALUES (?, ?, 'user', ?)");
                    $stmt->bind_param("sss", $username, $hashedPassword, $email);
                } elseif ($hasRole && !$hasEmail) {
                    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
                    $stmt->bind_param("ss", $username, $hashedPassword);
                } elseif (!$hasRole && $hasEmail) {
                    $stmt = $conn->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $username, $hashedPassword, $email);
                } else {
                    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                    $stmt->bind_param("ss", $username, $hashedPassword);
                }
                
                if ($stmt->execute()) {
                    $success = 'Registration successful! You can now <a href="login.php">login here</a>.';
                    // Clear form
                    $username = '';
                    $email = '';
                } else {
                    $error = 'Registration failed. Please try again later.';
                    if ($debug) {
                        $error .= ' Error: ' . $conn->error;
                    }
                }
                $stmt->close();
            }
            $checkUser->close();
        }
      }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Register</title>
  <link rel="stylesheet" href="style.css?v=5">
  <script defer src="script.js?v=5"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
  <style>
    .password-requirements {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    .form-help {
      font-size: 13px;
      color: #666;
      margin-top: 5px;
    }
  </style>
</head>
<body class="login-page">
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
          <li><a href="register.php">Register</a></li>
          <li><a href="login.php">Sign In</a></li>
        </ul>
      </nav>

      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">☰</button>
    </div>
  </header>

  <main class="container login-container">
    <div class="login-card">
      <h2>Create Account</h2>
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Register for a regular user account.</p>
      
      <?php if ($error): ?>
        <div style="background-color: #fee; color: #c33; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
          <?php echo $error; ?>
        </div>
      <?php endif; ?>
      
      <?php if ($success): ?>
        <div style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
          <?php echo $success; ?>
        </div>
      <?php endif; ?>
      
      <form id="registerForm" action="register.php" method="POST">
        <label for="username">Username *</label>
        <input id="username" name="username" type="text" placeholder="Choose a username" required 
               value="<?php echo htmlspecialchars($username ?? ''); ?>" 
               minlength="3" maxlength="50">
        <p class="form-help">Must be at least 3 characters long.</p>

        <label for="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value="<?php echo htmlspecialchars($email ?? ''); ?>"
          required
        >

        <label for="password">Password *</label>
        <div class="password-wrapper">
          <input id="password" name="password" type="password" placeholder="Enter password" required 
                 minlength="6">
          <button type="button" class="password-toggle" onclick="togglePassword('password', this)">Show</button>
        </div>
        <p class="password-requirements">Must be at least 6 characters long.</p>

        <label for="confirm_password">Confirm Password *</label>
        <div class="password-wrapper">
          <input id="confirm_password" name="confirm_password" type="password" placeholder="Confirm password" required 
                 minlength="6">
          <button type="button" class="password-toggle" onclick="togglePassword('confirm_password', this)">Show</button>
        </div>

        <button type="submit" class="btn-primary">Register</button>
      </form>
      
      <p class="muted" style="margin-top: 20px;">
        Already registered? <a href="login.php">Login here</a>
      </p>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Contact Us</h4>
          <p>0927 504 1084</p>
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

  <script>
    // Password match validation
    document.getElementById('registerForm')?.addEventListener('submit', function(e) {
      var password = document.getElementById('password').value;
      var confirmPassword = document.getElementById('confirm_password').value;
      
      if (password !== confirmPassword) {
        e.preventDefault();
        alert('Passwords do not match. Please try again.');
        return false;
      }
    });

    // Real-time password match indicator
    var password = document.getElementById('password');
    var confirmPassword = document.getElementById('confirm_password');
    
    if (confirmPassword) {
      confirmPassword.addEventListener('input', function() {
        if (this.value && password.value) {
          if (this.value !== password.value) {
            this.setCustomValidity('Passwords do not match');
          } else {
            this.setCustomValidity('');
          }
        }
      });
    }
  </script>
</body>
</html>
<?php
$conn->close();
?>
