const api = "https://script.google.com/macros/s/AKfycbzbj-n1Bew61qx5_8N7PCdvZGQf8PKjbIEDqhMRphK5kLyctGz3iIhWa_oN7wG_QG0BaQ/exec";

function loadProducts() {

    fetch(api)
    .then(res => res.json())
    .then(data => {

        products = data.filter(p => p.Status === "متوفر");

        filtered = [...products];

        loadCategories();

        renderProducts();

        updateCartBar();

        // فتح المنتج إذا كان الرابط يحتوي على product ID
        const params = new URLSearchParams(window.location.search);

        const productID = params.get("product");

        if(productID){

            const product = products.find(
                p => String(p.ID) === String(productID)
            );

            if(product){

                openProduct(product);

            }

        }

    });

}

loadProducts();