document.addEventListener("DOMContentLoaded", () => {
  // Переключение типа доставки (Ship To Address / Ship To Access Point)
  const shippingTypeOptions = document.querySelectorAll('.shipping-type__option');
  
  function updateShippingDisplay(type) {
    if (type === 'address') {
      document.querySelector('.shipping-address-fields').style.display = 'block';
      document.querySelector('.shipping-access-point').style.display = 'none';
    } else {
      document.querySelector('.shipping-address-fields').style.display = 'none';
      document.querySelector('.shipping-access-point').style.display = 'block';
    }
  }
  
  shippingTypeOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Убираем активный класс у всех опций
      shippingTypeOptions.forEach(opt => opt.classList.remove('shipping-type__option--active'));
      
      // Добавляем активный класс к выбранной опции
      this.classList.add('shipping-type__option--active');
      
      const type = this.getAttribute('data-type');
      updateShippingDisplay(type);
    });
  });
  
  // Выбор способа доставки
  const shippingOptions = document.querySelectorAll('.shipping-option');
  
  shippingOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Убираем активный класс у всех опций в той же группе
      const group = this.closest('.shipping-methods');
      group.querySelectorAll('.shipping-option').forEach(opt => {
        opt.classList.remove('shipping-option--active');
      });
      
      // Добавляем активный класс к выбранной опции
      this.classList.add('shipping-option--active');
      
      // Отмечаем радио-кнопку
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
      
      // Обновляем итоговую сумму при изменении способа доставки
      updateOrderSummary();
    });
  });

  // Переключение способов оплаты
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const paymentCard = document.querySelector('.payment-card');
  const paypalPayment = document.getElementById('paypal-payment');
  const alternativePayment = document.getElementById('alternative-payment');
  
  function updatePaymentDisplay(method) {
    // Скрываем все способы оплаты
    paymentCard.style.display = 'none';
    if (paypalPayment) paypalPayment.style.display = 'none';
    if (alternativePayment) alternativePayment.style.display = 'none';
    
    // Показываем выбранный способ оплаты
    if (method === 'credit-card') {
      paymentCard.style.display = 'block';
    } else if (method === 'paypal' && paypalPayment) {
      paypalPayment.style.display = 'block';
    } else if (method === 'alternative' && alternativePayment) {
      alternativePayment.style.display = 'block';
    }
  }
  
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Убираем активный класс у всех вкладок
      paymentTabs.forEach(t => t.classList.remove('payment-tab--active'));
      
      // Добавляем активный класс к выбранной вкладке
      this.classList.add('payment-tab--active');
      
      const method = this.getAttribute('data-method');
      updatePaymentDisplay(method);
    });
  });

  // Загрузка случайного товара для Perfect addition
  function loadRandomProduct() {
    // TODO: Заменить на реальные данные из каталога
    // Сейчас используем заглушки с примерными товарами
    const randomProducts = [
      {
        name: "Crop Hike Crew Socks",
        color: "Charcoal",
        size: "L",
        price: 17.00,
        image: "../catalog/test-product.jpg"
      },
      {
        name: "Urban Street Hoodie",
        color: "Black",
        size: "M",
        price: 45.00,
        image: "../catalog/hoodie.jpg"
      },
      {
        name: "Classic White Sneakers",
        color: "White",
        size: "9",
        price: 89.00,
        image: "../catalog/sneakers.jpg"
      },
      {
        name: "Vintage Denim Jacket",
        color: "Blue",
        size: "L",
        price: 75.00,
        image: "../catalog/jacket.jpg"
      },
      {
        name: "Sport Running Shorts",
        color: "Navy",
        size: "M",
        price: 32.00,
        image: "../catalog/shorts.jpg"
      }
    ];
    
    // Выбираем случайный товар
    const randomProduct = randomProducts[Math.floor(Math.random() * randomProducts.length)];
    
    // Обновляем блок Perfect addition
    const addonCard = document.querySelector('.addon-card');
    if (addonCard) {
      addonCard.innerHTML = `
        <img src="${randomProduct.image}" class="addon-card__img" alt="${randomProduct.name}">
        <div class="addon-card__info">
          <div class="addon-card__title">${randomProduct.name}</div>
          <div class="addon-card__meta">Color: ${randomProduct.color}<br>Size: ${randomProduct.size}</div>
          <div class="addon-card__price">$${randomProduct.price.toFixed(2)}</div>
        </div>
      `;
    }
  }

  // Загрузка корзины пользователя
  function loadCart() {
    // TODO: Заменить на реальные данные из корзины пользователя
    // Сейчас используем заглушки
    const cartItems = [
      {
        name: "Men's PFG Pro Sport Boot",
        color: "Grey Ice",
        size: "8",
        quantity: 1,
        price: 137.00,
        image: "../catalog/test-product.jpg"
      }
      // Можно добавить больше товаров, когда будет готова логика корзины
    ];
    
    const cartContainer = document.querySelector('.your-cart');
    if (!cartContainer) return;
    
    // Очищаем контейнер корзины (кроме заголовка)
    const existingCartCards = cartContainer.querySelectorAll('.cart-card');
    existingCartCards.forEach(card => card.remove());
    
    // Добавляем товары из корзины
    cartItems.forEach(item => {
      const cartCard = document.createElement('article');
      cartCard.className = 'cart-card';
      cartCard.innerHTML = `
        <img src="${item.image}" class="cart-card__img" alt="${item.name}">
        <div class="cart-card__info">
          <div class="cart-card__title">${item.name}</div>
          <div class="cart-card__meta">
            Color: ${item.color}<br>Size: ${item.size}, Qty: ${item.quantity}
          </div>
          <div class="cart-card__price">$${item.price.toFixed(2)}</div>
        </div>
      `;
      cartContainer.appendChild(cartCard);
    });
    
    // TODO: Здесь можно добавить логику для пустой корзины
    if (cartItems.length === 0) {
      const emptyCart = document.createElement('div');
      emptyCart.className = 'empty-cart';
      emptyCart.innerHTML = '<p>Your cart is empty</p>';
      cartContainer.appendChild(emptyCart);
    }
  }

  // Расчет итоговой суммы в Order Summary
  function updateOrderSummary() {
    // TODO: Заменить на реальные данные из корзины
    // Сейчас используем заглушки
    const subtotal = 150.00; // Эта сумма должна подгружаться из корзины
    const discount = 13.00; // Эта сумма должна подгружаться из скидок
    
    // Получаем выбранную доставку
    const selectedShipping = document.querySelector('.shipping-option--active');
    let shippingCost = 0;
    let shippingText = 'Free';
    
    if (selectedShipping) {
      const priceElement = selectedShipping.querySelector('.shipping-option__price');
      if (priceElement) {
        const priceText = priceElement.textContent.trim();
        if (priceText === 'Free') {
          shippingCost = 0;
          shippingText = 'Free';
        } else {
          shippingCost = parseFloat(priceText.replace('$', '')) || 0;
          shippingText = `$${shippingCost.toFixed(2)}`;
        }
      }
    }
    
    // Рассчитываем итоговую сумму
    const total = subtotal - discount + shippingCost;
    
    // Обновляем отображение
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `- $${discount.toFixed(2)}`;
    document.getElementById('shipping').textContent = shippingText;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  }
  
  // Инициализация при загрузке страницы
  updateShippingDisplay('address');
  updatePaymentDisplay('credit-card');
  loadRandomProduct();
  loadCart();
  updateOrderSummary();
});
// TODO: Заменить эту часть на реальные данные
// Пример как это может выглядеть:
// const cartData = getCartData(); // Функция для получения данных корзины
// const subtotal = cartData.totalPrice;
// const discount = cartData.discount;
//Заменить заглушечные данные на реальные API вызовы

//Добавить обработку пустой корзины

//Реализовать добавление товаров из Perfect addition в корзину

