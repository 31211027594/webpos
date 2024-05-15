function toggleSearchBox() {
    var searchBox = document.querySelector(".search-box");
    searchBox.style.display = searchBox.style.display === "none" ? "block" : "none";
}

function searchCustomer() {
    var searchInput = document.getElementById("searchCustomerInput").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "search-customer.php?query=" + searchInput, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var searchResultsDiv = document.querySelector(".search-results");
            searchResultsDiv.innerHTML = xhr.responseText;
            searchResultsDiv.style.display = searchInput ? "block" : "none";
        }
    };
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function() {
    var searchResults = document.querySelectorAll('.search-result');

    searchResults.forEach(function(result) {
        result.addEventListener('mouseover', function() {
            this.style.backgroundColor = 'lightgreen';
        });

        result.addEventListener('mouseout', function() {
            this.style.backgroundColor = '';
        });
    });
});
