from django.db import models

from defects.utils import DefectSeverity
from file_storage_items.models import FileStorageItem
from inspections.models import Inspection


class Defect(models.Model):
    name = models.CharField(max_length=50)
    severity = models.CharField(max_length=10, choices=DefectSeverity.choices())
    description = models.TextField()
    file_storage_item = models.ForeignKey(FileStorageItem, on_delete=models.PROTECT)
    inspection = models.ForeignKey(Inspection, on_delete=models.PROTECT)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
