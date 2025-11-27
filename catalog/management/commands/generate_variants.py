from django.core.management.base import BaseCommand
from catalog.models import Product, ProductVariant

class Command(BaseCommand):
    help = 'Generate all combinations of sizes and colors for products, considering product type'

    def handle(self, *args, **kwargs):
        # Определяем размеры по типу продукта
        sizes_by_type = {
            'clothing': ['S', 'M', 'L', 'XL'],
            'shoes': ['5', '6', '6.5', '7', '8', '10', '13.5'],
        }

        # Общий список цветов (можно расширить или сделать индивидуально)
        colors = ['Black', 'White', 'Red', 'Purple', 'Gray']

        products = Product.objects.all()  # для всех товаров

        for product in products:
            # Получаем размеры для типа продукта
            product_type = getattr(product, 'product_type', 'clothing')  # по умолчанию clothing
            sizes = sizes_by_type.get(product_type, ['S', 'M', 'L', 'XL'])

            for size in sizes:
                for color in colors:
                    # Создаем вариант только если его еще нет
                    variant, created = ProductVariant.objects.get_or_create(
                        product=product,
                        size=size,
                        color=color
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Created variant {variant}'))
                    else:
                        self.stdout.write(f'Variant already exists: {variant}')

        self.stdout.write(self.style.SUCCESS('All combinations generated!'))