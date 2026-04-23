from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'sku',
        'category',
        'diameter_mm',
        'sdr',
        'pressure_rating',
        'stock_status',
        'stock_quantity',
        'price',
        'is_active',
    )
    list_editable = ('stock_status', 'stock_quantity', 'price', 'is_active')
    list_filter = ('category', 'sdr', 'pressure_rating', 'stock_status', 'is_popular', 'is_active')
    search_fields = ('name', 'sku', 'barcode', 'description')
    prepopulated_fields = {'slug': ('name',)}
    autocomplete_fields = ('category',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Основное', {
            'fields': ('category', 'name', 'slug', 'sku', 'description', 'image', 'is_active', 'is_popular', 'sort_order'),
        }),
        ('Характеристики фитинга', {
            'fields': (
                'material',
                'sdr',
                'pressure_rating',
                'standard',
                'application',
                'diameter_mm',
                'outlet_diameter_mm',
                'reduced_diameter_mm',
                'angle_degree',
                'length_mm',
            ),
        }),
        ('Сварка и маркировка', {
            'fields': ('welding_voltage_v', 'welding_time_sec', 'cooling_time_min', 'barcode'),
        }),
        ('Цена и наличие', {
            'fields': ('price', 'stock_status', 'stock_quantity', 'lead_time_days'),
        }),
        ('Системное', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
