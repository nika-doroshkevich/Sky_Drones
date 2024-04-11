from django.urls import path

from . import views
from .views import DefectAPIDelete

urlpatterns = [
    path('defects-create', views.DefectAPICreate.as_view(), name='defects-create'),
    path('defects-list/<int:inspection_id>', views.DefectAPIList.as_view(), name='defects-list'),
    path('delete-defect/<int:pk>', DefectAPIDelete.as_view(), name='delete-defect'),
]
