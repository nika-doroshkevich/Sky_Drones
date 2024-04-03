"""
URL configuration for sky_drones project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('sky-drones/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('sky-drones/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('sky-drones/', include('app_users.urls')),
    path('sky-drones/', include('companies.urls')),
    path('sky-drones/', include('facilities.urls')),
    path('sky-drones/', include('file_storage_items.urls')),
    path('sky-drones/', include('inspections.urls')),
    path('sky-drones/', include('defects.urls')),
    path('sky-drones/', include('reports.urls')),
]
