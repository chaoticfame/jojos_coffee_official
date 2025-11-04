<?php
// Database configuration
// IMPORTANT: Update these values to match your existing database in phpMyAdmin
define('DB_HOST', 'localhost');        // Usually 'localhost' for XAMPP
define('DB_USER', 'root');              // Your MySQL username
define('DB_PASS', '');                  // Your MySQL password (empty for XAMPP default)
define('DB_NAME', 'jojos_cafe');         // CHANGE THIS to your existing database name

// Create database connection
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Set charset to utf8
    $conn->set_charset("utf8");
    
} catch (Exception $e) {
    die("Database connection error: " . $e->getMessage());
}
?>

