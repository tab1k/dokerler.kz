from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'sort_order', 'is_active', 'image', 'model_3d')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('sort_order', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'diameter_mm', 'sdr', 'price', 'stock_status', 'is_active')
    list_filter = ('category', 'sdr', 'stock_status', 'is_active')
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'stock_status', 'is_active')
