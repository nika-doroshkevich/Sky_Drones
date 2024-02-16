from django.urls import path

from . import views
from .views import CompanyByUser, CompanyAPIRetrieveUpdate

urlpatterns = [
    path('company-create', views.CompanyAPICreate.as_view(), name='company-create'),
    path('company/', views.CompanyAPIList.as_view(), name='company-list-filtered'),
    path('company-by-user/<int:pk>', CompanyByUser.as_view(), name='company-by-user'),
    path('company/<int:pk>', CompanyAPIRetrieveUpdate.as_view(), name='company-retrieve-update'),
]
