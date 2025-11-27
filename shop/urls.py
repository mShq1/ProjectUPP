from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf import settings  # ← ДОБАВЬТЕ ЭТОТ ИМПОРТ
from django.conf.urls.static import static  # ← ДОБАВЬТЕ ЭТОТ ИМПОРТ
from catalog.views import CategoryViewSet, ProductViewSet, ProductVariantViewSet, CartViewSet, CartItemViewSet

router = routers.DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'variants', ProductVariantViewSet, basename='variant')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cart-item')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)