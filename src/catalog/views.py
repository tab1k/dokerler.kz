from django.shortcuts import render
from django.views import View



class CatalogIndexView(View):
    template_name = 'catalog/index.html'
    
    
    def get(self, request):
        return render(request, self.template_name)