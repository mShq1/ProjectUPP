from django.urls import path
from .views import (
    # Товары
    ProductListView,
    ProductDetailView,
    # Корзина
    CartView,
    AddToCartView,
    RemoveFromCartView,
    ClearCartView,
    # Заказы
    CreateOrderView,
    OrderListView,
    OrderDetailView,
)

urlpatterns = [
    # Товары
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),

    # Корзина
    path('cart/', CartView.as_view(), name='cart-detail'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/remove/', RemoveFromCartView.as_view(), name='cart-remove'),
    path('cart/clear/', ClearCartView.as_view(), name='cart-clear'),

    # Заказы
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('orders/create/', CreateOrderView.as_view(), name='order-create'),
]



# Как это работает:
# Продукты
# /products/ — GET список всех товаров
# /products/{id}/ — GET конкретный товар

# Корзина
# /cart/ — GET корзина текущего пользователя
# /cart/add/ — POST добавить товар
# /cart/remove/ — POST удалить товар
# /cart/clear/ — POST очистить корзину

# Заказы
# /orders/ — GET список заказов пользователя
# /orders/{id}/ — GET детали заказа
# /orders/create/ — POST оформить заказ из корзины

