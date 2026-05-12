from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('i18n/', include('django.conf.urls.i18n')),
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('base.urls')),
    path('', include('products.urls')),
    prefix_default_language=False
)

# Serve uploaded media files. In this project deployment there is no separate
# web server location for /media, so Django must expose MEDIA_URL routes.
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
