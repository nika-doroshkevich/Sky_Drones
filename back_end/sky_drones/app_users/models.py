from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from .utils import UserStatuses


class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Email is required.')
        if not password:
            raise ValueError('Password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=3, null=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=30)
    phone = models.CharField(max_length=40, null=True)
    job_title = models.CharField(max_length=50, null=True)
    status = models.CharField(max_length=10, choices=UserStatuses.choices(), default=UserStatuses.ACTIVE.value)
    role = models.ForeignKey('UserRole', on_delete=models.PROTECT, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = AppUserManager()

    def __str__(self):
        return self.username


class UserRole(models.Model):
    name = models.CharField(max_length=20, db_index=True)

    def __str__(self):
        return self.name
