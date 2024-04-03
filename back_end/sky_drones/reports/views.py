from datetime import datetime

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from app_users.models import AppUser
from facilities.models import Facility
from inspections.models import Inspection
from sky_drones.utils import RoleEmployeeBasedPermission


class ReportAPICreate(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def post(self, request):
        author = self.request.user
        created_date = datetime.now().date()
        inspection_id = request.data.get('inspectionId')
        inspection = Inspection.objects.get(id=inspection_id)
        facility = Facility.objects.get(id=inspection.facility.id)
        pilot = AppUser.objects.get(id=inspection.pilot.id)
        inspector = AppUser.objects.get(id=inspection.inspector.id)

        print(inspection)
        print(created_date)

        return Response(status=status.HTTP_201_CREATED)
