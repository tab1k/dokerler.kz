from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Q
from django.views import View

from .models import Category, Product


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
        
        # Get unique SDR values
        sdrs = products.values_list('sdr', flat=True).distinct().order_by('sdr')
        
        # DN Ranges
        dn_ranges = [
            {'label': '20 — 32 мм', 'value': '20-32'},
            {'label': '40 — 63 мм', 'value': '40-63'},
            {'label': '75 — 110 мм', 'value': '75-110'},
            {'label': '125 — 225 мм', 'value': '125-225'},
            {'label': '250 — 400 мм', 'value': '250-400'},
            {'label': '450 — 630 мм', 'value': '450-630'},
        ]

        return render(
            request,
            'products/index.html',
            {
                'categories': categories,
                'products': products,
                'has_mufta_models': products.filter(Q(category__slug__icontains='mufta') | Q(name__icontains='муфта')).exists(),
                'total_products': products.count(),
                'filter_options': {
                    'sdrs': sdrs,
                    'dn_ranges': dn_ranges,
                    'stock_choices': Product.STOCK_CHOICES,
                }
            },
        )


class ProductDetailView(View):
    def get(self, request, slug):
        product = get_object_or_404(Product, slug=slug, is_active=True)
        category_slug = (product.category.slug or '').lower()
        use_mufta_model = 'mufta' in category_slug or 'муфта' in product.name.lower()
            
        # Get related products (same category)
        related_products = (
            Product.objects
            .filter(category=product.category, is_active=True)
            .exclude(id=product.id)
            .order_by('?')[:4]
        )
            
        return render(
            request,
            'products/detail.html',
            {
                'product': product,
                'related_products': related_products,
                'use_mufta_model': use_mufta_model,
            }
        )
