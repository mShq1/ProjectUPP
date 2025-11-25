// ================= MOCK PRODUCTS =================
const mockProducts = [
    { id: 1, title: "Men's PFG Pro Sport Boot", price: 137, img: "../catalog/test-product.jpg" },
    { id: 2, title: "Women's Arson II Jacket", price: 137, img: "../catalog/test-product.jpg" },
    { id: 3, title: "Trail Runner Shoes", price: 120, img: "../catalog/test-product.jpg" },
    { id: 4, title: "Winter Long Down Jacket", price: 300, img: "../catalog/test-product.jpg" },
    { id: 5, title: "Grey Ice Sneakers", price: 89, img: "../catalog/test-product.jpg" }
];

let products = [...mockProducts];

// ================= SELECTORS =================
const grid = document.getElementById("products-grid");
const sortSelect = document.querySelector(".sort-select");
const sortDrop = document.querySelector(".sort-dropdown");
const sortValue = document.getElementById("sort-value");

// ================= RENDER PRODUCTS =================
function renderProducts() {
    grid.innerHTML = "";

    products.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.img}">
                <div class="product-title">${p.title}</div>
                <div class="product-price">$${p.price}</div>
            </div>
        `;
    });
}

renderProducts();

// ================= FILTER TOGGLE FUNCTIONALITY =================
document.querySelectorAll('.filter-header').forEach(header => {
    header.addEventListener('click', () => {
        const filterBox = header.closest('.filter-box');
        filterBox.classList.toggle('collapsed');
        
        const arrow = header.querySelector('img');
        if (filterBox.classList.contains('collapsed')) {
            arrow.style.transform = 'rotate(-90deg)';
        } else {
            arrow.style.transform = 'rotate(0deg)';
        }
    });
});

// Initialize all filters as collapsed except first one
document.querySelectorAll('.filter-box').forEach((box, index) => {
    if (index !== 0) { // Keep first filter expanded, collapse others
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
        document.querySelectorAll(".sort-option")
            .forEach(o => o.classList.remove("active"));

        option.classList.add("active");
        sortValue.textContent = option.textContent;
        sortDrop.classList.add("hidden");

        // === Sorting Logic ===
        if (option.textContent === "Newest") {
            products = [...mockProducts];
        }
        else if (option.textContent === "Lowest Price") {
            products.sort((a, b) => a.price - b.price);
        }
        else if (option.textContent === "Highest Price") {
            products.sort((a, b) => b.price - a.price);
        }
        else {
            // Best Sellers / Featured / Top Rated
            products = [...mockProducts]; // временно
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
    dot.addEventListener("click", () => {
        dot.classList.toggle("active");
    });
});

// ================= PRICE INPUT FUNCTIONALITY =================
document.querySelectorAll('.price-input').forEach(input => {
    // Обработка ввода
    input.addEventListener('input', function() {
        // Убираем лишние нули в начале
        if (this.value.length > 1 && this.value[0] === '0' && this.value[1] !== '.') {
            this.value = this.value.slice(1);
        }
        
        // Ограничиваем максимальное значение
        const maxPrice = 10000;
        if (parseFloat(this.value) > maxPrice) {
            this.value = maxPrice;
        }
        
        updatePriceFilter();
    });
    
    // При фокусе выделяем весь текст
    input.addEventListener('focus', function() {
        this.select();
    });
    
    // При потере фокуса форматируем значение
    input.addEventListener('blur', function() {
        if (this.value && !isNaN(this.value)) {
            const value = parseFloat(this.value);
            this.value = value.toFixed(2);
        }
    });
    
    // Запрещаем ввод букв и специальных символов
    input.addEventListener('keydown', function(e) {
        // Разрешаем: цифры, backspace, delete, tab, стрелки, точка
        if (!/[\d\.]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(e.key)) {
            e.preventDefault();
        }
        
        // Запрещаем множественные точки
        if (e.key === '.' && this.value.includes('.')) {
            e.preventDefault();
        }
    });
});

function updatePriceFilter() {
    const minPriceInput = document.querySelector('.price-input:first-of-type');
    const maxPriceInput = document.querySelector('.price-input:last-of-type');
    
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    
    // Валидация: мин цена не может быть больше макс цены
    if (minPrice > maxPrice) {
        minPriceInput.style.borderColor = '#ff4444';
        maxPriceInput.style.borderColor = '#ff4444';
    } else {
        minPriceInput.style.borderColor = '';
        maxPriceInput.style.borderColor = '';
        
        // Здесь можно добавить фильтрацию товаров по цене
        console.log('Price range:', minPrice, '-', maxPrice);
        filterProductsByPrice(minPrice, maxPrice);
    }
}

function filterProductsByPrice(minPrice, maxPrice) {
    const filteredProducts = mockProducts.filter(product => {
        return product.price >= minPrice && product.price <= maxPrice;
    });
    
    // Обновляем отображение товаров
    products = filteredProducts.length > 0 ? filteredProducts : mockProducts;
    renderProducts();
}

// Инициализация цен при загрузке
function initializePriceFilter() {
    const minPriceInput = document.querySelector('.price-input:first-of-type');
    const maxPriceInput = document.querySelector('.price-input:last-of-type');
    
    // Устанавливаем начальные значения
    minPriceInput.value = "42.69";
    maxPriceInput.value = "137.00";
}

// Вызываем инициализацию при загрузке
initializePriceFilter();

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!sortSelect.contains(e.target)) {
        sortDrop.classList.add('hidden');
    }
});