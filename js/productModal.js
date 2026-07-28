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
// اغلاق النافذة//
document.querySelector(".close").onclick = () => {

    modal.classList.remove("show");

    setTimeout(()=>{

        modal.style.display = "none";

    },250);

};
