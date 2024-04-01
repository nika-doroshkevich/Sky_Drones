from django.urls import path

from . import views

urlpatterns = [
    path('defects-create', views.DefectAPICreate.as_view(), name='defects-create'),
]
