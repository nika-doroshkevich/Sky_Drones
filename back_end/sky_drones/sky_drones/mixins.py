import tempfile

import boto3
from botocore.exceptions import ClientError

from companies.models import Company
from facilities.models import Facility
from inspections.models import Inspection
from properties import ACCESS_KEY, SECRET_ACCESS_KEY, BUCKET_NAME, REGION_NAME, SIGNATURE_VERSION


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

    @staticmethod
    def get_inspection_queryset(facility_queryset):
        all_inspections_queryset = Inspection.objects.all()
        result = Inspection.objects.none()
        for inspection in all_inspections_queryset:
            for facility in facility_queryset:
                if inspection.facility_id == facility.id:
                    result = result | Inspection.objects.filter(pk=inspection.pk)

        return result


class AmazonS3Mixin:
    @staticmethod
    def upload_to_s3(file, unique_filename):
        s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY)
        bucket_name = BUCKET_NAME
        try:
            s3.upload_fileobj(file, bucket_name, unique_filename)
            url = f"https://{bucket_name}.s3.amazonaws.com/{unique_filename}"
            return url
        except Exception as e:
            print("Error uploading image to S3:", e)
            return None

    @staticmethod
    def download_file_from_s3(key):
        try:
            s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY,
                              region_name=REGION_NAME, config=boto3.session.Config(signature_version=SIGNATURE_VERSION))
            response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
            file_data = response['Body'].read()

            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                temp_file.write(file_data)

            return temp_file.name

        except ClientError as e:
            print("Error downloading file from S3:", e)
            return None

    @staticmethod
    def get_key_from_url(url):
        parts = url.split("/")
        url_after_fourth_part = "".join(parts[3:])

        question_mark_index = url_after_fourth_part.rfind("?")

        if question_mark_index != -1:
            return url_after_fourth_part[:question_mark_index]
        else:
            return url_after_fourth_part

    @staticmethod
    def get_generated_presigned_url(key):
        s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY,
                          region_name=REGION_NAME, config=boto3.session.Config(signature_version=SIGNATURE_VERSION))

        return s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': key},
            ExpiresIn=86400
        )
