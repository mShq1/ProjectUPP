from django.core.management.base import BaseCommand
from catalog.models import ProductImage

class Command(BaseCommand):
    help = 'Fix product image paths by removing duplicate folder'

    def handle(self, *args, **kwargs):
        for img in ProductImage.objects.all():
            if img.image.name.startswith('product_images/product_images/'):
                old_name = img.image.name
                img.image.name = img.image.name.replace('product_images/product_images/', 'product_images/')
                img.save()
                self.stdout.write(self.style.SUCCESS(f'Fixed: {old_name} -> {img.image.name}'))

        self.stdout.write(self.style.SUCCESS('All image paths fixed!'))
