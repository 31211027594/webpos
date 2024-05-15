<?php
include 'config.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user'])) {
    header("Location: login.php");
    exit;
}

$tenantId = $_SESSION['user']['tenant_id'];

$sql = "SELECT * FROM Products WHERE tenant_id = $tenantId";
$result = $conn->query($sql);

$products = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

$conn->close();

echo 'var products = ' . json_encode($products) . ';';

?>
