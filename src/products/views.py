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
        products_qs = (
            Product.objects
            .filter(is_active=True, category__is_active=True)
            .select_related('category')
            .order_by('category__sort_order', 'sort_order', 'name')
        )

        if selected_category_slug and categories.filter(slug=selected_category_slug).exists():
            products_qs = products_qs.filter(category__slug=selected_category_slug)
        else:
            selected_category_slug = ''
        
        # Get unique SDR values
        sdrs = products_qs.values_list('sdr', flat=True).distinct().order_by('sdr')
        total_products = products_qs.count()
        products = list(products_qs)

        for product in products:
            safe_image_url = ''
            for image_field in (product.image, product.category.image):
                if not image_field or not image_field.name:
                    continue
                try:
                    if image_field.storage.exists(image_field.name):
                        safe_image_url = image_field.url
                        break
                except Exception:
                    continue
            product.safe_image_url = safe_image_url

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
                'total_products': total_products,
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
        product = get_object_or_404(
            Product.objects.select_related('category'),
            slug=slug,
            is_active=True,
            category__is_active=True,
        )
        try:
            model_3d_url = product.category.model_3d.url if product.category.model_3d else ''
        except Exception:
            model_3d_url = ''

        category_products = (
            Product.objects
            .filter(category=product.category, is_active=True)
            .order_by('diameter_mm', 'outlet_diameter_mm', 'reduced_diameter_mm', 'length_mm', 'name')
        )
            
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
                'category_products': category_products,
                'related_products': related_products,
                'model_3d_url': model_3d_url,
            }
        )
