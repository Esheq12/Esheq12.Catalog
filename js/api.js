const api = "https://script.google.com/macros/s/AKfycbzbj-n1Bew61qx5_8N7PCdvZGQf8PKjbIEDqhMRphK5kLyctGz3iIhWa_oN7wG_QG0BaQ/exec";

function loadProducts() {

    const cachedProducts = localStorage.getItem("productsCache");

    const params = new URLSearchParams(
        window.location.search
    );

    const productID = params.get("product");

    let productOpened = false;


    // =====================================
    // تحميل المنتجات من الـ Cache مباشرة
    // =====================================

    if(cachedProducts){

        try{

            products = JSON.parse(cachedProducts)
                .filter(p => p.Status === "متوفر");

            filtered = [...products];

            loadCategories();

            renderProducts();

            updateCartBar();


            // فتح المنتج من الرابط
            if(productID){

                const product = products.find(
                    p => String(p.ID) === String(productID)
                );

                if(product){

                    openProduct(product);

                    productOpened = true;

                }

            }

        }catch(error){

            console.log("Cache error:", error);

        }

    }


    // =====================================
    // تحديث المنتجات من Google Sheets
    // =====================================

    fetch(api)

    .then(res => res.json())

    .then(data => {

        const availableProducts = data.filter(
            p => p.Status === "متوفر"
        );


        // حفظ أحدث نسخة
        localStorage.setItem(
            "productsCache",
            JSON.stringify(availableProducts)
        );


        products = availableProducts;

        filtered = [...products];


        loadCategories();

        renderProducts();

        updateCartBar();


        // =====================================
        // فتح المنتج فقط إذا لم نفتحه سابقًا
        // =====================================

        if(productID && !productOpened){

            const product = products.find(
                p => String(p.ID) === String(productID)
            );

            if(product){

                openProduct(product);

                productOpened = true;

            }

        }

    })

    .catch(error => {

        console.error(
            "Failed to load products:",
            error
        );

    });

}

loadProducts();