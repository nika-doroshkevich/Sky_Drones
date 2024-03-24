import tempfile
import uuid
from io import BytesIO
from math import atan2, cos, sin

import boto3
from botocore.exceptions import ClientError
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from wand.color import Color
from wand.drawing import Drawing
from wand.image import Image

from facilities.models import Facility
from file_storage_items.models import FileStorageItem
from file_storage_items.serializers import FileStorageItemSerializer
from properties import ACCESS_KEY, SECRET_ACCESS_KEY, BUCKET_NAME, REGION_NAME, SIGNATURE_VERSION
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
                    file_instance = save_file_storage_item_to_db(unique_filename, url, facility_id)
                    uploaded_files.append(file_instance)
                else:
                    return Response({'error': 'Failed to upload files to S3'},
                                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            serializer = FileStorageItemSerializer(uploaded_files, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        else:
            return Response({'error': 'No files found'}, status=status.HTTP_400_BAD_REQUEST)


class ImagesList(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def get(self, request, facility_id):
        image_urls = get_images_urls_from_database(facility_id)
        if image_urls:
            return Response({'image_urls': image_urls}, status=status.HTTP_200_OK)
        else:
            return Response({'error': "Error getting images"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ImageOverlay(APIView):
    permission_classes = (permissions.IsAuthenticated, RoleEmployeeBasedPermission,)

    def post(self, request):
        input_image = request.data.get('selected_image_url')
        elements = request.data.get('drawn_elements')
        facility_id = request.data.get('facility_id')

        input_image_file = download_image_from_s3(input_image)
        if input_image_file:
            img_buffer = draw_elements_on_image(input_image_file, elements)

            unique_filename = str(uuid.uuid4())
            url_of_modified_image = upload_to_s3(img_buffer, unique_filename)

            if url_of_modified_image:
                save_file_storage_item_to_db(unique_filename, url_of_modified_image, facility_id)
            else:
                return Response({'error': 'Failed to upload file to S3'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            key = get_key_from_url(url_of_modified_image)
            image_url = get_generated_presigned_url(key)

            return Response({'image_url': image_url}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Error downloading image from S3'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


def get_images_urls_from_database(facility_id):
    try:
        facility = Facility.objects.get(pk=facility_id)
        images = FileStorageItem.objects.filter(facility=facility)

        urls = []
        for image in images:
            url = get_generated_presigned_url(image.file_name)
            urls.append(url)

        return urls
    except Facility.DoesNotExist:
        return None
    except Exception as e:
        print("Error getting images from database:", e)
        return None


def download_image_from_s3(image_url):
    try:
        key = get_key_from_url(image_url)

        s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY,
                          region_name=REGION_NAME, config=boto3.session.Config(signature_version=SIGNATURE_VERSION))
        response = s3.get_object(Bucket=BUCKET_NAME, Key=key)
        image_data = response['Body'].read()

        with tempfile.NamedTemporaryFile(delete=False) as temp_image:
            temp_image.write(image_data)

        return temp_image.name

    except ClientError as e:
        print("Error downloading image from S3:", e)
        return None


def draw_elements_on_image(image_path, elements):
    with Image(filename=image_path) as img:
        with Drawing() as draw:
            for element in elements:
                if element['type'] == 'circle':
                    center = element['center']
                    radius = element['radius']
                    color = Color(element['color'])
                    line_width = element['lineWidth']
                    draw.stroke_color = color
                    draw.stroke_width = line_width
                    draw.fill_opacity = 0
                    draw.circle((center['x'], center['y']), (radius['x'], radius['y']))
                elif element['type'] == 'square':
                    start_pos = element['startPos']
                    end_pos = element['endPos']
                    color = Color(element['color'])
                    line_width = element['lineWidth']
                    draw.stroke_color = color
                    draw.stroke_width = line_width
                    draw.fill_opacity = 0
                    draw.rectangle(left=start_pos['x'], top=start_pos['y'],
                                   right=end_pos['x'], bottom=end_pos['y'])
                elif element['type'] == 'arrow' or element['type'] == 'line':
                    start_pos = element['startPos']
                    end_pos = element['endPos']
                    color = Color(element['color'])
                    line_width = element['lineWidth']
                    draw.stroke_color = color
                    draw.stroke_width = line_width
                    draw.fill_opacity = 0
                    draw.line(start=(start_pos['x'], start_pos['y']),
                              end=(end_pos['x'], end_pos['y']))
                    if element['type'] == 'arrow':
                        arrow_size = calculate_arrow_size(line_width)
                        angle = atan2(end_pos['y'] - start_pos['y'], end_pos['x'] - start_pos['x'])
                        rotated_start_point = rotate_point(-arrow_size, -arrow_size, angle)
                        rotated_end_point = rotate_point(-arrow_size, arrow_size, angle)

                        with Drawing() as arrow_draw:
                            arrow_draw.fill_color = color
                            arrow_draw.stroke_color = color
                            arrow_draw.stroke_width = line_width
                            arrow_draw.fill_opacity = 1

                            arrow_draw.translate(end_pos['x'], end_pos['y'])
                            arrow_draw.polygon([(0, 0), (rotated_start_point[0], rotated_start_point[1]),
                                                (rotated_end_point[0], rotated_end_point[1])])
                            arrow_draw(img)

            draw(img)

        img_buffer = BytesIO()
        img.save(file=img_buffer)
        img_buffer.seek(0)

        return img_buffer


def rotate_point(x, y, angle):
    new_x = x * cos(angle) - y * sin(angle)
    new_y = x * sin(angle) + y * cos(angle)
    return new_x, new_y


def calculate_arrow_size(line_width):
    if line_width < 5:
        return line_width + 5 - (line_width - 1) * 0.5
    else:
        return line_width


def get_key_from_url(url):
    parts = url.split("/")
    url_after_fourth_part = "".join(parts[3:])

    question_mark_index = url_after_fourth_part.rfind("?")

    if question_mark_index != -1:
        return url_after_fourth_part[:question_mark_index]
    else:
        return url_after_fourth_part


def get_generated_presigned_url(key):
    s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_ACCESS_KEY,
                      region_name=REGION_NAME, config=boto3.session.Config(signature_version=SIGNATURE_VERSION))

    return s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': BUCKET_NAME, 'Key': key},
        ExpiresIn=86400
    )


def save_file_storage_item_to_db(unique_filename, url, facility_id):
    facility = Facility.objects.get(pk=facility_id)
    return FileStorageItem.objects.create(
        file_name=unique_filename,
        path=url,
        facility=facility
    )
