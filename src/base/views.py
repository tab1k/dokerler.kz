from django.shortcuts import render, redirect
from django.db.models import Count, Q
from django.views import View

from .models import Category, Product


class BaseIndexView(View):
    def get(self, request):
        categories = (
            Category.objects
            .filter(is_active=True, products__is_active=True)
            .annotate(product_count=Count('products', filter=Q(products__is_active=True)))
            .order_by('sort_order', 'name')
            .distinct()[:4]
        )
        return render(request, 'index.html', {'product_categories': categories})
    
    def post(self, request):
        # Handle form submission
        # For now, just redirect to thanks
        return redirect('base:thanks')


class CatalogView(View):
    def get(self, request):
        categories = (
            Category.objects
            .filter(is_active=True)
            .annotate(product_count=Count('products', filter=Q(products__is_active=True)))
            .order_by('sort_order', 'name')
        )
        products = (
            Product.objects
            .filter(is_active=True, category__is_active=True)
            .select_related('category')
            .order_by('category__sort_order', 'sort_order', 'name')
        )
        return render(
            request,
            'catalog.html',
            {
                'categories': categories,
                'products': products,
                'total_products': products.count(),
            },
        )


class ThanksView(View):
    def get(self, request):
        return render(request, 'thanks.html')
