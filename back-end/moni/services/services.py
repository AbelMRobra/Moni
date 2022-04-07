import json
import requests
from django.conf import settings
from .models import ApiQueries, Applicant


class ServiceMoni:

    def __init__(self, instance):
        self.url = f"{settings.ENDPOINT_MONI}{instance['dni']}"
        self.credential = settings.CREDENTIAL_MONI
        self.instance = instance

    def send_data_to_moni(self):
        request_type = 'GET'
        headers = {'credential': self.credential}
        api_url = self.url
        response = self.send_request(request_type, api_url, headers)
        return response

    def send_request(self, request_type, api_url, headers, data = False):
        try:

            applicant = Applicant.objects.get(dni = self.instance['dni'])

            if data:
                response = requests.request(request_type, api_url, headers=headers, data=data)

            else:
                response = requests.request(request_type, api_url, headers=headers)

            if json.loads(response.content)['status'] == 'approve':
                applicant.status = True
                response_api = {
                    'title': 'Aprobado!',
                    'message':'estas aprobado por Moni!, comunicate con ellos para mas información',
                    'icon': 'success'
                    }

            else:
                applicant.status = False
                response_api = {
                    'title': 'Oh oh',
                    'message':'desafortunadamente, Moni no puede darte un credito ahora',
                    'icon': 'warning'
                    }

            applicant.save()
            record = ApiQueries.objects.create(**{
                'applicant': applicant,
                'status_api': response.status_code,
                'response_api': response.content
                })
      
        except Exception as error:
            response_api = {
                    'title': 'Ups!',
                    'message':'tuvimos problemas para conectarnos con la Api de Moni, intente nuevamente mas tarde',
                    'icon': 'error'
                    }

            record = ApiQueries.objects.create(**{
                'applicant': Applicant.objects.get(dni = self.instance['dni']),
                'status_api': 'error',
                'response_api': str(error.args)
                })

        return response_api