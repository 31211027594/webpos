<?php
$servername = "webpos-database.cp668608yxw9.us-west-2.rds.amazonaws.com";
$username = "admin"; 
$password = "group004"; 
$dbname = "webpos"; 

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  $error_message = "Kết nối thất bại: " . $conn->connect_error;
  error_log($error_message, 3, "error.log"); 
  die($error_message); 
}
?>
