from django.urls import path

from . import views

urlpatterns = [
    path('upload-image', views.UploadImage.as_view(), name='upload-image'),
]
