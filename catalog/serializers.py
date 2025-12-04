from rest_framework import serializers
from .models import Product, CartItem, Order, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'category', 'category_name', 'images']

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'

class OrderItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)
    items_data = OrderItemWriteSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'completed', 'cart_items', 'items_data']

    def create(self, validated_data):
        items_data = validated_data.pop('items_data')
        order = Order.objects.create(**validated_data)

        for item in items_data:
            CartItem.objects.create(order=order, **item)

        return order
