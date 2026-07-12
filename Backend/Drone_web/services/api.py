from ninja import Router
from .models import Service
from django.http import HttpRequest
import os

router = Router()

@router.get("/")
def get_services(request: HttpRequest):
    services = Service.objects.filter(is_active=True).order_by('order', 'title')
    return [
        {
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "image": request.build_absolute_uri(s.thumbnail.url) if s.thumbnail else "",
            "url": s.url,
            "is_external": s.is_external,
        }
        for s in services
    ]
