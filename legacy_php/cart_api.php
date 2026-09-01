<?php
session_start();
header('Content-Type: application/json');

require_once 'db.php';

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}
if (!isset($_SESSION['cart_meta'])) {
    $_SESSION['cart_meta'] = [];
}

$cartTableExists = false;
if ($conn) {
    $res = $conn->query("SHOW TABLES LIKE 'user_cart_items'");
    if ($res && $res->num_rows > 0) {
        $cartTableExists = true;
    }
}

function cart_add_item_api($itemId, $qty = 1, $size = '') {
    $itemId = (int)$itemId;
    $qty = max(1, (int)$qty);

    if (!isset($_SESSION['cart'][$itemId])) {
        $_SESSION['cart'][$itemId] = 0;
    }
    $_SESSION['cart'][$itemId] += $qty;

    // Optional: store size preference for sized drinks (e.g., Joestar Blends / Mixed Hamon)
    $normalizedSize = strtolower(trim($size));
    if ($normalizedSize === '16oz' || $normalizedSize === '22oz') {
        $_SESSION['cart_meta'][$itemId]['size'] = $normalizedSize;
    }

    // Persist to database cart if available
    global $conn, $cartTableExists;
    if ($cartTableExists && isset($_SESSION['user_id'])) {
        $userId = (int)$_SESSION['user_id'];
        if ($stmt = $conn->prepare("INSERT INTO user_cart_items (user_id, menu_item_id, qty)
                                    VALUES (?, ?, ?)
                                    ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)")) {
            $stmt->bind_param('iii', $userId, $itemId, $qty);
            $stmt->execute();
            $stmt->close();
        }
    }
}

function cart_get_count_api() {
    $count = 0;
    foreach ($_SESSION['cart'] as $qty) {
        $count += (int)$qty;
    }
    return $count;
}

$action = isset($_POST['action']) ? $_POST['action'] : '';

if ($action === 'add' && isset($_POST['item_id'])) {
    $size = isset($_POST['size']) ? $_POST['size'] : '';
    cart_add_item_api($_POST['item_id'], isset($_POST['qty']) ? $_POST['qty'] : 1, $size);
    echo json_encode([
        'success' => true,
        'cart_count' => cart_get_count_api()
    ]);
    exit;
}

echo json_encode([
    'success' => false,
    'error' => 'Invalid request'
]);

