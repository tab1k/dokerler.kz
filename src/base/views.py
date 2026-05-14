from django.shortcuts import render, redirect
from django.db.models import Count, Q
from django.views import View
from django.utils.http import urlencode
from django.utils.translation import gettext as _

from products.models import Category, Product
from .models import Order


class BaseIndexView(View):
    def get(self, request):
        categories = list(
            Category.objects
            .filter(is_active=True)
            .annotate(product_count=Count('products', filter=Q(products__is_active=True), distinct=True))
            .order_by('sort_order', 'name')
        )
        category_cards = []
        for category in categories:
            image_url = ''
            if category.image and category.image.name:
                try:
                    if category.image.storage.exists(category.image.name):
                        image_url = category.image.url
                except Exception:
                    image_url = ''
            category_cards.append({
                'instance': category,
                'image_url': image_url,
                'product_count': category.product_count,
            })
        return render(request, 'index.html', {'product_categories': category_cards})


class ThanksView(View):
    def get(self, request):
        return render(request, 'thanks.html')


class OrderSubmitView(View):
    def post(self, request):
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        city = request.POST.get('city', '')
        comment = request.POST.get('comment', '')

        if name and phone:
            Order.objects.create(
                name=name,
                phone=phone,
                city=city,
                comment=comment
            )
            params = urlencode({
                'wa': 1,
                'name': name,
                'phone': phone,
                'city': city,
                'comment': comment
            })
            return redirect(f"{redirect('base:thanks').url}?{params}")
        
        return redirect('base:index')
