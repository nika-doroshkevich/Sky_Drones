from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from sky_drones.mixins import UserRightsCorrespondingCheckMixin
from sky_drones.utils import RoleCustomerOwnerBasedPermission, RoleEmployeeBasedPermission
from .models import Inspection
from .serializers import InspectionSerializer
from .utils import InspectionStatus


class InspectionAPIList(generics.ListAPIView, UserRightsCorrespondingCheckMixin):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = InspectionSerializer

    def get_queryset(self):
        user = self.request.user
        facility_queryset = self.get_facilities_list(user)
        return self.get_inspection_queryset(facility_queryset)


class InspectionAPIListForDefectsPage(APIView, UserRightsCorrespondingCheckMixin):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission)

    def get(self, request, facility_id):
        user = self.request.user
        facility_queryset = self.get_facilities_list(user)
        inspection_queryset = self.get_inspection_queryset(facility_queryset)
        inspection_list_for_defects = get_inspection_queryset_filtered_by_facility_and_status(
            inspection_queryset, facility_id, InspectionStatus.IN_PROCESS.value)
        serializer = InspectionSerializer(inspection_list_for_defects, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


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
        return self.get_inspection_queryset(facility)


class InspectionAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


def get_inspection_queryset_filtered_by_facility_and_status(inspection_queryset, facility_id, inspection_status):
    result = Inspection.objects.none()
    for inspection in inspection_queryset:
        if inspection.facility_id == facility_id and inspection.status == inspection_status:
            result = result | Inspection.objects.filter(pk=inspection.pk)

    return result
