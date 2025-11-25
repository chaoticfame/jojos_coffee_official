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
    if (empty($username) || empty($password) || empty($confirm_password)) {
        $error = 'Please fill in all required fields.';
    } elseif (strlen($username) < 3) {
        $error = 'Username must be at least 3 characters long.';
    } elseif (strlen($password) < 6) {
        $error = 'Password must be at least 6 characters long.';
    } elseif ($password !== $confirm_password) {
        $error = 'Passwords do not match.';
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
                
                // Check if role column exists
                $checkRole = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
                $hasRole = ($checkRole && $checkRole->num_rows > 0);
                
                // Insert new user
                if ($hasRole) {
                    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')");
                } else {
                    $stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                }
                
                $stmt->bind_param("ss", $username, $hashedPassword);
                
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
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>JoJo's Bizarre Café — Register</title>
  <link rel="stylesheet" href="style.css?v=2">
  <script defer src="script.js"></script>
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
  <header class="site-header small">
    <div class="container header-inner">
      <a class="brand" href="home.php">
        <img src="assets/jojo.png" alt="JoJo's logo" class="logo-small">
        <div class="brand-text">
          <span class="brand-top">JoJo's</span>
          <span class="brand-sub">Bizarre <strong>COFFEE</strong></span>
        </div>
      </a>
    </div>
  </header>

  <main class="container login-container">
    <div class="login-card">
      <h2>Create Account</h2>
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Register for a regular user account. Already have an account? <a href="login.php">Login here</a>.</p>
      
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

        <label for="password">Password *</label>
        <input id="password" name="password" type="password" placeholder="Enter password" required 
               minlength="6">
        <p class="password-requirements">Must be at least 6 characters long.</p>

        <label for="confirm_password">Confirm Password *</label>
        <input id="confirm_password" name="confirm_password" type="password" placeholder="Confirm password" required 
               minlength="6">

        <button type="submit" class="btn-primary">Register</button>
      </form>
      
      <p class="muted" style="margin-top: 20px;">
        Already registered? <a href="login.php">Login here</a> | 
        <a href="home.php">Back to Home</a>
      </p>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
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

