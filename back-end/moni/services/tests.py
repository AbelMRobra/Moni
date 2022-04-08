import json
import requests
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework.test import APITestCase
from rest_framework import status


class ApiMoniTestCase(APITestCase):
    
    def setUp(self):
        self.url_api = '/api/api-applicants/'
        self.url_login = '/login/'
        self.url_moni_api = f"{settings.ENDPOINT_MONI}"
        self.credential = settings.CREDENTIAL_MONI

    def test_moni_api(self):
        url = self.url_moni_api + '37725830'
        request_type = 'GET'
        headers = {'credential': self.credential}
        response = requests.request(request_type, url, headers=headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_data(self):
        url = self.url_api
        data = {
            "first_name": "Test",
            "last_name": "Test",
            "dni": 37725830,
            "gender": "Masculino",
            "email": "Test@gmail.com",
            "amount": 105
        }
        
        response = self.client.post(url, data, format='json', follow=True)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_login(self):
        # Create superuser
        user = User.objects.create(username = 'admin', password = make_password('admin'))
        # Login
        url_login = self.url_login
        data = {
            "username": "admin",
            "password": "admin"
        }
        
        response = self.client.post(url_login, data, format='json', follow=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)



    
