from django.contrib.auth import logout, get_user_model
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

from sky_drones.utils import RoleOwnerBasedPermission
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer

UserModel = get_user_model()


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        user = serializer.create(request.data)
        if user:
            return Response(status=status.HTTP_201_CREATED)
        return Response({"detail": "Failed to create user"}, status=status.HTTP_400_BAD_REQUEST)


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


class UserList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated, RoleOwnerBasedPermission,)
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = UserModel.objects.filter(status='ACTIVE', company_id=user.company_id)
        return queryset


class UserAPIUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserModel.objects.all()
    serializer_class = UserSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        route_name = request.resolver_match.url_name

        if route_name == 'join-company':
            serializer.instance = serializer.join_company(instance, serializer.validated_data)

        self.perform_update(serializer)

        return Response(serializer.data)


class AllView(APIView):
    def get(self, request):
        return Response({'data': "Hello"}, status=status.HTTP_200_OK)
