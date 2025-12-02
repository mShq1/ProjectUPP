import json
from django.core.management.base import BaseCommand
from catalog.models import Category, Product

class Command(BaseCommand):
    help = 'Import products and categories from JSON'

    def handle(self, *args, **kwargs):
        with open('initial_data.json', encoding='utf-8') as f:
            data = json.load(f)

        for item in data:
            category = Category.objects.get(id=item['category'])
            Product.objects.update_or_create(
                id=item['id'],
                defaults={
                    'name': item['name'],
                    'price': item['price'],
                    'category': category
                }
            )
        self.stdout.write(self.style.SUCCESS('JSON imported successfully'))
