from django.db import migrations


def seed_catalog(apps, schema_editor):
    Category = apps.get_model('base', 'Category')
    Product = apps.get_model('base', 'Product')

    categories = [
        {
            'name': 'Муфты',
            'slug': 'mufty',
            'description': 'Соединительные электросварные муфты PE 100 для ПЭ труб.',
            'sort_order': 10,
        },
        {
            'name': 'Отводы',
            'slug': 'otvody',
            'description': 'Электросварные отводы 45 и 90 градусов для изменения направления трубопровода.',
            'sort_order': 20,
        },
        {
            'name': 'Тройники',
            'slug': 'troyniki',
            'description': 'Равнопроходные и переходные тройники для ответвлений ПЭ трубопровода.',
            'sort_order': 30,
        },
        {
            'name': 'Редукции',
            'slug': 'redukcii',
            'description': 'Переходы и редукции для соединения труб разных диаметров.',
            'sort_order': 40,
        },
        {
            'name': 'Седёлки',
            'slug': 'sedelki',
            'description': 'Электросварные седёлки для врезки ответвлений в ПЭ трубопровод.',
            'sort_order': 50,
        },
        {
            'name': 'Заглушки',
            'slug': 'zaglushki',
            'description': 'Электросварные заглушки для перекрытия концов трубопровода.',
            'sort_order': 60,
        },
    ]

    category_map = {}
    for category in categories:
        category_obj, _ = Category.objects.update_or_create(
            slug=category['slug'],
            defaults=category,
        )
        category_map[category['slug']] = category_obj

    products = [
        {
            'category': 'mufty',
            'name': 'Муфта электросварная DN 63 PE 100 SDR 11',
            'slug': 'mufta-elektrosvarnaya-dn-63-pe-100-sdr-11',
            'sku': 'EF-M-063-11',
            'description': 'Соединительная муфта со встроенной нагревательной спиралью.',
            'diameter_mm': 63,
            'length_mm': 92,
            'welding_voltage_v': 40,
            'welding_time_sec': 70,
            'cooling_time_min': 10,
            'price': '6450.00',
            'stock_quantity': 24,
            'is_popular': True,
            'sort_order': 10,
        },
        {
            'category': 'mufty',
            'name': 'Муфта электросварная DN 110 PE 100 SDR 11',
            'slug': 'mufta-elektrosvarnaya-dn-110-pe-100-sdr-11',
            'sku': 'EF-M-110-11',
            'description': 'Муфта для надежного соединения ПЭ труб в напорных системах.',
            'diameter_mm': 110,
            'length_mm': 138,
            'welding_voltage_v': 40,
            'welding_time_sec': 105,
            'cooling_time_min': 15,
            'price': '13900.00',
            'stock_quantity': 18,
            'is_popular': True,
            'sort_order': 20,
        },
        {
            'category': 'mufty',
            'name': 'Муфта электросварная DN 160 PE 100 SDR 17',
            'slug': 'mufta-elektrosvarnaya-dn-160-pe-100-sdr-17',
            'sku': 'EF-M-160-17',
            'description': 'Муфта SDR 17 для трубопроводов с рабочим давлением PN 10.',
            'sdr': 'SDR 17',
            'pressure_rating': 'PN 10',
            'diameter_mm': 160,
            'length_mm': 170,
            'welding_voltage_v': 40,
            'welding_time_sec': 150,
            'cooling_time_min': 20,
            'price': '28500.00',
            'stock_status': 'preorder',
            'stock_quantity': 0,
            'lead_time_days': 14,
            'sort_order': 30,
        },
        {
            'category': 'otvody',
            'name': 'Отвод электросварный 90° DN 110 PE 100 SDR 11',
            'slug': 'otvod-elektrosvarnyy-90-dn-110-pe-100-sdr-11',
            'sku': 'EF-O-110-90',
            'description': 'Отвод 90 градусов для изменения направления ПЭ трубопровода.',
            'diameter_mm': 110,
            'angle_degree': '90.0',
            'length_mm': 210,
            'welding_voltage_v': 40,
            'welding_time_sec': 120,
            'cooling_time_min': 15,
            'price': '22400.00',
            'stock_quantity': 9,
            'is_popular': True,
            'sort_order': 40,
        },
        {
            'category': 'otvody',
            'name': 'Отвод электросварный 45° DN 160 PE 100 SDR 11',
            'slug': 'otvod-elektrosvarnyy-45-dn-160-pe-100-sdr-11',
            'sku': 'EF-O-160-45',
            'description': 'Отвод 45 градусов для плавного поворота трубопровода.',
            'diameter_mm': 160,
            'angle_degree': '45.0',
            'length_mm': 250,
            'welding_voltage_v': 40,
            'welding_time_sec': 170,
            'cooling_time_min': 20,
            'price': '39800.00',
            'stock_status': 'preorder',
            'stock_quantity': 0,
            'lead_time_days': 14,
            'sort_order': 50,
        },
        {
            'category': 'troyniki',
            'name': 'Тройник электросварный DN 110 PE 100 SDR 11',
            'slug': 'troynik-elektrosvarnyy-dn-110-pe-100-sdr-11',
            'sku': 'EF-T-110-11',
            'description': 'Равнопроходной тройник для ответвления напорного ПЭ трубопровода.',
            'diameter_mm': 110,
            'outlet_diameter_mm': 110,
            'length_mm': 310,
            'welding_voltage_v': 40,
            'welding_time_sec': 120,
            'cooling_time_min': 20,
            'price': '36500.00',
            'stock_quantity': 7,
            'is_popular': True,
            'sort_order': 60,
        },
        {
            'category': 'troyniki',
            'name': 'Тройник электросварный DN 160 PE 100 SDR 11',
            'slug': 'troynik-elektrosvarnyy-dn-160-pe-100-sdr-11',
            'sku': 'EF-T-160-11',
            'description': 'Равнопроходной тройник для магистральных ПЭ труб.',
            'diameter_mm': 160,
            'outlet_diameter_mm': 160,
            'length_mm': 430,
            'welding_voltage_v': 40,
            'welding_time_sec': 180,
            'cooling_time_min': 25,
            'price': '68400.00',
            'stock_status': 'preorder',
            'stock_quantity': 0,
            'lead_time_days': 21,
            'sort_order': 70,
        },
        {
            'category': 'redukcii',
            'name': 'Редукция электросварная DN 160/110 PE 100 SDR 11',
            'slug': 'redukciya-elektrosvarnaya-dn-160-110-pe-100-sdr-11',
            'sku': 'EF-R-160-110',
            'description': 'Переходная редукция для соединения труб DN 160 и DN 110.',
            'diameter_mm': 160,
            'reduced_diameter_mm': 110,
            'length_mm': 210,
            'welding_voltage_v': 40,
            'welding_time_sec': 140,
            'cooling_time_min': 20,
            'price': '29800.00',
            'stock_quantity': 11,
            'sort_order': 80,
        },
        {
            'category': 'redukcii',
            'name': 'Редукция электросварная DN 225/160 PE 100 SDR 11',
            'slug': 'redukciya-elektrosvarnaya-dn-225-160-pe-100-sdr-11',
            'sku': 'EF-R-225-160',
            'description': 'Редукция для перехода с DN 225 на DN 160.',
            'diameter_mm': 225,
            'reduced_diameter_mm': 160,
            'length_mm': 260,
            'welding_voltage_v': 40,
            'welding_time_sec': 190,
            'cooling_time_min': 25,
            'price': '56200.00',
            'stock_status': 'preorder',
            'stock_quantity': 0,
            'lead_time_days': 21,
            'sort_order': 90,
        },
        {
            'category': 'sedelki',
            'name': 'Седёлка электросварная DN 160 x 63 PE 100 SDR 11',
            'slug': 'sedelka-elektrosvarnaya-dn-160-x-63-pe-100-sdr-11',
            'sku': 'EF-S-160-063',
            'description': 'Седёлка для врезки ответвления DN 63 в трубу DN 160.',
            'diameter_mm': 160,
            'outlet_diameter_mm': 63,
            'length_mm': 180,
            'welding_voltage_v': 40,
            'welding_time_sec': 100,
            'cooling_time_min': 15,
            'price': '24600.00',
            'stock_quantity': 13,
            'is_popular': True,
            'sort_order': 100,
        },
        {
            'category': 'sedelki',
            'name': 'Седёлка электросварная DN 250 x 110 PE 100 SDR 11',
            'slug': 'sedelka-elektrosvarnaya-dn-250-x-110-pe-100-sdr-11',
            'sku': 'EF-S-250-110',
            'description': 'Седёлка для ответвления DN 110 от магистральной трубы DN 250.',
            'diameter_mm': 250,
            'outlet_diameter_mm': 110,
            'length_mm': 260,
            'welding_voltage_v': 40,
            'welding_time_sec': 150,
            'cooling_time_min': 25,
            'price': '51200.00',
            'stock_status': 'preorder',
            'stock_quantity': 0,
            'lead_time_days': 21,
            'sort_order': 110,
        },
        {
            'category': 'zaglushki',
            'name': 'Заглушка электросварная DN 110 PE 100 SDR 11',
            'slug': 'zaglushka-elektrosvarnaya-dn-110-pe-100-sdr-11',
            'sku': 'EF-Z-110-11',
            'description': 'Торцевая заглушка для постоянного или временного перекрытия ПЭ трубы.',
            'diameter_mm': 110,
            'length_mm': 78,
            'welding_voltage_v': 40,
            'welding_time_sec': 90,
            'cooling_time_min': 15,
            'price': '11800.00',
            'stock_quantity': 16,
            'sort_order': 120,
        },
    ]

    common_defaults = {
        'material': 'PE 100',
        'sdr': 'SDR 11',
        'pressure_rating': 'PN 16',
        'standard': 'EN 12201 / ISO 8085',
        'application': 'Напорные ПЭ трубопроводы для воды и газа',
        'stock_status': 'in_stock',
        'is_active': True,
    }

    for product in products:
        category_slug = product.pop('category')
        defaults = {**common_defaults, **product, 'category': category_map[category_slug]}
        Product.objects.update_or_create(
            sku=product['sku'],
            defaults=defaults,
        )


def remove_seed_catalog(apps, schema_editor):
    Category = apps.get_model('base', 'Category')
    Product = apps.get_model('base', 'Product')

    skus = [
        'EF-M-063-11',
        'EF-M-110-11',
        'EF-M-160-17',
        'EF-O-110-90',
        'EF-O-160-45',
        'EF-T-110-11',
        'EF-T-160-11',
        'EF-R-160-110',
        'EF-R-225-160',
        'EF-S-160-063',
        'EF-S-250-110',
        'EF-Z-110-11',
    ]
    slugs = ['mufty', 'otvody', 'troyniki', 'redukcii', 'sedelki', 'zaglushki']

    Product.objects.filter(sku__in=skus).delete()
    for slug in slugs:
        category = Category.objects.filter(slug=slug).first()
        if category and not Product.objects.filter(category=category).exists():
            category.delete()


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_catalog, remove_seed_catalog),
    ]
