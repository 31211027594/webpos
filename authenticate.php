<?php
include 'config.php';
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'];
$password = $data['password'];

$sql = "SELECT * FROM Users WHERE username = '$username' AND password = '$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $tenantId = $row['tenant_id'];

    // Lưu thông tin người dùng vào session
    $_SESSION['user'] = $row;

    $response = array("success" => true, "tenantId" => $tenantId);
    header('Content-Type: application/json');
    echo json_encode($response);

    // Lưu user_id vào session
    $_SESSION['user_id'] = $row['user_id'];
} else {
    $response = array("success" => false);
    header('Content-Type: application/json');
    echo json_encode($response);
}

$conn->close();
?>
