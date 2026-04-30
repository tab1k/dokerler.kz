from django.core.management.base import BaseCommand
from products.models import Category, Product
from django.utils.text import slugify

class Command(BaseCommand):
    help = 'Seeds the database with initial products'

    def handle(self, *args, **kwargs):
        category, created = Category.objects.get_or_create(
            slug='mufty',
            defaults={
                'name': 'Муфты', 
                'sort_order': 1,
                'description': 'Электросварные муфты PE100 для соединения труб.'
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created category "Муфты"'))

        products_data = [
            {'name': 'Муфта электросварная 32 мм', 'sku': 'M-EF-032', 'diameter': 32, 'price': 1200},
            {'name': 'Муфта электросварная 63 мм', 'sku': 'M-EF-063', 'diameter': 63, 'price': 2500},
            {'name': 'Муфта электросварная 110 мм', 'sku': 'M-EF-110', 'diameter': 110, 'price': 5800},
            {'name': 'Муфта электросварная 160 мм', 'sku': 'M-EF-160', 'diameter': 160, 'price': 12400},
            {'name': 'Муфта электросварная 225 мм', 'sku': 'M-EF-225', 'diameter': 225, 'price': 28500},
            {'name': 'Муфта электросварная 315 мм', 'sku': 'M-EF-315', 'diameter': 315, 'price': 64000},
        ]

        for p_data in products_data:
            product, p_created = Product.objects.get_or_create(
                sku=p_data['sku'],
                defaults={
                    'category': category,
                    'name': p_data['name'],
                    'slug': p_data['sku'].lower(),
                    'diameter_mm': p_data['diameter'],
                    'sdr': 'SDR 11',
                    'pressure_rating': 'PN 16',
                    'material': 'PE 100-RC',
                    'stock_status': 'in_stock',
                    'price': p_data['price'],
                }
            )
            if p_created:
                self.stdout.write(self.style.SUCCESS(f'Created product "{product.name}"'))
            else:
                self.stdout.write(f'Product "{product.name}" already exists.')
