<?php
// Bao gồm tệp kiểm tra đăng nhập
require_once('check_login.php');

// Tạo kết nối đến cơ sở dữ liệu
include 'config.php';

// Lấy dữ liệu hóa đơn từ yêu cầu POST
$data = json_decode(file_get_contents("php://input"), true);

// Xử lý lưu hóa đơn vào cơ sở dữ liệu
if (isset($data['orderId'])) {
    $orderId = $data['orderId'];

    // Tính toán tổng số tiền của đơn hàng
    $sql = "SELECT SUM(quantity * unit_price) AS total_amount FROM OrderDetails WHERE order_id = $orderId";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $totalAmount = $row['total_amount'];
    } else {
        $totalAmount = 0;
    }

    // Thực hiện thêm thông tin hóa đơn vào bảng Invoices với orderId đã cung cấp
    $sql = "INSERT INTO Invoices (order_id, issue_date, due_date, total_amount, status, tenant_id) 
            VALUES ($orderId, NOW(), NOW(), $totalAmount, 'done', {$_SESSION['user']['tenant_id']})";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false]);
}

$conn->close();
?>
