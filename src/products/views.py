from django.shortcuts import render, redirect, get_object_or_404
from django.db.models import Count, Q
from django.views import View
from django.utils.translation import gettext_lazy as _

from .models import Category, Product


class CatalogView(View):
    def get(self, request):
        selected_category_slug = (request.GET.get('category') or '').strip()
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

        if selected_category_slug and categories.filter(slug=selected_category_slug).exists():
            products = products.filter(category__slug=selected_category_slug)
        else:
            selected_category_slug = ''
        
        # Get unique SDR values
        sdrs = products.values_list('sdr', flat=True).distinct().order_by('sdr')
        
        # DN Ranges
        dn_ranges = [
            {'label': _('20 — 32 мм'), 'value': '20-32'},
            {'label': _('40 — 63 мм'), 'value': '40-63'},
            {'label': _('75 — 110 мм'), 'value': '75-110'},
            {'label': _('125 — 225 мм'), 'value': '125-225'},
            {'label': _('250 — 400 мм'), 'value': '250-400'},
            {'label': _('450 — 630 мм'), 'value': '450-630'},
        ]

        return render(
            request,
            'products/index.html',
            {
                'categories': categories,
                'products': products,
                'has_mufta_models': products.filter(Q(category__slug__icontains='mufta') | Q(name__icontains='муфта')).exists(),
                'total_products': products.count(),
                'selected_category_slug': selected_category_slug,
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
        use_mufta_model = 'muft' in category_slug or 'муфт' in product.name.lower()
            
        related_products = list(
            Product.objects
            .filter(category=product.category, is_active=True)
            .exclude(id=product.id)
            .order_by('?')[:4]
        )

        if len(related_products) < 4:
            existing_ids = [item.id for item in related_products]
            fallback_products = (
                Product.objects
                .filter(is_active=True, category__is_active=True)
                .exclude(id=product.id)
                .exclude(id__in=existing_ids)
                .order_by('?')[: 4 - len(related_products)]
            )
            related_products.extend(list(fallback_products))
            
        return render(
            request,
            'products/detail.html',
            {
                'product': product,
                'related_products': related_products,
                'use_mufta_model': use_mufta_model,
            }
        )
