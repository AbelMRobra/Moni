from rest_framework.test import APITestCase
from rest_framework import status


class ApiMoniTestCase(APITestCase):

    def setUp(self):
        self.url_api = '/api/api-applicants/'

    def test_post_data(self):
        # A template is created
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

    
