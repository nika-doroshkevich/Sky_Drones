from rest_framework import generics, permissions

from sky_drones.utils import RoleBasedPermission
from .models import Company
from .serializers import CompanySerializer


class CompanyAPIListCreate(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleBasedPermission,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_queryset(self):
        company_type = self.request.query_params.get('type', 'INSPECTED')

        if company_type == 'INSPECTED':
            return Company.objects.filter(company_type='INSPECTED')
        elif company_type == 'INSPECTING':
            return Company.objects.filter(company_type='INSPECTING')
        else:
            return Company.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CompanyAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
