from django.shortcuts import render
from django.views import View


class BaseIndexView(View):
    def get(self, request):
        return render(request, 'base/index.html')
    
    
class BaseAboutView(View):
    def get(self, request):
        return render(request, 'base/about.html')

class BaseCertificatesView(View):
    def get(self, request):
        return render(request, 'base/certificates.html')
    
    
class BaseContactsView(View):
    def get(self, request):
        return render(request, 'base/contacts.html')