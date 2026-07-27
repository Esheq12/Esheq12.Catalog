// =====================================
// الإعدادات
// =====================================

const api = "https://script.google.com/macros/s/AKfycbzbj-n1Bew61qx5_8N7PCdvZGQf8PKjbIEDqhMRphK5kLyctGz3iIhWa_oN7wG_QG0BaQ/exec";

fetch(api)
.then(res => res.json())
.then(data => {

    products = data.filter(p => p.Status === "متوفر");

    filtered = [...products];

    loadCategories();

    renderProducts();

    updateCartBar();

});

// السلة


const cartSheet = document.getElementById("cartSheet");


// =====================================
// تحميل البيانات
// =====================================


// =====================================
// إغلاق النوافذ
// =====================================

document.querySelector(".close").onclick = () => {

    modal.classList.remove("show");

    setTimeout(()=>{

        modal.style.display = "none";

    },250);

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

    const images = [

    product.Image,
    product.Image2,
    product.Image3,
    product.Image4,
    product.Image5

].filter(Boolean);
    
    modalBody.innerHTML = `

        <div class="gallery">

    <button class="gallery-btn prev">‹</button>

    <img
        id="galleryImage"
        src="${images[0]}"
        class="gallery-image">

    <button class="gallery-btn next">›</button>

</div>

<div class="gallery-dots">

    ${images.map((_,i)=>`

        <span class="dot ${i===0?"active":""}"></span>

    `).join("")}

</div>
        <h2 style="margin-top:18px;">

            ${product["الاسم"]}

        </h2>

        <div class="product-price">

            ${product["السعر"]} ر.س

        </div>

        <p style="margin-top:16px;line-height:1.8;">

            ${product["الوصف"] || "لا يوجد وصف"}

        </p>

        <button
            class="product-add-cart">

            🛒 إضافة للسلة

        </button>

    `;

   modalBody
    .querySelector(".product-add-cart")
    .onclick = ()=>{

        addToCart(product);

        modal.classList.remove("show");

        setTimeout(()=>{

            modal.style.display="none";

        },250);

    };
let currentImage = 0;
let startX = 0;
const galleryImage = document.getElementById("galleryImage");


  galleryImage.addEventListener("touchstart",(e)=>{

    startX = e.touches[0].clientX;

});

galleryImage.addEventListener("touchend",(e)=>{

    const endX = e.changedTouches[0].clientX;

    const diff = startX - endX;

    if(Math.abs(diff) < 50) return;

    if(diff > 0){

        showImage(

            (currentImage + 1) % images.length

        );

    }else{

        showImage(

            (currentImage - 1 + images.length) % images.length

        );

    }

});  
const dots = modalBody.querySelectorAll(".dot");
dots.forEach((dot,index)=>{

    dot.onclick = ()=>{

        showImage(index);

    };

});
function showImage(index){

    currentImage = index;

    galleryImage.src = images[index];

    dots.forEach(dot=>dot.classList.remove("active"));

    dots[index].classList.add("active");

}

if(images.length <= 1){

    modalBody.querySelector(".prev").style.display = "none";

    modalBody.querySelector(".next").style.display = "none";

}

modalBody.querySelector(".next").onclick = ()=>{

    showImage(

        (currentImage + 1) % images.length

    );

};

modalBody.querySelector(".prev").onclick = ()=>{

    showImage(

        (currentImage - 1 + images.length) % images.length

    );

};
    modal.style.display = "flex";

requestAnimationFrame(()=>{

    modal.classList.add("show");

});

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

    localStorage.removeItem("cart");

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

    localStorage.setItem("cart", JSON.stringify(cart));

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

       <div class="cart-buttons">

    <button class="clear-btn" onclick="clearCart()">

        🗑 إفراغ السلة

    </button>

    <button class="checkout-btn" onclick="sendWhatsApp()">

         إرسال الطلب عبر واتساب

    </button>

</div>
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
function clearCart(){

    if(!confirm("هل تريد إفراغ السلة؟")) return;

    cart = [];

    updateCartBar();

    cartSheet.classList.remove("show");

}

