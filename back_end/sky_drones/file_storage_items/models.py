from django.db import models

from facilities.models import Facility


class FileStorageItem(models.Model):
    file_name = models.CharField(max_length=300)
    path = models.CharField(max_length=300)
    facility = models.ForeignKey(Facility, on_delete=models.PROTECT)

    def __str__(self):
        return self.file_name
