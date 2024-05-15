<?php
include 'config.php';
session_start();

$searchInput = $_GET['query'];
$tenantId = $_SESSION['user']['tenant_id'];

$sql = "SELECT * FROM Customers WHERE (name LIKE '%$searchInput%' OR email LIKE '%$searchInput%' OR phone LIKE '%$searchInput%') AND tenant_id = $tenantId";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo '<div class="search-result" onclick="selectCustomer(' . $row['customer_id'] . ')">';
        echo '<h4>' . $row['name'] . '</h4>';
        echo '</div>';
    }
} else {
    echo "Không tìm thấy khách hàng.";
}
$conn->close();
?>
