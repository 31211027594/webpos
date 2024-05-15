<?php
// Include file config.php để kết nối đến cơ sở dữ liệu
include 'config.php';
session_start();

// Lấy dữ liệu đơn hàng từ yêu cầu POST
$orderData = json_decode(file_get_contents("php://input"), true);

// Dữ liệu đơn hàng
$customerId = $orderData['customerId'];
$paymentMethod = $orderData['paymentMethod']; // Lấy phương thức thanh toán từ dữ liệu đơn hàng
$orderDetails = $orderData['orderDetails'];
$tenantId = $_SESSION['user']['tenant_id'];

// Tạo một đơn hàng mới
$orderDate = date("Y-m-d");
$totalAmount = 0; // Tổng số tiền ban đầu là 0

// Tạo câu lệnh SQL để chèn đơn hàng vào bảng Orders
$sql = "INSERT INTO Orders (customer_id, order_date, total_amount, payment_method, status, tenant_id)
        VALUES ('$customerId', '$orderDate', '$totalAmount', '$paymentMethod', 'pending', '$tenantId')";

if ($conn->query($sql) === TRUE) {
    // Lấy ID của đơn hàng vừa được tạo
    $orderId = $conn->insert_id;

    // Tạo chi tiết đơn hàng
    foreach ($orderDetails as $detail) {
        $productId = $detail['productId'];
        $quantity = $detail['quantity'];
        $unitPrice = $detail['unitPrice'];

        // Tính tổng số tiền cho đơn hàng
        $totalAmount += $quantity * $unitPrice;

        // Tạo câu lệnh SQL để chèn chi tiết đơn hàng vào bảng OrderDetails
        $sql = "INSERT INTO OrderDetails (order_id, product_id, quantity, unit_price, tenant_id)
                VALUES ('$orderId', '$productId', '$quantity', '$unitPrice', '$tenantId')";

        // Thực thi câu lệnh SQL
        $conn->query($sql);
    }

    // Cập nhật tổng số tiền của đơn hàng
    $sql = "UPDATE Orders SET total_amount = '$totalAmount' WHERE order_id = '$orderId'";
    $conn->query($sql);

    // Trả về phản hồi JSON cho client
    $response = array("success" => true);
    echo json_encode($response);
} else {
    // Nếu có lỗi khi tạo đơn hàng
    $response = array("success" => false);
    echo json_encode($response);
}

// Đóng kết nối đến cơ sở dữ liệu
$conn->close();
?>
