import uuid

import boto3
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from facilities.models import Facility
from file_storage_items.models import FileStorageItem
from file_storage_items.serializers import FileStorageItemSerializer
from properties import ACCESS_KEY, SECRET_ACCESS_KEY, BUCKET_NAME
from sky_drones.utils import RoleEmployeeBasedPermission


class UploadImages(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def post(self, request, facility_id):
        files = request.FILES.getlist('images')
        if files:
            uploaded_files = []
            for file in files:
                unique_filename = str(uuid.uuid4())
                url = upload_to_s3(file, unique_filename)
                if url:
                    facility = Facility.objects.get(pk=facility_id)
                    file_instance = FileStorageItem.objects.create(
                        file_name=unique_filename,
                        path=url,
                        facility=facility
                    )
                    uploaded_files.append(file_instance)
                else:
                    return Response({'error': 'Failed to upload files to S3'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            serializer = FileStorageItemSerializer(uploaded_files, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response({'error': 'No files found'}, status=status.HTTP_400_BAD_REQUEST)


def upload_to_s3(file, unique_filename):
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY)
    bucket_name = BUCKET_NAME
    try:
        s3.upload_fileobj(file, bucket_name, unique_filename)
        url = f"https://{bucket_name}.s3.amazonaws.com/{unique_filename}"
        return url
    except Exception as e:
        print("Error uploading file to S3:", e)
        return None
