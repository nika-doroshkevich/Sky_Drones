from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from companies.models import Company
from .models import Facility


class FacilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Facility
        fields = '__all__'

    def update(self, instance, validated_data):
        user = self.context['request'].user
        company_name = validated_data.get('company')

        try:
            company = Company.objects.get(name=company_name)
        except Company.DoesNotExist:
            raise ValidationError({"detail": "Company does not exist"})

        if user.company_id == company.id:
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()
            return instance
        else:
            raise ValidationError({"detail": "You don't have enough user rights"})
