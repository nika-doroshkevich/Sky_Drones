from django.db import models

from app_users.models import AppUser
from facilities.models import Facility
from inspections.utils import InspectionPriority, InspectionStatus


class Inspection(models.Model):
    name = models.CharField(max_length=50)
    reason = models.TextField()
    facility = models.ForeignKey(Facility, on_delete=models.PROTECT)
    priority = models.CharField(max_length=10, blank=True, null=True, choices=InspectionPriority.choices())
    pilot = models.ForeignKey(AppUser, blank=True, null=True, on_delete=models.PROTECT,
                              related_name='inspections_as_pilot')
    inspector = models.ForeignKey(AppUser, blank=True, null=True, on_delete=models.PROTECT,
                                  related_name='inspections_as_inspector')
    status = models.CharField(max_length=10, choices=InspectionStatus.choices(), default=InspectionStatus.CREATED.value)

    def __str__(self):
        return self.name
