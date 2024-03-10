from django.urls import path

from . import views
from .views import FacilityAPIUpdate, FacilityAPIRetrieve

urlpatterns = [
    path('facility-list', views.FacilityAPIList.as_view(), name='facility-list'),
    path('facility-create', views.FacilityAPICreate.as_view(), name='facility-create'),
    path('facility-update/<int:pk>', FacilityAPIUpdate.as_view(), name='facility-update'),
    path('facility/<int:pk>', FacilityAPIRetrieve.as_view(), name='facility-retrieve'),
]
