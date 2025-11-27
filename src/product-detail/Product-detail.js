const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
let currentProduct = null;

// ================= ЗАГРУЗКА ТОВАРА =================
async function loadProduct() {
    const res = await fetch(`http://localhost:8000/api/products/${productId}/`);
    const product = await res.json();

    currentProduct = product;

    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent =
        `$${parseFloat(product.price).toFixed(2)}`;

    if (product.images && product.images.length > 0) {
        const mainImg = document.getElementById('main-product-image');
        const url = product.images[0].image_url || product.images[0].image;
        mainImg.src = url;

        const thumbs = document.getElementById('thumbs');
        thumbs.innerHTML = "";

        product.images.forEach((img, index) => {
            const t = document.createElement('img');
            t.src = img.image_url || img.image;

            if (index === 0) t.classList.add('active');

            t.onclick = () => {
                document.querySelectorAll('.thumbs img').forEach(i => i.classList.remove('active'));
                t.classList.add('active');
                mainImg.src = t.src;
            };

            thumbs.appendChild(t);
        });
    }
}

// ================= РЕКОМЕНДАЦИИ =================
async function loadRecommended() {
    const res = await fetch('http://localhost:8000/api/products/');
    const products = await res.json();

    const grid = document.getElementById('recommended-grid');
    grid.innerHTML = "";

    products
        .filter(p => p.id != productId)
        .slice(0, 5)
        .forEach(p => {
            const card = document.createElement('div');
            card.className = 'rec-card';

            card.innerHTML = `
                <img src="${p.images?.[0]?.image_url || ''}">
                <div>${p.name}</div>
                <strong>$${parseFloat(p.price).toFixed(2)}</strong>
            `;

            card.onclick = () => {
                window.location.href = `product-detail.html?id=${p.id}`;
            };

            grid.appendChild(card);
        });
}

// ================= АКТИВАЦИЯ КНОПОК =================
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
});

document.querySelectorAll('.fit-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.fit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    };
});

document.querySelectorAll('.color-dot').forEach(dot => {
    dot.onclick = () => {
        document.querySelectorAll('.color-dot').forEach(c => c.classList.remove('active'));
        dot.classList.add('active');
    };
});


// ================= ДОБАВЛЕНИЕ В КОРЗИНУ =================
document.querySelector('.add-to-cart').onclick = () => {
    if (!currentProduct) return;

    const size = document.querySelector('.size-btn.active')?.textContent || null;
    const color = document.querySelector('.color-dot.active')?.classList[1] || null;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
        id: currentProduct.id,
        title: currentProduct.name,
        price: parseFloat(currentProduct.price),
        img: currentProduct.images?.[0]?.image_url || '',
        size: size,
        color: color
    };

    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Товар добавлен в корзину ✅");
};



loadProduct();
loadRecommended();
