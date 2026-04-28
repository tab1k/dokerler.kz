from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'phone', 'city', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'city')
    search_fields = ('name', 'phone', 'comment', 'city')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at')
