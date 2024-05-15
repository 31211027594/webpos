<?php
include 'config.php';
session_start();

$tenantId = $_SESSION['user']['tenant_id'];
$customerId = $_GET['id'];

$sql = "SELECT * FROM Customers WHERE customer_id = $customerId AND tenant_id = $tenantId";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo '<div class="customer-profile">';
    echo '<h3>' . $row['name'] . '</h3>';
    echo '<p>Email: ' . $row['email'] . '</p>';
    echo '<p>Phone: ' . $row['phone'] . '</p>';
    echo '<p>Address: ' . $row['address'] . '</p>';
    echo '</div>';
} else {
    echo "Không tìm thấy khách hàng.";
}
$conn->close();
?>
