from rest_framework import generics, permissions

from sky_drones.utils import RoleCustomerOwnerBasedPermission, RoleEmployeeBasedPermission
from .models import Inspection
from .serializers import InspectionSerializer


class InspectionAPIList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


class InspectionAPICreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerOwnerBasedPermission,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


class InspectionAPIRetrieve(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


class InspectionAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer
