from django.urls import path

from . import views

urlpatterns = [
    path('report-create', views.ReportAPICreate.as_view(), name='report-create'),
]
