"""
URL configuration for Drone_web project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from accounts.api import router as auth_router
from content.api import router as content_router
from services.api import router as services_router

api = NinjaAPI(
    title="DroneLab API",
    version="1.0.0",
    description="API for the DroneLab web application",
)

api.add_router("/auth/", auth_router)
api.add_router("/content/", content_router)
api.add_router("/services/", services_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
