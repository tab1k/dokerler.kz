from .views import *
from django.urls import path

app_name = 'catalog'

urlpatterns = [
    path('', CatalogIndexView.as_view(), name='index'),
]
