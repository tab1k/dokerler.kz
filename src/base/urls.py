from .views import *
from django.urls import path

app_name = 'base'

urlpatterns = [
    path('', BaseIndexView.as_view(), name='index'),
]
