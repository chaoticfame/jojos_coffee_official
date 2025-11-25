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

// Include database connection
require_once 'db.php';

$error = '';
$debug = false; // Set to true for debugging (SHOWS ERRORS - SET TO FALSE IN PRODUCTION)

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Please fill in all fields.';
    } else {
        // Check if users table exists
        $tableCheck = $conn->query("SHOW TABLES LIKE 'users'");
        if (!$tableCheck || $tableCheck->num_rows === 0) {
            $error = 'Users table does not exist. Please run setup_existing_db.php first.';
        } else {
            // Check if role column exists
            $checkRole = $conn->query("SHOW COLUMNS FROM users LIKE 'role'");
            $hasRole = ($checkRole && $checkRole->num_rows > 0);
            
            // Prepare statement to prevent SQL injection
            if ($hasRole) {
                $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
            } else {
                $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
            }
            
            if ($stmt) {
                $stmt->bind_param("s", $username);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result->num_rows === 1) {
                    $user = $result->fetch_assoc();
                    
                    // Verify password
                    if (password_verify($password, $user['password'])) {
                        // Check if user is admin
                        $userRole = $user['role'] ?? 'user';
                        
                        if ($userRole !== 'admin') {
                            $error = 'Access denied. This page is for administrators only. Please use the regular login page.';
                        } else {
                            // Set session variables
                            $_SESSION['user_id'] = $user['id'];
                            $_SESSION['username'] = $user['username'];
                            $_SESSION['user_role'] = $userRole;
                            
                            // Redirect to admin dashboard
                            header('Location: dashboard_admin.php');
                            exit();
                        }
                    } else {
                        $error = 'Invalid username or password.';
                        if ($debug) {
                            $error .= ' (Password verification failed)';
                        }
                    }
                } else {
                    $error = 'Invalid username or password.';
                    if ($debug) {
                        $error .= ' (User not found in database)';
                    }
                }
                
                $stmt->close();
            } else {
                $error = 'Database error. Please contact administrator.';
                if ($debug) {
                    $error .= ' SQL Error: ' . $conn->error;
                }
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
  <title>JoJo's Bizarre Café — Admin Login</title>
  <link rel="stylesheet" href="style.css?v=2">
  <script defer src="script.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
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
      <h2>Admin Login</h2>
      <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Administrators only. Regular users should use the <a href="login.php">regular login</a>.</p>
      
      <?php if ($error): ?>
        <div style="background-color: #fee; color: #c33; padding: 10px; border-radius: 4px; margin-bottom: 15px;">
          <?php echo htmlspecialchars($error); ?>
        </div>
      <?php endif; ?>
      
      <form id="loginForm" action="login_admin.php" method="POST">
        <label for="username">Username</label>
        <input id="username" name="username" type="text" placeholder="username" required>

        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="password" required>

        <button type="submit" class="btn-primary">Login as Admin</button>
      </form>
      
      <p class="muted" style="margin-top: 20px;">
        <a href="login.php" style="color: #666;">← Regular User Login</a> | 
        <a href="home.php" style="color: #666;">Back to Home</a>
      </p>
    </div>
  </main>

  <footer class="site-footer">
    <div class="container">© JoJo's Bizarre Café — Prototype</div>
  </footer>
</body>
</html>
<?php
$conn->close();
?>

