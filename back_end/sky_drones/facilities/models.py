from django.db import models

from companies.models import Company
from facilities.utils import FacilityType


class Facility(models.Model):
    latitude = models.DecimalField(max_digits=23, decimal_places=20)
    longitude = models.DecimalField(max_digits=23, decimal_places=20)
    name = models.CharField(max_length=300)
    type = models.CharField(max_length=50, choices=FacilityType.choices())
    location = models.CharField(max_length=300, null=True)
    description = models.TextField(null=True)
    company = models.ForeignKey(Company, on_delete=models.PROTECT)

    def __str__(self):
        return self.name
