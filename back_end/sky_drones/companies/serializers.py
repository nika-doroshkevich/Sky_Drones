from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user

        if (user.role == 'EMPLOYEE_OWNER' and validated_data['company_type'] == 'INSPECTING') or (
                user.role == 'CUSTOMER_OWNER' and validated_data['company_type'] == 'INSPECTED'):
            if user.company_id is None:
                company = Company.objects.create(**validated_data)
                user.company_id = company.id
                user.save()
                return company
            else:
                raise ValidationError({"detail": "You have already created a company"})
        elif user.role == 'EMPLOYEE_OWNER' and validated_data['company_type'] == 'INSPECTED':
            company = Company.objects.create(**validated_data)
            return company
        else:
            raise ValidationError({"detail": "You don't have enough user rights"})
