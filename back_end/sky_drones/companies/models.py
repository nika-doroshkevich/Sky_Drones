from django.db import models

from companies.utils import CompanyType
from sky_drones.utils import Statuses


class Company(models.Model):
    name = models.CharField(max_length=200, unique=True)
    status = models.CharField(max_length=10, choices=Statuses.choices(), default=Statuses.ACTIVE.value)
    phone = models.CharField(max_length=40)
    website = models.CharField(max_length=300, null=True)
    company_type = models.CharField(max_length=15, choices=CompanyType.choices())
    inspecting_company = models.ForeignKey('Company', on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name
