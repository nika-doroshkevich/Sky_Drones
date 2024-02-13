from django.urls import path

from . import views
from .views import CompanyByUser, CompanyAPIRetrieveUpdate

urlpatterns = [
    path('company', views.CompanyAPIListCreate.as_view(), name='company-list-create'),
    path('company/', views.CompanyAPIListCreate.as_view(), name='company-list-filtered'),
    path('company-by-user/<int:pk>', CompanyByUser.as_view(), name='company-by-user'),
    path('company/<int:pk>', CompanyAPIRetrieveUpdate.as_view(), name='company-retrieve-update'),
]
