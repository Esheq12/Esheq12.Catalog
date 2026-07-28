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

${
${
product["الألوان"]
?
`
<div class="product-options">

<div class="option-title">
 اختر اللون
</div>

<div class="color-options">

${product["الألوان"]
.split(",")
.map(color=>`

<div
class="color-chip"
data-color="${color.trim()}">

${color.trim()}

</div>

`).join("")}

</div>

</div>
`
:
""
}

${
product["المقاسات"]
?
`
<div class="product-options">

<div class="option-title">
 اختر المقاس
</div>

<div class="size-options">

${product["المقاسات"]
.split(",")
.map(size=>`

<div
class="size-chip"
data-size="${size.trim()}">

${size.trim()}

</div>

`).join("")}

</div>

</div>
`
:
""
}

<p style="margin-top:16px;line-height:1.8;">
${product["الوصف"] || "لا يوجد وصف"}
</p>

<button class="product-add-cart">
🛒 إضافة للسلة
</button>

`;
let selectedColor = "";
let selectedSize = "";

// اختيار اللون
modalBody.querySelectorAll(".color-chip").forEach(chip=>{

    chip.onclick = ()=>{

        modalBody.querySelectorAll(".color-chip")
        .forEach(c=>c.classList.remove("active"));

        chip.classList.add("active");

        selectedColor = chip.dataset.color;

    };

});

// اختيار المقاس
modalBody.querySelectorAll(".size-chip").forEach(chip=>{

    chip.onclick = ()=>{

        modalBody.querySelectorAll(".size-chip")
        .forEach(c=>c.classList.remove("active"));

        chip.classList.add("active");

        selectedSize = chip.dataset.size;

    };

});
  modalBody.querySelector(".product-add-cart").onclick = ()=>{

    const colorSelect = document.getElementById("productColor");
    const sizeSelect = document.getElementById("productSize");
    const selectedColor = colorSelect ? colorSelect.value : "";
    const selectedSize = sizeSelect ? sizeSelect.value : "";

    if(colorSelect && !selectedColor){

        alert("اختر اللون");

        return;
    }

    if(sizeSelect && !selectedSize){

        alert("اختر المقاس");

        return;
    }
    if(product["الألوان"] && !selectedColor){

    alert("اختر اللون أولاً");

    return;

}

if(product["المقاسات"] && !selectedSize){

    alert("اختر المقاس أولاً");

    return;

}

addToCart(product, selectedColor, selectedSize);

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
// اغلاق النافذة//
document.querySelector(".close").onclick = () => {

    modal.classList.remove("show");

    setTimeout(()=>{

        modal.style.display = "none";

    },250);

};
