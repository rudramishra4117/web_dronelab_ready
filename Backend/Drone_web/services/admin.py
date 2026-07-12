from django.contrib import admin
from unfold.admin import ModelAdmin
from .models import Service

@admin.register(Service)
class ServiceAdmin(ModelAdmin):
    list_display = ('title', 'order', 'is_active', 'is_external', 'url')
    list_filter = ('is_active', 'is_external')
    search_fields = ('title', 'description', 'url')
    list_editable = ('order', 'is_active')
