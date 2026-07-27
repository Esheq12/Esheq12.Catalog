// =====================================
// الإعدادات
// =====================================

const api =
"https://script.google.com/macros/s/AKfycbzbj-n1Bew61qx5_8N7PCdvZGQf8PKjbIEDqhMRphK5kLyctGz3iIhWa_oN7wG_QG0BaQ/exec";

// =====================================
// البيانات
// =====================================

let products = [];
let filtered = [];
let cart = [];

// =====================================
// عناصر الصفحة
// =====================================

const productsDiv = document.getElementById("products");

const search = document.getElementById("search");
const category = document.getElementById("category");
const sort = document.getElementById("sort");

// تفاصيل المنتج

const modal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");

// السلة

const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const cartSheet = document.getElementById("cartSheet");
const cartBody = document.getElementById("cartBody");

// =====================================
// تحميل البيانات
// =====================================

fetch(api)

.then(res => res.json())

.then(data => {

    products = data.filter(p => p.Status === "متوفر");

    filtered = [...products];

    loadCategories();

    renderProducts();

});

// =====================================
// إغلاق النوافذ
// =====================================

document.querySelector(".close").onclick = () => {

    modal.style.display = "none";

};

document.getElementById("closeCart").onclick = () => {

    cartSheet.classList.remove("show");

};

// =====================================
// تحميل الأقسام
// =====================================

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

                ${product["السعر"]} ر.س

            </div>

            <button class="add-cart">

                🛒 إضافة للسلة

            </button>

        `;

        // فتح تفاصيل المنتج

        card.addEventListener("click", () => {

            openProduct(product);

        });

        // زر السلة

        const addBtn = card.querySelector(".add-cart");

        addBtn.addEventListener("click",(e)=>{

            e.stopPropagation();

            addToCart(product);

        });

        productsDiv.appendChild(card);

    });

}

// =====================================
// البحث والتصفية والترتيب
// =====================================

function updateProducts(){

    filtered = [...products];

    // البحث

    if(search.value){

        const keyword = search.value.toLowerCase();

        filtered = filtered.filter(product =>

            product["الاسم"]

            .toLowerCase()

            .includes(keyword)

        );

    }

    // القسم

    if(category.value){

        filtered = filtered.filter(product =>

            (product["الأقسام"] || "")

            .split(",")

            .map(cat => cat.trim())

            .includes(category.value)

        );

    }

    // الترتيب

    switch(sort.value){

        case "name":

            filtered.sort((a,b)=>

                a["الاسم"]

                .localeCompare(b["الاسم"],"ar")

            );

        break;

        case "low":

            filtered.sort((a,b)=>

                Number(a["السعر"])

                -

                Number(b["السعر"])

            );

        break;

        case "high":

            filtered.sort((a,b)=>

                Number(b["السعر"])

                -

                Number(a["السعر"])

            );

        break;

    }

    renderProducts();

}

// =====================================
// الأحداث الخاصة بالفلاتر
// =====================================

search.addEventListener("input",updateProducts);

category.addEventListener("change",updateProducts);

sort.addEventListener("change",updateProducts);

// =====================================
// نافذة تفاصيل المنتج
// =====================================

function openProduct(product){

    modalBody.innerHTML = `

        <img
            src="${product.Image}"
            style="width:100%;border-radius:16px;">

        <h2 style="margin-top:18px;">

            ${product["الاسم"]}

        </h2>

        <div class="price">

            ${product["السعر"]} ر.س

        </div>

        <p style="margin-top:16px;line-height:1.8;">

            ${product["الوصف"] || "لا يوجد وصف"}

        </p>

        <button
            class="add-cart"
            style="margin-top:20px;width:100%;">

            🛒 إضافة للسلة

        </button>

    `;

    modalBody
        .querySelector(".add-cart")
        .onclick = ()=>{

            addToCart(product);

            modal.style.display="none";

        };

    modal.style.display="block";

}

// =====================================
// السلة
// =====================================

function addToCart(product){

    const item = cart.find(p => p.ID == product.ID);

    if(item){

        item.qty++;

    }else{

        cart.push({

            ...product,

            qty:1

        });

    }

    updateCartBar();

}

function updateCartBar(){

    if(cart.length === 0){

        cartBar.style.display = "none";

        return;

    }

    cartBar.style.display = "flex";

    const totalQty = cart.reduce(

        (sum,item)=>sum + item.qty,

        0

    );

    const totalPrice = cart.reduce(

        (sum,item)=>

            sum + Number(item["السعر"]) * item.qty,

        0

    );

    cartCount.textContent = `🛒 ${totalQty} منتج`;

    cartTotal.textContent = `${totalPrice} ر.س`;

}

// =====================================
// Bottom Sheet
// =====================================

function openCart(){

    cartBody.innerHTML = "";

    if(cart.length===0){

        cartBody.innerHTML = `

            <p style="text-align:center;padding:30px">

                السلة فارغة 🌿

            </p>

        `;

    }else{

       cart.forEach(item=>{

    cartBody.innerHTML += `

        <div class="cart-item">

            <img src="${item.Image}" class="cart-image">

            <div class="cart-info">

                <h3>${item["الاسم"]}</h3>

                <div class="cart-price">

                    ${item["السعر"]} ر.س

                </div>

                <div class="cart-controls">

    <button onclick="changeQty('${item.ID}',-1)">−</button>

    <span>${item.qty}</span>

    <button onclick="changeQty('${item.ID}',1)">+</button>

</div>
            </div>

        </div>

        <hr>

    `;

});

    }
const total = cart.reduce((sum,item)=>{

    return sum + Number(item["السعر"]) * item.qty;

},0);

cartBody.innerHTML += `

    <div class="cart-footer">

        <div class="cart-total">

            الإجمالي

            <span>${total} ر.س</span>

        </div>

        <button class="checkout-btn" onclick="sendWhatsApp()">

 إرسال الطلب عبر واتساب

</button>
    </div>

`;
    cartSheet.classList.add("show");

}
function changeQty(id,change){

    const item = cart.find(p => p.ID == id);

    if(!item) return;

    item.qty += change;

    if(item.qty <= 0){

        cart = cart.filter(p => p.ID != id);

    }

    updateCartBar();

    openCart();

}
// =====================================
// Events
// =====================================

// فتح السلة

cartBar.addEventListener("click", openCart);

// إغلاق نافذة المنتج عند الضغط خارجها

window.addEventListener("click",(e)=>{

    if(e.target === modal){

        modal.style.display = "none";

    }

});

// إغلاق السلة عند الضغط خارجها

window.addEventListener("click",(e)=>{

    if(e.target === cartSheet){

        cartSheet.classList.remove("show");

    }

});
function sendWhatsApp(){

    let message = "السلام عليكم 🌿%0A%0A";
    message += "أرغب بطلب:%0A%0A";

    cart.forEach(item=>{

        message += `• ${item["الاسم"]}%0A`;
        message += `الكمية: ${item.qty}%0A`;
        message += `السعر: ${item["السعر"]} ر.س%0A%0A`;

    });

    const total = cart.reduce((sum,item)=>{

        return sum + Number(item["السعر"]) * item.qty;

    },0);

    message += `الإجمالي: ${total} ر.س`;

    const phone = "966564489896";

    window.open(

        `https://wa.me/${phone}?text=${message}`,

        "_blank"

    );

}
