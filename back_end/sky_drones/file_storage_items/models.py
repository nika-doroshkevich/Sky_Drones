from django.db import models

from facilities.models import Facility
from file_storage_items.utils import FileStorageItemType


class FileStorageItem(models.Model):
    file_name = models.CharField(max_length=300)
    type = models.CharField(max_length=20, choices=FileStorageItemType.choices(),
                            default=FileStorageItemType.IMAGE.value)
    path = models.CharField(max_length=300)
    facility = models.ForeignKey(Facility, on_delete=models.PROTECT)

    def __str__(self):
        return self.file_name
