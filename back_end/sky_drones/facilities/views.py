from rest_framework import generics, permissions

from sky_drones.utils import RoleCustomerBasedPermission
from .models import Facility
from .serializers import FacilitySerializer


class FacilityAPIList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer


class FacilityAPICreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerBasedPermission,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer


class FacilityAPIRetrieveUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerBasedPermission,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
