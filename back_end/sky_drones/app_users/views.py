from django.contrib.auth import logout, get_user_model
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer

UserModel = get_user_model()


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):

        email = request.data['email'].strip()
        username = request.data['username'].strip()
        password = request.data['password'].strip()

        if not email or UserModel.objects.filter(email=email).exists():
            return Response({'detail': 'Please choose another email.'}, status=status.HTTP_400_BAD_REQUEST)

        if not password or len(password) < 8:
            return Response({'detail': 'Please choose another password, min 8 characters.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if not username:
            return Response({'detail': 'Please choose another username.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            user = serializer.create(request.data)
            if user:
                return Response(status=status.HTTP_201_CREATED)
        return Response({'detail': 'Failed to create user.'}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(TokenObtainPairView):
    serializer_class = UserLoginSerializer
    permission_classes = (permissions.AllowAny,)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer


class AllView(APIView):
    def get(self, request):
        return Response({'data': "Hello"}, status=status.HTTP_200_OK)
