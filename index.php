<?php
// Bao gồm tệp kiểm tra đăng nhập
require_once('check_login.php');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple POS</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <div class="container">
        <div class="left-container">
            <div class="search-bar">
                <input type="text" placeholder="Tìm kiếm sản phẩm..." id="searchInput">
                <button onclick="searchProducts()"><i class="fas fa-search"></i></button>
                <script src="search.js"></script>
            </div>

            <div class="product-display">
            <?php 
                include 'config.php';

                if (isset($_SESSION['user'])) {
                    $tenantId = $_SESSION['user']['tenant_id'];
                
                    $sql = "SELECT p.*, c.name AS category_name, b.name AS brand_name 
                            FROM Products p
                            INNER JOIN Categories c ON p.category_id = c.category_id
                            INNER JOIN Brands b ON p.brand_id = b.brand_id
                            WHERE p.tenant_id = $tenantId";
                
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
                        echo "No products found.";
                    }
                } else {
                    header("Location: login.php");
                    exit;
                }
                
                $conn->close();
                
                ?>
            </div>
        </div>

        <div class="right-container">
            <div class="checkout-form">
                <div class="customer-container">
                    <div class="content1">Ticket</div>
                    <div class="search-customer">
                        <button onclick="toggleSearchBox()"><i class="fas fa-user-plus"></i></button>
                        <div class="search-box" style="display: none;">
                            <input type="text" placeholder="Tìm kiếm khách hàng..." id="searchCustomerInput" oninput="searchCustomer()">
                            <script src="search-customer.js"></script>
                            <div class="search-results"></div>
                            <script src="customer_selection.js"></script>
                            <button class="close-btn" onclick="closeSearchBox()">X</button>
                            <script>
                                function closeSearchBox() {
                                    var searchBox = document.querySelector('.search-box');
                                    if (searchBox) {
                                        searchBox.style.display = 'none';
                                    }
                                }
                            </script>

                        </div>
                    </div>
                    <div class="History">
                        <button id="historyButton" onclick="toggleOrderHistory()"><i class="fas fa-history"></i></button>
                        <script src="history.js"></script>
                    </div>
                </div>
                <div class="content">Selected customer :</div>
                <div class="customer-display">
                    <!-- Selected customer will be displayed here -->
                </div>
                <div class="content">Selected products :</div>
                <div class="selected-products">
                    <!-- Selected products will be displayed here -->
                </div>
                <script src="get_products.php"></script>

                <div class="content">Select payment method :</div>
                <div class="payment-options">
                    <div class="radio1">
                        <input type="radio" id="cash" name="payment" value="cash">
                        <label for="cash">Cash</label><br>
                    </div>
                    <div class="radio2">
                        <input type="radio" id="card" name="payment" value="card">
                        <label for="card">Card</label><br>
                    </div>
                </div>
                <div class="total">
                    <!-- Total amount will be displayed here -->
                </div>
                <div class="checkout-button">Thanh toán</div>
                <?php
                    echo '<script>';
                    echo 'var tenantId = ' . $_SESSION['user']['tenant_id'] . ';';
                    echo '</script>';
                    ?>
                <script src="checkout.js"></script>
                <div class="order-history-box" style="display: none;">
                    <div class="order-history-content">
                        <!-- Nội dung lịch sử đơn hàng sẽ được hiển thị ở đây -->
                    </div>
                    <button class="close-history-btn" onclick="closeOrderHistory()">x</button>
                </div>
                <div id="orderDetailsModal" class="modal">
                    <!-- Nội dung chi tiết đơn hàng sẽ được hiển thị ở đây -->
                </div>
            </div>
        </div>
    </div>
</body>
</html>
