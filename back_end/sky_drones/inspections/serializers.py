from rest_framework import serializers

from inspections.models import Inspection


class InspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = '__all__'
