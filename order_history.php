<?php
// Bao gồm tệp kiểm tra đăng nhập
require_once('check_login.php');

// Tạo kết nối đến cơ sở dữ liệu
include 'config.php';

// Lấy danh sách đơn hàng từ cơ sở dữ liệu
if (isset($_SESSION['user'])) {
    $tenantId = $_SESSION['user']['tenant_id'];
    $sql = "SELECT order_id FROM Orders WHERE tenant_id = $tenantId";
    $result = $conn->query($sql);
    
    $orderIds = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orderIds[] = $row['order_id'];
        }
    }
    echo json_encode($orderIds);
} else {
    echo json_encode([]);
}

$conn->close();
?>
