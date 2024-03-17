from django.urls import path

from . import views

urlpatterns = [
    path('upload-images/<int:facility_id>', views.UploadImages.as_view(), name='upload-images'),
]
