from rest_framework import serializers
from .models import Applicant


class ApplicantSerialiazers(serializers.ModelSerializer):

    class Meta:
        model = Applicant
        fields = '__all__'