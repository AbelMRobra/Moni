from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .custom_auth import IsAuthenticatedCustom
from .models import Applicant
from .serializers import ApplicantSerialiazers
from .services import ServiceMoni


class LoginViewset(viewsets.GenericViewSet):

    permission_classes = (AllowAny,)
    def login(self, request):
        try:
            username = request.data['username']
            password = request.data['password']

        except:
            response = {'message': "Tienes que ingrsar un nombre de usuario y una contraseña"}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(username=username)
            if not check_password(password, user.password):
                response = {'message': "Contraseña invalida"}
                return Response(response, status=status.HTTP_404_NOT_HTTP_400_BAD_REQUESTFOUND)

            token, _ = Token.objects.get_or_create(user=user)
            return Response(token.key, status=status.HTTP_200_OK)

        except Exception as error:
            response = {'message': str(error.args)}
            return Response(response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ApplicantViewset(viewsets.ModelViewSet):

    queryset = Applicant.objects.all()
    serializer_class = ApplicantSerialiazers
    permission_classes = (IsAuthenticatedCustom,)
    authentication_classes = [TokenAuthentication]

    def create(self, request, *args, **kwargs):

        if request.data['dni'] == "":
            response = {'message': "Debes ingresar todos los datos"}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

        if len(Applicant.objects.filter(dni = request.data['dni'])) == 1:
            response = {'message': 'Hola de nuevo!'}
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            response = {'message': 'Bienvenido a bordo!'}

        service_moni = ServiceMoni(request.data)
        response_api = service_moni.send_data_to_moni()
        response['message'] += ', ' + response_api['message']
        response['title'] = response_api['title']
        response['icon'] = response_api['icon']
        return Response(response, status=status.HTTP_201_CREATED)
