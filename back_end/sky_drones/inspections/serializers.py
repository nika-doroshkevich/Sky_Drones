from rest_framework import serializers

from .models import Inspection


class InspectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = ('id', 'name', 'reason', 'facility')


class InspectionSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    reason = serializers.SerializerMethodField()
    facility = serializers.SerializerMethodField()
    facility_name = serializers.SerializerMethodField()
    pilot_username = serializers.SerializerMethodField()
    inspector_username = serializers.SerializerMethodField()

    class Meta:
        model = Inspection
        fields = ('id', 'name', 'reason', 'facility', 'facility_name', 'priority',
                  'pilot', 'pilot_username', 'inspector', 'inspector_username', 'status')

    @staticmethod
    def get_name(obj):
        return obj.name

    @staticmethod
    def get_reason(obj):
        return obj.reason

    @staticmethod
    def get_facility(obj):
        return obj.facility.name

    @staticmethod
    def get_facility_name(obj):
        if obj.facility:
            return obj.facility.name
        return None

    @staticmethod
    def get_pilot_username(obj):
        if obj.pilot:
            return obj.pilot.username
        return None

    @staticmethod
    def get_inspector_username(obj):
        if obj.inspector:
            return obj.inspector.username
        return None
