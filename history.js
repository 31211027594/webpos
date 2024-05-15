function toggleOrderHistory() {
    var orderHistoryBox = document.querySelector('.order-history-box');
    if (orderHistoryBox.style.display === 'none') {
        // Thực hiện AJAX để lấy lịch sử đơn hàng từ máy chủ
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'order_history.php', true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var orderHistoryContent = document.querySelector('.order-history-content');
                var orderIds = JSON.parse(xhr.responseText); // Nhận dữ liệu từ phản hồi AJAX
                orderHistoryContent.innerHTML = xhr.responseText;

                // Sau khi dữ liệu được tải và hiển thị, gọi hàm displayOrderHistory
                displayOrderHistory(orderIds);
            }
        };
        xhr.send();
        orderHistoryBox.style.display = 'block';
    } else {
        orderHistoryBox.style.display = 'none';
    }
}

function closeOrderHistory() {
    var orderHistoryBox = document.querySelector('.order-history-box');
    orderHistoryBox.style.display = 'none';
}

function displayOrderHistory(orderIds) {
    var orderList = document.querySelector('.order-history-content');
    orderList.innerHTML = ''; // Xóa nội dung cũ trước khi thêm mới

    // Thêm dòng "Recent Order" vào đầu danh sách
    var recentOrderHeader = document.createElement('div');
    recentOrderHeader.textContent = 'Recent Orders';
    recentOrderHeader.classList.add('recent-order-header');
    orderList.appendChild(recentOrderHeader);

    orderIds.forEach(function(orderId) {
        var orderItem = document.createElement('div');
        orderItem.classList.add('order-item');
        orderItem.textContent = 'Order #' + orderId;
        orderItem.addEventListener('click', function() {
            // Khi người dùng nhấp vào một đơn hàng, gửi yêu cầu để lấy chi tiết của đơn hàng đó
            showOrderDetails(orderId);
        });
        orderList.appendChild(orderItem);
    });

    // Thêm sự kiện cho các phần tử trong .order-history-box
    var orderItems = document.querySelectorAll('.order-history-content .order-item');
    orderItems.forEach(function(item) {
        item.addEventListener('mouseover', function() {
            // Khi rê chuột vào, thêm lớp màu xanh
            item.classList.add('hovered');
        });
        item.addEventListener('mouseout', function() {
            // Khi rời chuột, loại bỏ lớp màu xanh
            item.classList.remove('hovered');
        });
    });
}

// Sửa đổi hàm showOrderDetails để lấy và hiển thị chi tiết đơn hàng
function showOrderDetails(orderId) {
    // Yêu cầu AJAX để lấy chi tiết đơn hàng
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'order_details.php?orderId=' + orderId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var orderDetails = JSON.parse(xhr.responseText);
            // Hiển thị chi tiết đơn hàng (bạn cần triển khai hàm này)
            displayOrderDetails(orderDetails);
        }
    };
    xhr.send();
}

function displayOrderDetails(orderDetailsArray) {
    // Lấy đối tượng modal hoặc box popup từ DOM
    var modal = document.getElementById('orderDetailsModal');

    // Kiểm tra nếu mảng dữ liệu orderDetailsArray không rỗng
    if (Array.isArray(orderDetailsArray) && orderDetailsArray.length > 0) {
        // Chọn một đối tượng từ mảng để hiển thị chi tiết đơn hàng
        var orderDetails = orderDetailsArray[0];

        // Xây dựng nội dung chi tiết đơn hàng
        var modalContent = '<div class="modal-content">';
        modalContent += '<span class="close">&times;</span>'; // Nút đóng modal
        modalContent += '<h2>Order Details</h2>';
        modalContent += '<p>Order ID: ' + orderDetails.order_id + '</p>';
        modalContent += '<p>Customer Name: ' + orderDetails.customer_name + '</p>';
        modalContent += '<p>Order Date: ' + orderDetails.order_date + '</p>';
        modalContent += '<p>Payment Method: ' + orderDetails.payment_method + '</p>';
        modalContent += '<p>Order Status: ' + orderDetails.status + '</p>';

        // Hiển thị danh sách sản phẩm được mua trong đơn hàng
        modalContent += '<h3>Products:</h3>';
        modalContent += '<ul>';
        orderDetailsArray.forEach(function(orderDetail) {
            modalContent += '<li>' + orderDetail.product_name + ' - Quantity: ' + orderDetail.quantity + '</li>';
        });
        modalContent += '</ul>';

        modalContent += '<h3>Total Amount: $' + orderDetails.total_amount + '</h3>'; // Hiển thị total_amount

        // Nút Done để lưu thông tin hóa đơn
        modalContent += '<button onclick="saveInvoice(' + orderDetails.order_id + ')">Done</button>';

        modalContent += '</div>';

        // Hiển thị nội dung chi tiết trong modal
        modal.innerHTML = modalContent;

        // Hiển thị modal
        modal.style.display = 'block';

        // Đóng modal khi người dùng nhấp vào nút đóng
        var closeButton = modal.querySelector('.close');
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };
    } else {
        console.error("Order details are empty or invalid.");
    }
}

// Lưu thông tin hóa đơn vào cơ sở dữ liệu
function saveInvoice(orderId) {
    // Thực hiện AJAX để lưu thông tin hóa đơn vào cơ sở dữ liệu
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_invoice.php', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Đã lưu thành công
            alert('Hóa đơn đã được lưu thành công.');
            // Cập nhật trạng thái của hóa đơn thành "done" trên giao diện nếu cần
        }
    };
    var invoiceData = {
        orderId: orderId
        // Thêm các thông tin khác của hóa đơn cần lưu
    };
    xhr.send(JSON.stringify(invoiceData));
}