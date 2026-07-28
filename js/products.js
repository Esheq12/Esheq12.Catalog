function loadCategories(){

    category.innerHTML = `
        <option value="">جميع الأقسام</option>
    `;

    const cats = [

        ...new Set(

            products
            .flatMap(product =>

                (product["الأقسام"] || "")

                .split(",")

                .map(cat => cat.trim())

            )
            .filter(Boolean)

        )

    ];

    cats.sort();

    cats.forEach(cat => {

        category.innerHTML += `

            <option value="${cat}">

                ${cat}

            </option>

        `;

    });

}

// =====================================
// عرض المنتجات
// =====================================

function renderProducts(){

    productsDiv.innerHTML = "";

    filtered.forEach(product => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <img src="${product.Image}" alt="${product["الاسم"]}">

            <h3>${product["الاسم"]}</h3>

            <div class="price">

            ${
            product["السعر بعد الخصم"]

            ?

            `
            <span class="old-price">

            ${product["السعر"]} ر.س

            </span>

            <span class="new-price">

            ${product["السعر بعد الخصم"]} ر.س

            </span>
            `

            :

            `
            <span class="new-price">

            ${product["السعر"]} ر.س

            </span>
            `
            }

            </div>

            <button class="add-cart">

                🛒 إضافة للسلة

            </button>

        `;

        card.addEventListener("click",()=>{

            openProduct(product);

        });

        const addBtn = card.querySelector(".add-cart");

        addBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            addToCart(product);

        });

        productsDiv.appendChild(card);

    });

}
