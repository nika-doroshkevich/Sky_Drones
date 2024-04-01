import json

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from file_storage_items.models import FileStorageItem
from sky_drones.utils import RoleEmployeeBasedPermission
from .models import Defect
from .serializers import DefectSerializer


class DefectAPIList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)
    queryset = Defect.objects.all()
    serializer_class = DefectSerializer


class DefectAPICreate(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def post(self, request):
        images = request.data.get('images')
        defects = request.data.get('defects')
        defects_data = json.loads(defects)

        for defect in defects_data:
            name = defect.get('name')
            severity = defect.get('severity')
            description = defect.get('description')
            for image in images:
                key = get_key_from_url(image)
                file_storage_item = FileStorageItem.objects.get(file_name=key)
                new_defect = Defect.objects.create(
                    name=name,
                    severity=severity,
                    description=description,
                    file_storage_item=file_storage_item)

                if not new_defect:
                    return Response({"detail": "Error saving defects"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_201_CREATED)


class DefectAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)
    queryset = Defect.objects.all()
    serializer_class = DefectSerializer


def get_key_from_url(url):
    parts = url.split("/")
    url_after_fourth_part = "".join(parts[3:])

    question_mark_index = url_after_fourth_part.rfind("?")

    if question_mark_index != -1:
        return url_after_fourth_part[:question_mark_index]
    else:
        return url_after_fourth_part
