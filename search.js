function searchProducts() {
    var searchInput = document.getElementById("searchInput").value;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "search.php?query=" + searchInput, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementsByClassName("product-display")[0].innerHTML = xhr.responseText;
        }
    };
    xhr.send();
}
