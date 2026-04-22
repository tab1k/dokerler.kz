from django.shortcuts import render, redirect
from django.views import View


class BaseIndexView(View):
    def get(self, request):
        return render(request, 'index.html')
    
    def post(self, request):
        # Handle form submission
        # For now, just redirect to thanks
        return redirect('base:thanks')


class CatalogView(View):
    def get(self, request):
        return render(request, 'catalog.html')


class ThanksView(View):
    def get(self, request):
        return render(request, 'thanks.html')