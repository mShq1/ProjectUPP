from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from catalog.views import ProductViewSet, CartItemViewSet, OrderViewSet
from django.http import HttpResponse

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'cart', CartItemViewSet)
router.register(r'orders', OrderViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('', lambda request: HttpResponse("Welcome to ProjectUPP!")),
]
