from django.db import models


class Category(models.Model):
    name = models.CharField('Название', max_length=120)
    slug = models.SlugField('URL-код', max_length=140, unique=True)
    description = models.TextField('Описание', blank=True)
    sort_order = models.PositiveIntegerField('Порядок', default=0)
    is_active = models.BooleanField('Активна', default=True)
    created_at = models.DateTimeField('Создана', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлена', auto_now=True)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'
        ordering = ('sort_order', 'name')

    def __str__(self):
        return self.name


class Product(models.Model):
    STOCK_IN = 'in_stock'
    STOCK_PREORDER = 'preorder'
    STOCK_OUT = 'out_of_stock'
    STOCK_CHOICES = (
        (STOCK_IN, 'На складе'),
        (STOCK_PREORDER, 'Под заказ'),
        (STOCK_OUT, 'Нет в наличии'),
    )

    category = models.ForeignKey(
        Category,
        verbose_name='Категория',
        related_name='products',
        on_delete=models.PROTECT,
    )
    name = models.CharField('Название', max_length=180)
    slug = models.SlugField('URL-код', max_length=200, unique=True)
    sku = models.CharField('Артикул', max_length=80, unique=True)
    description = models.TextField('Описание', blank=True)

    material = models.CharField('Материал', max_length=80, default='PE 100')
    sdr = models.CharField('SDR', max_length=20, default='SDR 11')
    pressure_rating = models.CharField('Давление', max_length=30, default='PN 16')
    standard = models.CharField('Стандарт', max_length=120, default='EN 12201 / ISO 8085')
    application = models.CharField('Применение', max_length=180, blank=True)

    diameter_mm = models.PositiveIntegerField('Основной диаметр DN, мм')
    outlet_diameter_mm = models.PositiveIntegerField('Диаметр отвода DN, мм', blank=True, null=True)
    reduced_diameter_mm = models.PositiveIntegerField('Переход на DN, мм', blank=True, null=True)
    angle_degree = models.DecimalField('Угол, °', max_digits=5, decimal_places=1, blank=True, null=True)
    length_mm = models.PositiveIntegerField('Длина, мм', blank=True, null=True)

    welding_voltage_v = models.PositiveIntegerField('Напряжение сварки, В', blank=True, null=True)
    welding_time_sec = models.PositiveIntegerField('Время сварки, сек', blank=True, null=True)
    cooling_time_min = models.PositiveIntegerField('Время охлаждения, мин', blank=True, null=True)
    barcode = models.CharField('Штрихкод', max_length=80, blank=True)

    price = models.DecimalField('Цена, ₸', max_digits=12, decimal_places=2, blank=True, null=True)
    stock_status = models.CharField('Наличие', max_length=20, choices=STOCK_CHOICES, default=STOCK_IN)
    stock_quantity = models.PositiveIntegerField('Остаток, шт', default=0)
    lead_time_days = models.PositiveIntegerField('Срок поставки, дней', blank=True, null=True)

    image = models.ImageField('Фото', upload_to='products/', blank=True)
    is_popular = models.BooleanField('Популярный товар', default=False)
    is_active = models.BooleanField('Активен', default=True)
    sort_order = models.PositiveIntegerField('Порядок', default=0)
    created_at = models.DateTimeField('Создан', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлен', auto_now=True)

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'
        ordering = ('category__sort_order', 'sort_order', 'name')
        indexes = (
            models.Index(fields=('category', 'is_active')),
            models.Index(fields=('diameter_mm',)),
            models.Index(fields=('stock_status',)),
        )

    def __str__(self):
        return f'{self.name} ({self.sku})'

    @property
    def diameter_display(self):
        if self.reduced_diameter_mm:
            return f'DN {self.diameter_mm}/{self.reduced_diameter_mm} мм'
        if self.outlet_diameter_mm:
            return f'DN {self.diameter_mm} x DN {self.outlet_diameter_mm} мм'
        return f'DN {self.diameter_mm} мм'

    @property
    def angle_display(self):
        if self.angle_degree is None:
            return ''
        angle = int(self.angle_degree) if self.angle_degree == int(self.angle_degree) else self.angle_degree
        return f'{angle}°'

    @property
    def spec_line(self):
        return f'{self.sdr} / {self.pressure_rating} · {self.material}'

    @property
    def price_display(self):
        if self.price is None:
            return 'По запросу'
        value = int(self.price) if self.price == int(self.price) else self.price
        return f'{value:,}'.replace(',', ' ') + ' ₸'

    @property
    def stock_label(self):
        if self.stock_status == self.STOCK_PREORDER and self.lead_time_days:
            return f'Под заказ ({self.lead_time_days} дней)'
        return self.get_stock_status_display()
