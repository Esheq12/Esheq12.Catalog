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

            <img
    data-src="${product.Image}"
    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
    alt="${product["الاسم"]}"
    class="lazy-image">

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

    if(product["الألوان"] || product["المقاسات"]){

        openProduct(product);

    }else{

        addToCart(product);

    }

});
        productsDiv.appendChild(card);

    });
lazyLoadImages();
}
function normalizeArabic(text){

    return (text || "")
        .toLowerCase()
        .replace(/[أإآ]/g,"ا")
        .replace(/ة/g,"ه")
        .replace(/ى/g,"ي")
        .replace(/ؤ/g,"و")
        .replace(/ئ/g,"ي");

}
function updateProducts(){

    filtered = [...products];

   if(search.value){

    const keyword = normalizeArabic(search.value.trim());

    filtered = filtered.filter(product =>{

        const name = normalizeArabic(product["الاسم"]);

        const desc = normalizeArabic(product["الوصف"]);

        const cats = normalizeArabic(product["الأقسام"]);

        return (

            name.includes(keyword) ||

            desc.includes(keyword) ||

            cats.includes(keyword)

        );

    });

}

    if(category.value){

        filtered = filtered.filter(product=>

            (product["الأقسام"] || "")
            .split(",")
            .map(cat=>cat.trim())
            .includes(category.value)

        );

    }

    switch(sort.value){

        case "name":

            filtered.sort((a,b)=>

                a["الاسم"].localeCompare(b["الاسم"],"ar")

            );

        break;

        case "low":

            filtered.sort((a,b)=>

                Number(a["السعر"])-
                Number(b["السعر"])

            );

        break;

        case "high":

            filtered.sort((a,b)=>

                Number(b["السعر"])-
                Number(a["السعر"])

            );

        break;

    }

    renderProducts();

}

let searchTimer;

const suggestions = document.getElementById("searchSuggestions");

function updateSuggestions(){

    const keyword = normalizeArabic(search.value.trim());

    if(!keyword){

        suggestions.style.display = "none";

        suggestions.innerHTML = "";

        return;

    }

    const results = products.filter(product=>{

        const name = normalizeArabic(product["الاسم"]);

        const desc = normalizeArabic(product["الوصف"]);

        const cats = normalizeArabic(product["الأقسام"]);

        return (

            name.includes(keyword) ||

            desc.includes(keyword) ||

            cats.includes(keyword)

        );

    }).slice(0,5);

    if(results.length===0){

        suggestions.style.display="none";

        suggestions.innerHTML="";

        return;

    }

    suggestions.innerHTML = results.map(product=>`

        <div class="search-item" data-id="${product.ID}">

            <img src="${product.Image}">

            <div class="search-info">

                <div class="search-name">

                    ${product["الاسم"]}

                </div>

                <div class="search-price">

                    ${
                        product["السعر بعد الخصم"]
                        ?
                        product["السعر بعد الخصم"]
                        :
                        product["السعر"]
                    } ر.س

                </div>

            </div>

        </div>

    `).join("");

    suggestions.style.display="block";

    suggestions.querySelectorAll(".search-item").forEach(item=>{

        item.onclick = ()=>{

            const product = products.find(

                p=>String(p.ID)===item.dataset.id

            );

            if(product){

                suggestions.style.display="none";

                search.value="";
                updateProducts();

                openProduct(product);
            }
        };
    });
}

search.addEventListener("input",()=>{

    clearTimeout(searchTimer);

    searchTimer = setTimeout(()=>{

    updateProducts();

    updateSuggestions();

},250);
});

category.addEventListener("change",()=>{

    if(category.value===""){

        search.value="";

        const suggestions = document.getElementById("searchSuggestions");

        if(suggestions){

            suggestions.style.display="none";

        }

    }

    updateProducts();

});

sort.addEventListener("change",updateProducts);

document.addEventListener("click",(e)=>{

    if(!e.target.closest(".search-wrapper")){

        suggestions.style.display="none";
    }
});

function lazyLoadImages(){

    const images = document.querySelectorAll(".lazy-image");

    const observer = new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                const img = entry.target;

                img.src = img.dataset.src;

                img.onload = ()=>{

                    img.classList.add("loaded");
                };
                observer.unobserve(img);
            }
        });
    },{
        rootMargin:"150px"
    });
    images.forEach(img=>observer.observe(img));
}
