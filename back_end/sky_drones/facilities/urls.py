from django.urls import path

from . import views
from .views import FacilityAPIRetrieveUpdate

urlpatterns = [
    path('facility-list', views.FacilityAPIList.as_view(), name='facility-list'),
    path('facility-create', views.FacilityAPICreate.as_view(), name='facility-create'),
    path('facility/<int:pk>', FacilityAPIRetrieveUpdate.as_view(), name='facility-retrieve-update'),
]
