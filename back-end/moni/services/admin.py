from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import *

# Register your models here.
class ApplicantResource(resources.ModelResource):
    class Meta:
        model = Applicant


class ApplicantAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('first_name', 'last_name',  'dni', 'email', 'amount')
    search_fields = ('first_name', 'last_name',  'dni', 'email')
    resources_class = ApplicantResource


class ApiQueriesResource(resources.ModelResource):
    class Meta:
        model = ApiQueries


class ApiQueriesAdmin(ImportExportModelAdmin, admin.ModelAdmin):
    list_display = ('applicant', 'created_at',  'status_api')
    search_fields = ('applicant__first_name', 'applicant__last_name',  'applicant__dni', 'applicant__email')
    resources_class = ApiQueriesResource


admin.site.register(Applicant, ApplicantAdmin)
admin.site.register(ApiQueries, ApiQueriesAdmin)