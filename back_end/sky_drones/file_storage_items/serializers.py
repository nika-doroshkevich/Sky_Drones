from rest_framework import serializers

from .models import FileStorageItem


class FileStorageItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileStorageItem
        fields = '__all__'
