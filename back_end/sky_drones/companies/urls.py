from django.urls import path

from . import views

urlpatterns = [
    path('company', views.CompanyAPIListCreate.as_view(), name='company-list-create'),
    path('company/<int:pk>', views.CompanyAPIUpdate.as_view()),
    path('company/', views.CompanyAPIListCreate.as_view(), name='company-list-filtered'),
]
