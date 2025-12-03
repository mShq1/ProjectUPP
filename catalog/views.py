from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
#from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import Product, CartItem, Order
from .serializers import ProductSerializer, CartItemSerializer, OrderSerializer


# Моковый пользователь (временно)
def get_default_user():
    user, _ = User.objects.get_or_create(username="guest")
    return user

# =====================
#       ПРОДУКТЫ
# =====================
class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

# =====================
#       КОРЗИНА
# =====================
class CartView(APIView):
    def get(self, request):
        items = CartItem.objects.filter(user=get_default_user(), order=None)
        serializer = CartItemSerializer(items, many=True)
        return Response(serializer.data)

class AddToCartView(APIView):
    def post(self, request):
        product_id = request.data.get("product")
        quantity = int(request.data.get("quantity", 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

        item, created = CartItem.objects.get_or_create(
            user=get_default_user(),
            product=product,
            order=None,
            defaults={"quantity": quantity}
        )

        if not created:
            item.quantity += quantity
            item.save()

        return Response({"message": "Added to cart"})

class RemoveFromCartView(APIView):
    def post(self, request):
        product_id = request.data.get("product")
        CartItem.objects.filter(
            user=get_default_user(),
            product_id=product_id,
            order=None
        ).delete()
        return Response({"message": "Removed"})

class ClearCartView(APIView):
    def post(self, request):
        CartItem.objects.filter(user=get_default_user(), order=None).delete()
        return Response({"message": "Cart cleared"})

# =====================
#        ЗАКАЗЫ
# =====================
class CreateOrderView(APIView):
    def post(self, request):
        user = get_default_user()
        items = CartItem.objects.filter(user=user, order=None)

        if not items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        order = Order.objects.create(user=user)
        items.update(order=order)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=get_default_user())

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=get_default_user())
