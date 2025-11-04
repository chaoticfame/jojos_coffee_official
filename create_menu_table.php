<?php
/**
 * Create Menu Items Table
 * Run this once to create the menu_items table
 * DELETE this file after use for security
 */

require_once 'db.php';

echo "<h1>Creating Menu Items Table</h1>";
echo "<style>body { font-family: Arial; max-width: 700px; margin: 50px auto; padding: 20px; } .ok { color: green; } .error { color: red; }</style>";

// Create menu_items table
$createTableSQL = "CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if ($conn->query($createTableSQL)) {
    echo "<p class='ok'>✓ Menu items table created successfully.</p>";
} else {
    echo "<p class='error'>✗ Error creating table: " . $conn->error . "</p>";
    exit();
}

// Check if table is empty, add sample data
$checkItems = $conn->query("SELECT COUNT(*) as count FROM menu_items");
$itemCount = $checkItems->fetch_assoc()['count'];

if ($itemCount == 0) {
    echo "<p>Adding sample menu items...</p>";
    
    $sampleItems = [
        ['Golden Classic Croffle', 'Croffle', 'Whipped Cream, Maple Syrup, Butter', 159.00],
        ['Americano (16oz)', 'Stand Brews', 'Classic espresso with hot water', 99.00],
        ['Biscoff Coffee', 'Joestar Blends', 'Biscoff syrup and signature blend', 159.00]
    ];
    
    $insertStmt = $conn->prepare("INSERT INTO menu_items (name, category, description, price) VALUES (?, ?, ?, ?)");
    
    foreach ($sampleItems as $item) {
        $insertStmt->bind_param("sssd", $item[0], $item[1], $item[2], $item[3]);
        if ($insertStmt->execute()) {
            echo "<p class='ok'>✓ Added: " . htmlspecialchars($item[0]) . "</p>";
        } else {
            echo "<p class='error'>✗ Error adding " . htmlspecialchars($item[0]) . ": " . $insertStmt->error . "</p>";
        }
    }
    
    $insertStmt->close();
} else {
    echo "<p>Table already contains $itemCount item(s). Skipping sample data insertion.</p>";
}

$conn->close();
?>

<!DOCTYPE html>
<html>
<head>
    <title>Menu Table Created</title>
</head>
<body>
    <hr>
    <h2>✓ Setup Complete!</h2>
    <p><a href="dashboard_admin.php">→ Go to Admin Dashboard</a></p>
    <p style="color: orange;"><strong>Remember to delete this file after use!</strong></p>
</body>
</html>

