document.addEventListener("DOMContentLoaded", () => {

    // ===== Берём корзину из localStorage =====
    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    // ===============================  
    // 1. РЕНДЕР ТОВАРОВ ПОД "YOUR CART"
    // ===============================  
    function renderCheckoutCart() {
        const container = document.querySelector('.your-cart');
        if (!container) return;

        // удаляем тестовые карточки, оставляем только заголовок
        container.querySelectorAll('.cart-card').forEach(el => el.remove());

        if (cart.length === 0) {
            container.innerHTML += `<p>Your cart is empty</p>`;
            return;
        }

        cart.forEach(item => {
            const card = document.createElement('article');
            card.className = 'cart-card';
            card.innerHTML = `
                <img src="${item.img}" class="cart-card__img" alt="${item.title}">

                <div class="cart-card__info">
                    <div class="cart-card__title">${item.title}</div>

                    <div class="cart-card__meta">
                        ${item.color ? `Color: ${item.color}<br>` : ""}
                        ${item.size ? `Size: ${item.size}, ` : ""}
                        Qty: 1
                    </div>

                    <div class="cart-card__price">$${item.price.toFixed(2)}</div>
                </div>
            `;
            container.appendChild(card);
        });
    }


    // ===============================  
    // 2. РАСЧЁТ SUMMARY (Subtotal, Discount, Total)
    // ===============================  
    function updateOrderSummary() {
        let subtotal = cart.reduce((sum, item) => sum + item.price, 0);

        // как в корзине
        let discount = subtotal > 0 ? 13 : 0;

        // доставка
        let shippingCost = 0;
        let shippingText = "Free";

        const selectedShipping = document.querySelector('.shipping-option--active');
        if (selectedShipping) {
            const priceEl = selectedShipping.querySelector('.shipping-option__price');
            if (priceEl) {
                const txt = priceEl.textContent.trim();
                if (txt !== "Free") {
                    shippingCost = parseFloat(txt.replace("$", "")) || 0;
                    shippingText = `$${shippingCost.toFixed(2)}`;
                }
            }
        }

        const total = subtotal - discount + shippingCost;

        document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("discount").textContent = `- $${discount.toFixed(2)}`;
        document.getElementById("shipping").textContent = shippingText;
        document.getElementById("total").textContent = `$${total.toFixed(2)}`;
    }


    // ===============================  
    // 3. ПЕРЕКЛЮЧЕНИЕ ДОСТАВКИ (уже есть, просто добавим пересчёт)
    // ===============================  
    document.querySelectorAll(".shipping-option").forEach(option => {
        option.addEventListener("click", () => {
            const group = option.closest(".shipping-methods");
            group.querySelectorAll(".shipping-option")
                 .forEach(o => o.classList.remove("shipping-option--active"));

            option.classList.add("shipping-option--active");
            option.querySelector("input[type='radio']").checked = true;

            updateOrderSummary();
        });
    });


    // ===============================  
    // 4. ИНИЦИАЛИЗАЦИЯ
    // ===============================  
    renderCheckoutCart();    // товары
    updateOrderSummary();    // суммы
});
