from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from catalog.views import ProductViewSet, CartItemViewSet  # убрали OrderViewSet

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart-items', CartItemViewSet, basename='cart-item')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
