from .views import *
from django.urls import path

app_name = 'base'

urlpatterns = [
    path('', BaseIndexView.as_view(), name='index'),
    path('about/', BaseAboutView.as_view(), name='about'),
    path('contacts/', BaseContactsView.as_view(), name='contacts'),
    path('certificates/', BaseCertificatesView.as_view(), name='certificates'),
]
