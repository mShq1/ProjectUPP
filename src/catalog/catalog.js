// ЗАПРОС К API
async function fetchProducts() {
    try {
        console.log('Fetching products from API...');
        const response = await fetch('http://localhost:8000/api/products/');
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API response:', data);
        
        products = Array.isArray(data) ? data : [];
        console.log(`Loaded ${products.length} products`);

        renderProducts();
    } catch (error) {
        console.error('Fetch error:', error);
        showErrorMessage('Failed to load products. Please try again later.');
    }
}

function showErrorMessage(message) {
    const grid = document.getElementById("products-grid");
    if (grid) {
        grid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                <h3>${message}</h3>
                <button onclick="fetchProducts()" style="margin-top: 20px; padding: 10px 20px; background: #007ACC; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// SELECTORS 
const grid = document.getElementById("products-grid");
const sortSelect = document.querySelector(".sort-select");
const sortDrop = document.querySelector(".sort-dropdown");
const sortValue = document.getElementById("sort-value");
let products = [];
let currentCategory = null;

// РЕНДЕРИНГ ПРОДУКТОВ
function renderProducts() {
    renderFilteredProducts(products);
}

function renderFilteredProducts(productsToRender) {
    console.log('Rendering products:', productsToRender);
    
    if (!grid) {
        console.error('Products grid element not found!');
        return;
    }

    grid.innerHTML = "";

    if (productsToRender.length === 0) {
        const message = currentCategory 
            ? `No products found in ${currentCategory} category`
            : 'No products found';
        
        grid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">
                <h3>${message}</h3>
                <p>Try adjusting your filters or check back later.</p>
            </div>
        `;
        return;
    }

    // Используем createElement для лучшей производительности
    productsToRender.forEach(product => {
        const productName = product.name || 'Unnamed Product';
        const productPrice = parseFloat(product.price) || 0;
        
        // Безопасное получение изображения - используем image_url вместо image
        let imageUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dy='.3em' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
        
        if (product.images && product.images.length > 0) {
            // Пробуем получить image_url, если нет - используем image
            const firstImage = product.images[0];
            imageUrl = firstImage.image_url || firstImage.image || imageUrl;
        }

        console.log(`Product: ${productName}, Image URL: ${imageUrl}`);

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${imageUrl}" alt="${productName}" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27300%27 height=%27300%27 viewBox=%270 0 300 300%27%3E%3Crect width=%27300%27 height=%27300%27 fill=%27%23f8f8f8%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 font-size=%2714%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%23999%27%3EImage Error%3C/text%3E%3C/svg%3E'"
                 style="width: 300px; height: 300px; border-radius: 25px; opacity: 1; object-fit: contain; background: #f8f8f8; padding: 10px; display: block; margin: 0 auto;">
            <div class="product-title">${productName}</div>
            <div class="product-price">$${productPrice.toFixed(2)}</div>
        `;
        
        // Добавляем обработчик клика для перехода на страницу товара
        productCard.addEventListener('click', () => {
            openProductDetail(product.id);
        });
        
        // Добавляем курсор pointer чтобы показать что карточка кликабельна
        productCard.style.cursor = 'pointer';
        
        grid.appendChild(productCard);
    });
}

// ПЕРЕХОД НА СТРАНИЦУ ТОВАРА
function openProductDetail(productId) {
    console.log('Opening product detail for ID:', productId);
    
    // Переход на страницу деталей товара
    window.location.href = `../product-detail/product-detail.html?id=${productId}`;
}

// ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
function filterProductsByCategory(categoryName) {
    currentCategory = categoryName;
    
    if (!categoryName) {
        // Если категория не выбрана, показываем все товары
        renderProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => {
        return product.category_name === categoryName;
    });
    
    console.log(`Filtered products for ${categoryName}:`, filteredProducts);
    renderFilteredProducts(filteredProducts);
}

// ИНИЦИАЛИЗАЦИЯ 
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing catalog...');
    fetchProducts();
    initializeFilters();
    initializePriceFilter();
    initializeMobileFilters();
});

