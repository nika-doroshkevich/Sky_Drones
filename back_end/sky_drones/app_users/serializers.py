from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username')
        password = attrs.get('password')

        if not email or UserModel.objects.filter(email=email).exists():
            raise ValidationError({"detail": "Please choose another email"})

        if not password or len(password) < 8:
            raise ValidationError({"detail": "Please choose another password, min 8 characters"})

        if not username:
            raise ValidationError({"detail": "Please choose another username"})

        user_obj = UserModel.objects.create_user(email=attrs['email'], password=attrs['password'])
        user_obj.username = attrs['username']
        user_obj.role = attrs['role']
        user_obj.save()
        return user_obj


class UserLoginSerializer(TokenObtainPairSerializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError({"detail": "Invalid credentials"})

        if user.status != 'ACTIVE':
            raise serializers.ValidationError({"detail": "The account is inactive. Contact an admin"})
        else:
            user.last_login = timezone.now()
            user.save()

        token = super().validate(attrs)
        token['role'] = user.role
        token['email'] = email
        token['id'] = user.id
        return token


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)

    class Meta:
        model = UserModel
        fields = ('id', 'title', 'email', 'username', 'phone', 'job_title', 'status', 'role', 'company')

    def join_company(self, instance, validated_data):
        user = self.context['request'].user
        if user.company_id is None:
            instance.company = validated_data.get('company', instance.company)
            instance.save()
            return instance
        else:
            raise ValidationError({"detail": "You have already joined the company. "
                                             "If you made a mistake, please contact an admin"})
