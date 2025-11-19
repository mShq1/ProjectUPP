// ===== MOCK DATA (в будущем заменишь API вызовом) =====
const catalogMock = [
    { id: 1, title: "Men's PFG Pro Sport Boot", price: 137, img: "../catalog/test-product.jpg" },
    { id: 2, title: "Grey Ice Sneakers", price: 89, img: "../catalog/test-product.jpg" },
    { id: 3, title: "Arson Winter Jacket", price: 159, img: "../catalog/test-product.jpg" },
    { id: 4, title: "Trail Runner Shoes", price: 120, img: "../catalog/test-product.jpg" },
    { id: 5, title: "Blue Windbreaker", price: 95, img: "../catalog/test-product.jpg" }
];

// ===== Корзина хранится в localStorage =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== Инициализация =====
renderCart();
renderSummary();
renderRecommendations();


// ===== РЕНДЕР КОРЗИНЫ =====
function renderCart() {
    const container = document.getElementById("cart-items");

    if (cart.length === 0) {
        container.innerHTML = `<div class="cart-empty">No items in cart</div>`;
        return;
    }

    container.innerHTML = "";

    cart.forEach(item => {
        container.innerHTML += `
            <div class="cart-card">
                <img src="${item.img}" class="cart-card__img">

                <div class="cart-card__info">
                    <div>
                        <div class="cart-card__title">${item.title}</div>
                    </div>

                    <div class="cart-card__price">$${item.price.toFixed(2)}</div>
                </div>
            </div>
        `;
    });
}


// ===== РЕНДЕР ORDER SUMMARY =====
function renderSummary() {
    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let discount = subtotal > 0 ? 13 : 0;  
    let total = subtotal - discount;

    document.getElementById("summary-subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("summary-discount").textContent = `-$${discount.toFixed(2)}`;
    document.getElementById("summary-total").textContent = `$${total.toFixed(2)}`;
}


// ===== РЕКОМЕНДАЦИИ =====
function renderRecommendations() {
    const container = document.getElementById("recommend-grid");

    let items = catalogMock.sort(() => Math.random() - 0.5).slice(0, 4);

    items.forEach(p => {
        container.innerHTML += `
            <div class="rec-item">
                <img src="${p.img}" class="cart-card__img">
                <p>${p.title}</p>
                <strong>$${p.price.toFixed(2)}</strong>
            </div>
        `;
    });
}
