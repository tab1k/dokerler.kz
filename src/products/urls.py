from django.urls import path
from .views import CatalogView, ProductDetailView

app_name = 'products'

urlpatterns = [
    path('catalog/', CatalogView.as_view(), name='catalog'),
    path('catalog/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),
    path('product/<slug:slug>/', ProductDetailView.as_view(), name='product_detail_alt'),
]
