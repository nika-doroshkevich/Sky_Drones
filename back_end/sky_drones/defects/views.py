import json

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from file_storage_items.models import FileStorageItem
from inspections.models import Inspection
from sky_drones.mixins import AmazonS3Mixin
from sky_drones.utils import RoleEmployeeBasedPermission
from .models import Defect
from .serializers import DefectWithUrlSerializer, DefectDeleteSerializer


class DefectAPIList(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def get(self, request, inspection_id):
        defects_queryset = Defect.objects.filter(inspection_id=inspection_id, deleted=False)
        serializer = DefectWithUrlSerializer(defects_queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DefectAPICreate(APIView, AmazonS3Mixin):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def post(self, request):
        defects = request.data.get('defects')
        defects_data = json.loads(defects)
        inspection_id = request.data.get('inspectionId')
        inspection = Inspection.objects.get(id=inspection_id)

        for defect in defects_data:
            image_url = defect.get('imageUrl')
            name = defect.get('name')
            severity = defect.get('severity')
            description = defect.get('description')

            key = self.get_key_from_url(image_url)
            file_storage_item = FileStorageItem.objects.get(file_name=key)

            new_defect = Defect.objects.create(
                name=name,
                severity=severity,
                description=description,
                file_storage_item=file_storage_item,
                inspection=inspection)

            if not new_defect:
                return Response({"detail": "Error saving defects"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


class DefectAPIDelete(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)
    queryset = Defect.objects.all()
    serializer_class = DefectDeleteSerializer
