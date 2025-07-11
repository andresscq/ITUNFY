import os
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('usuarios.urls')),
] + static(settings.STATIC_URL, document_root=os.path.join(settings.BASE_DIR, 'usuarios/static'))
