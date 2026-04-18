from django.shortcuts import render
from django.views import View


class BaseIndexView(View):
    def get(self, request):
        return render(request, 'index.html')


class CatalogView(View):
    def get(self, request):
        return render(request, 'catalog.html')