from django.db import models
from django.utils import timezone

from app_users.models import AppUser
from file_storage_items.models import FileStorageItem, Template
from inspections.models import Inspection


class Report(models.Model):
    created_date = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(AppUser, on_delete=models.PROTECT)
    template = models.ForeignKey(Template, on_delete=models.PROTECT)
    inspection = models.OneToOneField(Inspection, on_delete=models.PROTECT)
    file_storage_item = models.OneToOneField(FileStorageItem, on_delete=models.PROTECT)

    def __str__(self):
        return self.file_storage_item
