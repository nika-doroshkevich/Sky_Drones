from rest_framework import generics, permissions

from sky_drones.mixins import UserRightsCorrespondingCheckMixin
from sky_drones.utils import RoleCustomerOwnerBasedPermission, RoleEmployeeBasedPermission
from .models import Inspection
from .serializers import InspectionSerializer


class InspectionAPIList(generics.ListAPIView, UserRightsCorrespondingCheckMixin):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = InspectionSerializer

    def get_queryset(self):
        user = self.request.user
        facility_queryset = self.get_facilities_list(user)
        return get_inspection_queryset(facility_queryset)


class InspectionAPICreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerOwnerBasedPermission,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


class InspectionAPIRetrieve(generics.RetrieveAPIView, UserRightsCorrespondingCheckMixin):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = InspectionSerializer

    def get_queryset(self):
        user = self.request.user
        facility = self.get_one_facility(user)
        return get_inspection_queryset(facility)


class InspectionAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


def get_inspection_queryset(facility_queryset):
    all_inspections_queryset = Inspection.objects.all()
    result = Inspection.objects.none()
    for inspection in all_inspections_queryset:
        for facility in facility_queryset:
            if inspection.facility_id == facility.id:
                result = result | Inspection.objects.filter(pk=inspection.pk)

    return result
