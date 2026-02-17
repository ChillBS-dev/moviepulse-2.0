from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from movieapp.views import get_trending

urlpatterns = [
    path("api/", include("movieapp.urls")),
    path("admin/", admin.site.urls),
    path("api/trending/", get_trending),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
