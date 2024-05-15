<?php
// Bao gồm tệp kiểm tra đăng nhập
require_once('check_login.php');

// Tạo kết nối đến cơ sở dữ liệu
include 'config.php';

// Lấy orderId từ yêu cầu GET
if (isset($_GET['orderId'])) {
    $orderId = $_GET['orderId'];

    // Truy vấn để lấy thông tin đơn hàng từ nhiều bảng
    $sql = "SELECT od.order_detail_id, od.order_id, od.product_id, od.quantity, od.unit_price,
                   p.name AS product_name, p.price AS product_price, p.description AS product_description,
                   o.order_date, o.payment_method, o.status, o.total_amount,
                   c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone
            FROM OrderDetails od
            INNER JOIN Products p ON od.product_id = p.product_id
            INNER JOIN Orders o ON od.order_id = o.order_id
            INNER JOIN Customers c ON o.customer_id = c.customer_id
            WHERE od.order_id = $orderId";
    
    $result = $conn->query($sql);
    
    $orderDetails = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orderDetails[] = $row;
        }
    }
    echo json_encode($orderDetails);
} else {
    echo json_encode([]);
}

$conn->close();
?>
