var selectedCustomerId = null;

document.addEventListener("DOMContentLoaded", function() {
    var searchResults = document.querySelectorAll('.search-result');

    searchResults.forEach(function(result) {
        result.addEventListener('click', function() {
            var customerId = this.dataset.customerId;
            selectCustomer(customerId);
        });
    });
});

function selectCustomer(customerId) {
    selectedCustomerId = customerId;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "get_customer.php?id=" + customerId, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.querySelector(".customer-display").innerHTML = xhr.responseText;
            document.querySelector(".search-box").style.display = "none";
        }
    };
    xhr.send();
}

