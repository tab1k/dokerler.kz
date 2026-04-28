from django.shortcuts import render, redirect
from django.db.models import Count, Q
from django.views import View

from products.models import Category, Product
from .models import Order


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
            # Redirect to thanks with data for WhatsApp redirect
            from django.utils.http import urlencode
            params = urlencode({
                'wa': 1,
                'name': name,
                'phone': phone,
                'city': city,
                'comment': comment
            })
            return redirect(f"{redirect('base:thanks').url}?{params}")
        
        return redirect('base:index')
