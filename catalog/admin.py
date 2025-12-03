from django.contrib import admin
from .models import Product, Category, CartItem, ProductVariant, ProductImage, Order


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductVariantInline, ProductImageInline]
    list_display = ('name', 'category', 'price')
    search_fields = ('name',)


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ('product', 'size', 'color', 'price')
    list_filter = ('size', 'color')


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)


admin.site.register(CartItem)
admin.site.register(ProductImage)
admin.site.register(Order)
