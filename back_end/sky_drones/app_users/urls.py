from django.urls import path

from . import views
from .views import UserAPIUpdate

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('users', views.UserList.as_view(), name='users'),
    path('user/<int:pk>', UserAPIUpdate.as_view()),
    path('all', views.AllView.as_view(), name='all'),
]
