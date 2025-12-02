// ================= PRODUCTS =================
let products = []; // реальные данные с сервера

// ================= SELECTORS =================
const grid = document.getElementById("products-grid");
const sortSelect = document.querySelector(".sort-select");
const sortDrop = document.querySelector(".sort-dropdown");
const sortValue = document.getElementById("sort-value");

// ================= FETCH PRODUCTS FROM BACKEND =================
async function fetchProducts() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/products/');
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        products = data;
        renderProducts();
    } catch (error) {
        console.error(error);
    }
}

// ================= RENDER PRODUCTS =================
function renderProducts() {
    grid.innerHTML = "";

    products.forEach(p => {
        const variantOptions = p.variants?.map(v => `${v.size || ''} / ${v.color || ''}`).join(', ') || '';
        const imgSrc = p.images?.[0]?.image || '../catalog/test-product.jpg';

        grid.innerHTML += `
            <div class="product-card">
                <img src="${imgSrc}">
                <div class="product-title">${p.name}</div>
                <div class="product-price">$${p.price}</div>
                <div class="product-variants">${variantOptions}</div>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        `;
    });
}

// ================= CART FUNCTIONALITY =================
async function addToCart(productId, quantity = 1) {
    try {
        const token = localStorage.getItem('access_token'); // JWT если есть
        const response = await fetch('http://127.0.0.1:8000/api/cart/add/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product: productId, quantity })
        });
        const result = await response.json();
        console.log(result.message);
        alert('Товар добавлен в корзину!');
    } catch (error) {
        console.error(error);
    }
}

async function fetchCart() {
    try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/cart/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const cart = await response.json();
        console.log(cart);
        return cart;
    } catch (error) {
        console.error(error);
    }
}

// ================= FILTER TOGGLE FUNCTIONALITY =================
document.querySelectorAll('.filter-header').forEach(header => {
    header.addEventListener('click', () => {
        const filterBox = header.closest('.filter-box');
        filterBox.classList.toggle('collapsed');
        
        const arrow = header.querySelector('img');
        arrow.style.transform = filterBox.classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
    });
});

document.querySelectorAll('.filter-box').forEach((box, index) => {
    if (index !== 0) {
        box.classList.add('collapsed');
        const arrow = box.querySelector('.filter-header img');
        arrow.style.transform = 'rotate(-90deg)';
    }
});

// ================= SORT SELECT =================
sortSelect.addEventListener("click", () => {
    sortDrop.classList.toggle("hidden");
});

document.querySelectorAll(".sort-option").forEach(option => {
    option.addEventListener("click", () => {
        document.querySelectorAll(".sort-option").forEach(o => o.classList.remove("active"));
        option.classList.add("active");
        sortValue.textContent = option.textContent;
        sortDrop.classList.add("hidden");

        // === Sorting Logic ===
        if (option.textContent === "Newest") {
            products.sort((a, b) => b.id - a.id); // по id как proxy новизны
        } else if (option.textContent === "Lowest Price") {
            products.sort((a, b) => a.price - b.price);
        } else if (option.textContent === "Highest Price") {
            products.sort((a, b) => b.price - a.price);
        } else {
            // Best Sellers / Featured / Top Rated
            products = [...products]; // временно
        }

        renderProducts();
    });
});

// ================= CATEGORY PILL ACTIVE =================
document.querySelectorAll(".cat-pill").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

// ================= FILTER TAGS =================
document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", () => tag.classList.toggle("active"));
});

// ================= SIZE BUTTONS =================
document.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", () => btn.classList.toggle("active"));
});

// ================= COLOR SELECTION =================
document.querySelectorAll(".color-dot").forEach(dot => {
    dot.addEventListener("click", () => dot.classList.toggle("active"));
});

// ================= PRICE INPUT FUNCTIONALITY =================
document.querySelectorAll('.price-input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.value.length > 1 && this.value[0] === '0' && this.value[1] !== '.') this.value = this.value.slice(1);
        const maxPrice = 10000;
        if (parseFloat(this.value) > maxPrice) this.value = maxPrice;
        updatePriceFilter();
    });
    input.addEventListener('focus', function() { this.select(); });
    input.addEventListener('blur', function() {
        if (this.value && !isNaN(this.value)) this.value = parseFloat(this.value).toFixed(2);
    });
    input.addEventListener('keydown', function(e) {
        if (!/[\d\.]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(e.key)) e.preventDefault();
        if (e.key === '.' && this.value.includes('.')) e.preventDefault();
    });
});

function updatePriceFilter() {
    const minPriceInput = document.querySelector('.price-input:first-of-type');
    const maxPriceInput = document.querySelector('.price-input:last-of-type');
    
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    if (minPrice > maxPrice) {
        minPriceInput.style.borderColor = '#ff4444';
        maxPriceInput.style.borderColor = '#ff4444';
    } else {
        minPriceInput.style.borderColor = '';
        maxPriceInput.style.borderColor = '';
        filterProductsByPrice(minPrice, maxPrice);
    }
}

function filterProductsByPrice(minPrice, maxPrice) {
    const filteredProducts = products.filter(product => product.price >= minPrice && product.price <= maxPrice);
    renderProducts();
}

// ================= INITIALIZE PRICE FILTER =================
function initializePriceFilter() {
    const minPriceInput = document.querySelector('.price-input:first-of-type');
    const maxPriceInput = document.querySelector('.price-input:last-of-type');
    minPriceInput.value = "42.69";
    maxPriceInput.value = "137.00";
}

initializePriceFilter();

// ================= CLOSE DROPDOWN =================
document.addEventListener('click', (e) => {
    if (!sortSelect.contains(e.target)) sortDrop.classList.add('hidden');
});

// ================= INITIAL FETCH =================
fetchProducts();