// МОБИЛЬНЫЕ ФИЛЬТРЫ
function initializeMobileFilters() {
    const filtersToggleBtn = document.getElementById('filters-toggle-btn');
    const filters = document.getElementById('filters');
    const filtersCloseBtn = document.getElementById('filters-close-btn');
    
    if (filtersToggleBtn && filters) {
        filtersToggleBtn.addEventListener('click', function() {
            filters.classList.add('active');
            filtersToggleBtn.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
        
        if (filtersCloseBtn) {
            filtersCloseBtn.addEventListener('click', function() {
                filters.classList.remove('active');
                filtersToggleBtn.classList.remove('active');
                document.body.style.overflow = ''; 
            });
        }
        
        filters.addEventListener('click', function(e) {
            if (e.target === filters) {
                filters.classList.remove('active');
                filtersToggleBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ФИЛЬТРЫ И СОРТИРОВКА 
function initializeFilters() {
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
            if (arrow) arrow.style.transform = 'rotate(-90deg)';
        }
    });

    document.querySelectorAll(".cat-pill").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".cat-pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const categoryName = btn.textContent.trim();
            console.log('Category selected:', categoryName);
            filterProductsByCategory(categoryName);
        });
    });

    document.querySelectorAll(".tag").forEach(tag => {
        tag.addEventListener("click", () => {
            tag.classList.toggle("active");
            console.log('Filter toggled:', tag.textContent);
        });
    });

    document.querySelectorAll(".size-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
            console.log('Size toggled:', btn.textContent);
        });
    });

    document.querySelectorAll(".color-dot").forEach(dot => {
        dot.addEventListener("click", () => {
            document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
            dot.classList.add("active");
            console.log('Color selected');
        });
    });

    if (sortSelect) {
        sortSelect.addEventListener("click", (e) => {
            e.stopPropagation();
            sortDrop.classList.toggle("hidden");
        });

        document.querySelectorAll(".sort-option").forEach(option => {
            option.addEventListener("click", () => {
                document.querySelectorAll(".sort-option").forEach(o => o.classList.remove("active"));
                option.classList.add("active");
                
                if (sortValue) {
                    sortValue.textContent = option.textContent;
                }
                
                sortDrop.classList.add("hidden");

                const sortType = option.textContent;
                let productsToSort = currentCategory 
                    ? products.filter(p => p.category_name === currentCategory)
                    : [...products];
                
                switch(sortType) {
                    case "Lowest Price":
                        productsToSort.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
                        break;
                    case "Highest Price":
                        productsToSort.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
                        break;
                    case "Newest":
                    default:
                        break;
                }
                
                renderFilteredProducts(productsToSort);
            });
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (sortDrop) sortDrop.classList.add("hidden");
    });
}

// ФИЛЬТРАЦИЯ ПО ЦЕНЕ 
function initializePriceFilter() {
    document.querySelectorAll('.price-input').forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 1 && this.value[0] === '0' && this.value[1] !== '.') {
                this.value = this.value.slice(1);
            }
            
            const maxPrice = 10000;
            if (parseFloat(this.value) > maxPrice) {
                this.value = maxPrice;
            }
            
            updatePriceFilter();
        });
        
        input.addEventListener('focus', function() {
            this.select();
        });
        
        input.addEventListener('blur', function() {
            if (this.value && !isNaN(this.value)) {
                this.value = parseFloat(this.value).toFixed(2);
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (!/[\d\.]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|ArrowUp|ArrowDown/.test(e.key)) {
                e.preventDefault();
            }
            if (e.key === '.' && this.value.includes('.')) {
                e.preventDefault();
            }
        });
    });

    const minPriceInput = document.querySelector('.price-input:first-of-type');
    const maxPriceInput = document.querySelector('.price-input:last-of-type');
    if (minPriceInput && maxPriceInput) {
        minPriceInput.value = "42.69";
        maxPriceInput.value = "137.00";
    }
}

function updatePriceFilter() {
    const minPriceInput = document.querySelector('.price-input:first-of-type');
    const maxPriceInput = document.querySelector('.price-input:last-of-type');
    
    if (!minPriceInput || !maxPriceInput) return;
    
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    
    if (minPrice > maxPrice) {
        minPriceInput.style.borderColor = '#ff4444';
        maxPriceInput.style.borderColor = '#ff4444';
    } else {
        minPriceInput.style.borderColor = '';
        maxPriceInput.style.borderColor = '';
        
        console.log('Filtering by price:', minPrice, '-', maxPrice);
    }
}