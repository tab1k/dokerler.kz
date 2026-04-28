from .views import *
from django.urls import path

app_name = 'base'

urlpatterns = [
    path('', BaseIndexView.as_view(), name='index'),
    path('thanks/', ThanksView.as_view(), name='thanks'),
    path('order/', OrderSubmitView.as_view(), name='order_submit'),
]
