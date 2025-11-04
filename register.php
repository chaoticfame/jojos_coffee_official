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
  <link rel="stylesheet" href="style.css">
  <script defer src="script.js"></script>
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

