from django.contrib import admin
from .models import Product, CartItem, Order


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "available")
    list_filter = ("available",)
    search_fields = ("name", "description")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "quantity")
    list_filter = ("user",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "completed")
    list_filter = ("completed", "created_at")
    search_fields = ("user__username",)
