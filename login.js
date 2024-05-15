function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Gửi yêu cầu xác thực đến máy chủ
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "authenticate.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                try {
                    var response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        // Lưu tenant_id vào phiên hoặc cookie
                        sessionStorage.setItem('tenantId', response.tenantId);

                        // Chuyển hướng người dùng đến trang chính
                        window.location.href = "index.php";
                    } else {
                        alert("Tên người dùng hoặc mật khẩu không đúng.");
                    }
                } catch (error) {
                    // Xử lý lỗi khi phân tích cú pháp JSON
                    alert("Lỗi khi xử lý phản hồi từ máy chủ.");
                }
            } else {
                // Xử lý lỗi khi nhận phản hồi từ máy chủ
                alert("Lỗi khi nhận phản hồi từ máy chủ.");
            }
        }
    };
    xhr.send(JSON.stringify({ username: username, password: password }));
    
}

var tenantId = sessionStorage.getItem('tenantId');

