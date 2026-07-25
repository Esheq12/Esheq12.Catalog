const api = "https://script.google.com/macros/s/AKfycbzbj-n1Bew61qx5_8N7PCdvZGQf8PKjbIEDqhMRphK5kLyctGz3iIhWa_oN7wG_QG0BaQ/exec";

let products = [];
let filtered = [];

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

    const cats = [...new Set(products.map(p=>p["القسم"]).filter(Boolean))];

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
        🛒 أضف للسلة
    </button>
`;
const addBtn = card.querySelector(".add-cart");

addBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    alert("سيتم ربط السلة في الخطوة القادمة");

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

        filtered = filtered.filter(p=>p["القسم"]===category.value);

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
