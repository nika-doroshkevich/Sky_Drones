from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from companies.models import Company
from sky_drones.utils import RoleCustomerBasedPermission
from .models import Facility
from .serializers import FacilitySerializer

UserModel = get_user_model()


class FacilityAPIList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    # queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

    def get_queryset(self):
        user = self.request.user

        user_company_id = user.company_id
        company = get_object_or_404(Company, pk=user_company_id)
        inspecting_company_id = company.inspecting_company_id
        print(inspecting_company_id)  # None
        user = get_object_or_404(UserModel, pk=user.id)

        queryset1 = Facility.objects.none()
        if user.company_id == inspecting_company_id:
            user_inspecting_company_id = user.company_id
            print(user_inspecting_company_id)
            queryset1 = Facility.objects.filter(company_id=user_inspecting_company_id)

        queryset2 = Facility.objects.filter(company_id=user_company_id)
        result_queryset = queryset1.union(queryset2)

        if result_queryset is None:
            raise ValidationError({"detail": "You don't have enough user rights"})
        else:
            return result_queryset


class FacilityAPICreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerBasedPermission,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer


class FacilityAPIRetrieveUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerBasedPermission,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
