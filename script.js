const api = "https://script.google.com/macros/s/AKfycbzbj-n1Bew61qx5_8N7PCdvZGQf8PKjbIEDqhMRphK5kLyctGz3iIhWa_oN7wG_QG0BaQ/exec";

let products = [];
let filtered = [];
let cart = [];

const cartBar = document.getElementById("cartBar");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const productsDiv = document.getElementById("products");
const search = document.getElementById("search");
const category = document.getElementById("category");
const sort = document.getElementById("sort");

fetch(api)
.then(res => res.json())
.then(data => {

    products = data.filter(p => p.Status === "متوفر");
    filtered = [...products];

    loadCategories();
    renderProducts();

});

function loadCategories(){

    category.innerHTML = `<option value="">جميع الأقسام</option>`;

    const cats = [...new Set(

        products
            .flatMap(p => (p["الأقسام"] || "")
            .split(",")
            .map(c => c.trim()))
            .filter(Boolean)

    )];

    cats.sort();

    cats.forEach(cat=>{

        category.innerHTML += `<option value="${cat}">${cat}</option>`;

    });

}

function renderProducts(){

    productsDiv.innerHTML="";

    filtered.forEach(product=>{

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
const addBtn = card.querySelector(".add-cart");

addBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    addToCart(product);

});
productsDiv.appendChild(card);
card.addEventListener("click", () => {
    openProduct(product);
});
    });

}

function updateProducts(){

    filtered = [...products];

    if(search.value){

        filtered = filtered.filter(p=>

            p["الاسم"].toLowerCase().includes(search.value.toLowerCase())

        );

    }

    if(category.value){

       filtered = filtered.filter(p =>

    (p["الأقسام"] || "")
        .split(",")
        .map(c => c.trim())
        .includes(category.value)

);

    }

    if(sort.value==="name"){

        filtered.sort((a,b)=>a["الاسم"].localeCompare(b["الاسم"],"ar"));

    }

    if(sort.value==="low"){

        filtered.sort((a,b)=>Number(a["السعر"])-Number(b["السعر"]));

    }

    if(sort.value==="high"){

        filtered.sort((a,b)=>Number(b["السعر"])-Number(a["السعر"]));

    }

    renderProducts();

}

search.addEventListener("input",updateProducts);

category.addEventListener("change",updateProducts);

sort.addEventListener("change",updateProducts);

const modal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");
const cartModal = document.getElementById("cartModal");
const cartBody = document.getElementById("cartBody");

document.querySelector(".close-cart").onclick = () => {

    cartModal.style.display = "none";

};
document.querySelector(".close").onclick = () => {
    modal.style.display = "none";
};

function openProduct(product){

    modalBody.innerHTML = `
        <img src="${product.Image}" style="width:100%;border-radius:14px;">

        <h2>${product["الاسم"]}</h2>

        <div class="price">${product["السعر"]} ر.س</div>

        <p>${product["الوصف"] || ""}</p>
    `;

    modal.style.display = "block";

}

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

    const totalQty = cart.reduce((sum,item)=>sum+item.qty,0);

    const totalPrice = cart.reduce((sum,item)=>{

        return sum + (Number(item["السعر"]) * item.qty);

    },0);

    cartCount.textContent = `🛒 ${totalQty} منتج`;

    cartTotal.textContent = `${totalPrice} ر.س`;

}
cartBar.addEventListener("click", openCart);

function openCart(){

    cartBody.innerHTML = "<h2>🛒 السلة</h2>";

    cart.forEach(item=>{

        cartBody.innerHTML += `

        <div class="cart-item">

            <h3>${item["الاسم"]}</h3>

            <div>${item.qty} × ${item["السعر"]} ر.س</div>

        </div>

        <hr>

        `;

    });

    cartModal.style.display = "block";

}

