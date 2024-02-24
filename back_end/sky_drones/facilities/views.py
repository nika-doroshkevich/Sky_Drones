from django.contrib.auth import get_user_model
from rest_framework import generics, permissions

from companies.models import Company
from sky_drones.utils import RoleCustomerBasedPermission
from .models import Facility
from .serializers import FacilitySerializer

UserModel = get_user_model()


def get_facility_queryset(user):
    user_company_id = user.company_id

    inspected_companies_queryset = Company.objects.filter(inspecting_company_id=user_company_id)
    queryset_for_inspecting = Facility.objects.none()
    for company in inspected_companies_queryset:
        temp_queryset = Facility.objects.filter(company_id=company.id)
        queryset_for_inspecting = queryset_for_inspecting.union(temp_queryset)

    queryset_for_inspected = Facility.objects.filter(company_id=user_company_id)

    result_queryset = queryset_for_inspected.union(queryset_for_inspecting)
    return result_queryset


class FacilityAPIList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FacilitySerializer

    def get_queryset(self):
        user = self.request.user
        return get_facility_queryset(user)


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

    def get_queryset(self):
        user = self.request.user
        user_company_id = user.company_id
        queryset = Facility.objects.filter(company_id=user_company_id)
        return queryset
