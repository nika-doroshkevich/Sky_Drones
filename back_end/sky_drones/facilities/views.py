from django.contrib.auth import get_user_model
from rest_framework import generics, permissions

from sky_drones.mixins import UserRightsCorrespondingCheckMixin
from sky_drones.utils import RoleCustomerBasedPermission
from .models import Facility
from .serializers import FacilitySerializer

UserModel = get_user_model()


class FacilityAPIList(generics.ListAPIView, UserRightsCorrespondingCheckMixin):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = FacilitySerializer

    def get_queryset(self):
        user = self.request.user
        return self.get_facilities_list(user)


class FacilityAPICreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerBasedPermission,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer


class FacilityAPIRetrieve(generics.RetrieveAPIView, UserRightsCorrespondingCheckMixin):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

    def get_queryset(self):
        user = self.request.user
        return self.get_one_facility(user)


class FacilityAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleCustomerBasedPermission,)
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
