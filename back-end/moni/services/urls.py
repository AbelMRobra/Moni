from django.urls import path
from django.urls.conf import include
from rest_framework import routers

from .views import ApplicantViewset, LoginViewset


router = routers.DefaultRouter()
router.register(r'api-applicants', ApplicantViewset)

urlpatterns = [
   path('login/', LoginViewset.as_view({'post': 'login'})),
   path("api/", include(router.urls)), 
]