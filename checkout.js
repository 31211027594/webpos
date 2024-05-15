document.querySelector('.product-display').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        var button = event.target;
        var productCard = button.closest('.product-card');
        var productId = productCard.dataset.productId;

        // Kiểm tra xem sản phẩm đã được chọn khách hàng chưa
        if (selectedCustomerId === null) {
            alert("Vui lòng chọn khách hàng trước khi thêm sản phẩm vào giỏ hàng.");
            return;
        }

        // Thực hiện thêm sản phẩm vào giỏ hàng
        var product = products.find(function(item) {
            return item.product_id == productId;
        });

        if (product) {
            var existingProduct = document.querySelector(`.selected-product[data-product-id="${productId}"]`);
            if (existingProduct) {
                var quantitySpan = existingProduct.querySelector(`#quantity-${productId}`);
                var currentQuantity = parseInt(quantitySpan.textContent);
                quantitySpan.textContent = currentQuantity + 1;
            } else {
                var productName = product.name;
                var productPrice = parseFloat(product.price);

                var selectedProductsContainer = document.querySelector('.selected-products');
                var selectedProduct = document.createElement('div');
                selectedProduct.classList.add('selected-product');
                selectedProduct.setAttribute('data-product-id', productId);
                selectedProduct.innerHTML = `
                    <span>${productName}</span>
                    <div>
                        <button onclick="decrementQuantity(${productId})">-</button>
                        <span id="quantity-${productId}">1</span>
                        <button onclick="incrementQuantity(${productId})">+</button>
                    </div>
                    <span class="product-price">$${productPrice.toFixed(2)}</span>
                `;
                selectedProductsContainer.appendChild(selectedProduct);
            }

            updateTotal();
        }
    }
});

function updateTotal() {
    var totalAmount = 0;
    var selectedProducts = document.querySelectorAll('.selected-product');

    selectedProducts.forEach(function(product) {
        var price = parseFloat(product.querySelector('.product-price').textContent.replace('$', ''));
        var quantity = parseInt(product.querySelector('span:nth-child(2)').textContent);
        totalAmount += price * quantity;
    });

    document.querySelector('.total').textContent = "Total: $" + totalAmount.toFixed(2);
}

function incrementQuantity(productId) {
    var quantitySpan = document.getElementById(`quantity-${productId}`);
    var currentQuantity = parseInt(quantitySpan.textContent);
    quantitySpan.textContent = currentQuantity + 1;

    updateTotal();
}

function decrementQuantity(productId) {
    var quantitySpan = document.getElementById(`quantity-${productId}`);
    var currentQuantity = parseInt(quantitySpan.textContent);
    if (currentQuantity > 1) {
        quantitySpan.textContent = currentQuantity - 1;
    } else {
        var selectedProduct = document.querySelector(`.selected-product[data-product-id="${productId}"]`);
        if (selectedProduct) {
            selectedProduct.parentNode.removeChild(selectedProduct);
        }
    }

    updateTotal();
}

var selectedPaymentMethod = null;

// Hàm để thực hiện chức năng thanh toán
function checkout() {
    // Kiểm tra xem đã chọn khách hàng chưa
    if (selectedCustomerId === null) {
        alert("Vui lòng chọn khách hàng trước khi thanh toán.");
        return;
    }

    // Kiểm tra xem giỏ hàng có sản phẩm không
    var selectedProducts = document.querySelectorAll('.selected-product');
    if (selectedProducts.length === 0) {
        alert("Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.");
        return;
    }

    var cashRadio = document.getElementById('cash');
    var cardRadio = document.getElementById('card');
    

    if (!cashRadio.checked && !cardRadio.checked) {
        alert("Vui lòng chọn phương thức thanh toán trước khi thanh toán.");
        return;
    }

    // Lưu phương thức thanh toán đã chọn
    if (cashRadio.checked) {
        selectedPaymentMethod = "cash";
    } else {
        selectedPaymentMethod = "card";
    }

    // Tạo đơn hàng
    var orderData = {
        customerId: selectedCustomerId,
        tenantId: tenantId,
        paymentMethod: selectedPaymentMethod, // Thêm phương thức thanh toán vào dữ liệu đơn hàng
        orderDetails: []
    };

    selectedProducts.forEach(function(product) {
        var productId = product.getAttribute('data-product-id');
        var productName = product.querySelector('span').textContent;
        var quantity = parseInt(product.querySelector('span:nth-child(2)').textContent);
        var productPrice = parseFloat(product.querySelector('.product-price').textContent.replace('$', ''));
        
        orderData.orderDetails.push({
            productId: productId,
            quantity: quantity,
            unitPrice: productPrice,
            tenantId: tenantId,
        });
    });

    // Gửi yêu cầu tạo đơn hàng lên server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "create_order.php", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.success) {
                // Đơn hàng đã được tạo thành công
                alert("Đơn hàng đã được tạo thành công.");

                // Đặt lại phương thức thanh toán về null
                selectedPaymentMethod = null;

                // Loại bỏ tích trên nút radio của phương thức thanh toán
                cashRadio.checked = false;
                cardRadio.checked = false;

                // Xóa sản phẩm khỏi giỏ hàng sau khi thanh toán
                selectedProducts.forEach(function(product) {
                    product.parentNode.removeChild(product);
                });
                // Cập nhật tổng số tiền
                updateTotal();

                // Loại bỏ khách hàng được chọn từ kết quả tìm kiếm
                var selectedCustomerDisplay = document.querySelector('.customer-display');
                selectedCustomerDisplay.innerHTML = '';
            } else {
                // Xảy ra lỗi khi tạo đơn hàng
                alert("Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.");
            }
        }
    };
    console.log(xhr.responseText);
    xhr.send(JSON.stringify(orderData));
}

// Thêm sự kiện click vào nút thanh toán
document.querySelector('.checkout-button').addEventListener('click', checkout);



