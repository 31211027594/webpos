<?php
include 'config.php';
session_start();

$searchInput = $_GET['query'];
$tenantId = $_SESSION['user']['tenant_id'];

$sql = "SELECT p.*, c.name AS category_name, b.name AS brand_name FROM Products p
        INNER JOIN Categories c ON p.category_id = c.category_id
        INNER JOIN Brands b ON p.brand_id = b.brand_id
        WHERE p.name LIKE '%$searchInput%' AND p.tenant_id = $tenantId";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo '<div class="product-card" data-product-id="' . $row['product_id'] . '">';
        echo '<img src="' . $row['image_url'] . '" alt="' . $row['name'] . '">';
        echo '<h3>' . $row['name'] . '</h3>';
        echo '<p>Category: ' . $row['category_name'] . '</p>';
        echo '<p>Brand: ' . $row['brand_name'] . '</p>';
        echo '<p>Price: $' . $row['price'] . '</p>';
        echo '<p>Description: ' . $row['description'] . '</p>';
        echo '<button><i class="fas fa-cart-plus"></i> Buy</button>';
        echo '</div>';
    }
} else {
    echo "Không tìm thấy sản phẩm.";
}
$conn->close();
?>
