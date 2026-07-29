const cartSheet = document.getElementById("cartSheet");

function addToCart(product, color = "", size = ""){

    const item = cart.find(p =>

        p.ID == product.ID &&
        p.selectedColor == color &&
        p.selectedSize == size

    );

    if(item){

        item.qty++;

    }else{

        cart.push({

            ...product,

            qty: 1,

            selectedColor: color,

            selectedSize: size

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
${
item.selectedColor
?
`<div class="cart-option">🎨 ${item.selectedColor}</div>`
:
""
}

${
item.selectedSize
?
`<div class="cart-option">📏 ${item.selectedSize}</div>`
:
""
}

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

        modal.classList.remove("show");

        setTimeout(()=>{

            modal.style.display = "none";

        },250);

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

    const price = item["السعر بعد الخصم"] || item["السعر"];

    message += ` ${item["الاسم"]}%0A`;

    if(item.selectedColor){

        message += `اللون: ${item.selectedColor}%0A`;
    }
    if(item.selectedSize){
        message += ` المقاس: ${item.selectedSize}%0A`;
    }
    message += `الكمية: ${item.qty}%0A`;
    message += `السعر: ${price} ر.س%0A`;
    if(item.Image){
        message += ` صورة المنتج:%0A${item.Image}%0A`;
    }

    message += `%0A────────────%0A%0A`;

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
// اغلاق النافذة//
document.getElementById("closeCart").onclick = () => {

    cartSheet.classList.remove("show");

};
