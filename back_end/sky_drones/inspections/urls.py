from django.urls import path

from . import views
from .views import InspectionAPIUpdate, InspectionAPIRetrieve

urlpatterns = [
    path('inspection-list', views.InspectionAPIList.as_view(), name='inspection-list'),
    path('inspection-create', views.InspectionAPICreate.as_view(), name='inspection-create'),
    path('inspection-update/<int:pk>', InspectionAPIUpdate.as_view(), name='inspection-update'),
    path('inspection/<int:pk>', InspectionAPIRetrieve.as_view(), name='inspection-retrieve'),
]
