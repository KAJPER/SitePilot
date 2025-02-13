from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('summernote/', include('django_summernote.urls')),
    # Dodaj obsługę plików z katalogu websites
    path('websites/<path:path>', serve, {
        'document_root': os.path.join(settings.BASE_DIR.parent, 'websites'),
    }),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) 