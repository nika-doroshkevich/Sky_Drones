from companies.models import Company
from facilities.models import Facility


class UserRightsCorrespondingCheckMixin:
    @staticmethod
    def get_facilities_list(user):
        user_company_id = user.company_id

        inspected_companies_queryset = Company.objects.filter(inspecting_company_id=user_company_id)
        queryset_for_inspecting = Facility.objects.none()
        for company in inspected_companies_queryset:
            temp_queryset = Facility.objects.filter(company_id=company.id)
            queryset_for_inspecting = queryset_for_inspecting.union(temp_queryset)

        queryset_for_inspected = Facility.objects.filter(company_id=user_company_id)

        result_queryset = queryset_for_inspected.union(queryset_for_inspecting)
        return result_queryset

    @staticmethod
    def get_one_facility(user):
        user_company_id = user.company_id
        result_queryset = Facility.objects.filter(company_id=user_company_id)

        if not result_queryset:
            inspected_companies_queryset = Company.objects.filter(inspecting_company_id=user_company_id)
            for company in inspected_companies_queryset:
                result_queryset = Facility.objects.filter(company_id=company.id)
        return result_queryset
