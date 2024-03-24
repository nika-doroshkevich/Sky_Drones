from django.urls import path

from . import views

urlpatterns = [
    path('upload-images/<int:facility_id>', views.UploadImages.as_view(), name='upload-images'),
    path('get-images/<int:facility_id>', views.ImagesList.as_view(), name='get-images'),
    path('metadata', views.ImageOverlay.as_view(), name='metadata'),
]
