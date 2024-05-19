from rest_framework import serializers

from defects.models import Defect
from sky_drones.mixins import AmazonS3Mixin


class DefectDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Defect
        fields = ('id', 'deleted')


class DefectWithUrlSerializer(serializers.ModelSerializer, AmazonS3Mixin):
    file_storage_item_path = serializers.SerializerMethodField()

    class Meta:
        model = Defect
        fields = ('id', 'name', 'severity', 'description',
                  'file_storage_item', 'file_storage_item_path', 'inspection')

    @staticmethod
    def get_file_storage_item_path(obj):
        if obj.file_storage_item:
            return DefectWithUrlSerializer.get_generated_presigned_url(obj.file_storage_item.file_name)
        return None
