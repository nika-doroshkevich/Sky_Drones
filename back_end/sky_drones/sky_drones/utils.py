from enum import Enum

from rest_framework.permissions import BasePermission


class Statuses(Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]


class RoleOwnerBasedPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['EMPLOYEE_OWNER', 'CUSTOMER_OWNER']


class RoleCustomerOwnerBasedPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['CUSTOMER_OWNER']


class RoleCustomerBasedPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['CUSTOMER_OWNER', 'CUSTOMER']


class RoleEmployeeBasedPermission(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['EMPLOYEE_OWNER', 'EMPLOYEE']
