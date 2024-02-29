import boto3
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView


class UploadImage(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return Response({'error': 'No file found'}, status=status.HTTP_400_BAD_REQUEST)

        url = upload_to_s3(file)
        if url:
            return Response({'url': url}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to upload file to S3'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def upload_to_s3(file):
    s3 = boto3.client('s3', aws_access_key_id='YOUR_ACCESS_KEY', aws_secret_access_key='YOUR_SECRET_KEY')
    bucket_name = 'YOUR_BUCKET_NAME'
    file_name = file.name
    try:
        s3.upload_fileobj(file, bucket_name, file_name)
        url = f"https://{bucket_name}.s3.amazonaws.com/{file_name}"
        return url
    except Exception as e:
        print("Error uploading file to S3:", e)
        return None
