from django.contrib import admin
from .models import Product, Category, CartItem, ProductImage, ProductVariant

# Inline для вариантов товара
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 0  # не создавать пустые строки автоматически

# Inline для изображений товара (если хочешь редактировать сразу несколько)
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0

# Настройка админки для Product
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductVariantInline, ProductImageInline]
    list_display = ('name', 'category', 'price', 'is_available')
    list_filter = ('category', 'is_available')
    search_fields = ('name', 'description')

# Настройка админки для Category
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')
    search_fields = ('name',)

# Остальные модели просто регистрируем
admin.site.register(CartItem)