from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children"
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="products"
    )
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)

    PRODUCT_TYPE_CHOICES = (
        ('clothing', 'Clothing'),
        ('shoes', 'Shoes'),
    )
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, default='clothing')

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"

    def __str__(self):
        return self.name
    


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="product_images/")

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="variants"
    )
    size = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.product.name} — {self.size or ''} {self.color or ''}"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart")

    def __str__(self):
        return f"Cart of {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
