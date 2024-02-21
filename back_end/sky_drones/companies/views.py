from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from sky_drones.utils import RoleOwnerBasedPermission
from .models import Company
from .serializers import CompanySerializer

UserModel = get_user_model()


class CompanyAPIList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_queryset(self):
        company_type = self.request.query_params.get('type', 'INSPECTED')

        if company_type == 'INSPECTED':
            return Company.objects.filter(company_type='INSPECTED')
        elif company_type == 'INSPECTING':
            return Company.objects.filter(company_type='INSPECTING')
        else:
            raise serializers.ValidationError({"detail": "No companies have been found"})


class CompanyAPICreate(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleOwnerBasedPermission,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CompanyByUser(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleOwnerBasedPermission,)

    def get(self, request, pk):
        user = get_object_or_404(UserModel, pk=pk)
        company_id = user.company_id
        company = get_object_or_404(Company, pk=company_id)
        serializer = CompanySerializer(company)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CompanyAPIRetrieveUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleOwnerBasedPermission,)
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
