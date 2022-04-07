from django.db import models
from django.core.validators import MinValueValidator

# Create your models here.
class Applicant(models.Model):

    first_name = models.CharField(max_length=50, verbose_name="Nombre del aplicante")
    last_name = models.CharField(max_length=50, verbose_name="Apellido del aplicante")
    dni = models.IntegerField(verbose_name="Nº de documento (DNI)", unique=True)
    gender = models.CharField(max_length=50, verbose_name="Genero del aplicante")
    email = models.EmailField(verbose_name="Email de contacto")
    amount = models.FloatField(
        validators=[MinValueValidator(0.0)]
    )
    status = models.BooleanField(verbose_name="Aprobado por la API", default=False)

    class Meta:
        verbose_name="Aplicante"
        verbose_name_plural="Aplicantes"

    def __str__(self):
        return f"{self.first_name}, {self.last_name}"


class ApiQueries(models.Model):

    applicant = models.ForeignKey(Applicant, on_delete=models.CASCADE, verbose_name="Aplicante")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Creado el')
    status_api = models.IntegerField(verbose_name='Status code de la respuesta')
    response_api = models.CharField(max_length=100, verbose_name='Respuesta de la API')

    class Meta:
        verbose_name="Registro de consultas"
        verbose_name_plural="Registros de consultas"

    def __str__(self):
        return f"{self.applicant.first_name}, {self.applicant.last_name} - {self.created_at}"