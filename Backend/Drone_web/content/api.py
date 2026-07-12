from typing import List, Optional
from datetime import date

from ninja import Router, Schema
from django.shortcuts import get_object_or_404

from .models import Bootcamp, GalleryImage, SiteStatistics, CadModel

router = Router(tags=["content"])


# ─── Schemas ────────────────────────────────────────────────────────────────────


class SiteStatsSchema(Schema):
    students_trained: int
    updated_at: Optional[date] = None


class BootcampSchema(Schema):
    id: int
    title: str
    location: str
    participants: int
    image_url: str


# ─── Endpoints ──────────────────────────────────────────────────────────────────


@router.get("/stats", response=SiteStatsSchema)
def get_site_stats(request):
    """Return global site statistics (students trained, etc.)."""
    stats = SiteStatistics.get_instance()
    return SiteStatsSchema(
        students_trained=stats.students_trained,
        updated_at=stats.updated_at.date() if stats.updated_at else None,
    )


@router.get("/bootcamps", response=List[BootcampSchema])
def list_bootcamps(request):
    """Return a list of all bootcamps ordered by newest first."""
    bootcamps = Bootcamp.objects.all().order_by("-created_at")
    result = []
    for b in bootcamps:
        result.append(
            BootcampSchema(
                id=b.id,
                title=b.title,
                location=b.location,
                participants=b.participants,
                image_url=b.image.url if b.image else "",
            )
        )
    return result


@router.get("/bootcamps/{bootcamp_id}", response=BootcampSchema)
def get_bootcamp(request, bootcamp_id: int):
    """Return a single bootcamp."""
    b = get_object_or_404(Bootcamp, pk=bootcamp_id)
    return BootcampSchema(
        id=b.id,
        title=b.title,
        location=b.location,
        participants=b.participants,
        image_url=request.build_absolute_uri(b.image.url) if b.image else "",
    )


# ─── Gallery ─────────────────────────────────────────────────────────────────────


class GalleryImageSchema(Schema):
    id: int
    image_url: str


@router.get("/gallery", response=List[GalleryImageSchema])
def list_gallery(request):
    """Return all bootcamp gallery images ordered by newest first."""
    images = GalleryImage.objects.all()
    return [
        GalleryImageSchema(
            id=img.id,
            image_url=img.image.url,
        )
        for img in images
    ]


# ─── CAD Models ──────────────────────────────────────────────────────────────────


@router.get("/cad-models")
def get_cad_models(request):
    """Return 3D CAD models in the manifest format expected by the editor."""
    models = CadModel.objects.all()
    
    manifest = {
        "templates": [],
        "components": {}
    }
    
    for m in models:
        item = {
            "id": str(m.id),
            "name": m.name,
            "file": request.build_absolute_uri(m.file.url) if m.file else "",
            "image": request.build_absolute_uri(m.image.url) if m.image else None,
        }
        
        category = m.category.lower()
        if category == "templates":
            manifest["templates"].append(item)
        else:
            if category not in manifest["components"]:
                manifest["components"][category] = []
            manifest["components"][category].append(item)
            
    return manifest


# ─── Hero Images ─────────────────────────────────────────────────────────────────


class HeroImageSchema(Schema):
    id: int
    title: str
    image_url: str


@router.get("/hero-images", response=List[HeroImageSchema])
def get_hero_images(request):
    """Return all active hero images ordered by 'order'."""
    from .models import HeroImage
    images = HeroImage.objects.filter(is_active=True)
    return [
        HeroImageSchema(
            id=img.id,
            title=img.title,
            image_url=request.build_absolute_uri(img.image.url) if img.image else "",
        )
        for img in images
    ]


# ─── What We Do Items ────────────────────────────────────────────────────────────


class WhatWeDoItemSchema(Schema):
    id: int
    title: str
    description: str
    image_url: str


@router.get("/what-we-do", response=List[WhatWeDoItemSchema])
def get_what_we_do_items(request):
    """Return all active What We Do items ordered by 'order'."""
    from .models import WhatWeDoItem
    items = WhatWeDoItem.objects.filter(is_active=True)
    return [
        WhatWeDoItemSchema(
            id=item.id,
            title=item.title,
            description=item.description,
            image_url=request.build_absolute_uri(item.image.url) if item.image else "",
        )
        for item in items
    ]

# --- Proof of Concept (PoC) Items -----------------------------------------------

class PocGalleryImageSchema(Schema):
    id: int
    image_url: str

class PocItemSchema(Schema):
    id: int
    title: str
    navbar_name: str
    description: str
    main_image_url: str
    gallery_images: List[PocGalleryImageSchema]

@router.get("/pocs", response=List[PocItemSchema])
def get_pocs(request):
    """Return all active PoC items ordered by 'order'."""
    from .models import PocItem
    items = PocItem.objects.filter(is_active=True)
    result = []
    for item in items:
        gallery = [
            PocGalleryImageSchema(
                id=g.id,
                image_url=request.build_absolute_uri(g.image.url) if g.image else "",
            )
            for g in item.gallery_images.all()
        ]
        result.append(
            PocItemSchema(
                id=item.id,
                title=item.title,
                navbar_name=item.navbar_name,
                description=item.description,
                main_image_url=request.build_absolute_uri(item.main_image.url) if item.main_image else "",
                gallery_images=gallery,
            )
        )
    return result

@router.get("/pocs/{poc_id}", response=PocItemSchema)
def get_poc(request, poc_id: int):
    """Return a single PoC item."""
    from .models import PocItem
    item = get_object_or_404(PocItem, pk=poc_id, is_active=True)
    gallery = [
        PocGalleryImageSchema(
            id=g.id,
            image_url=request.build_absolute_uri(g.image.url) if g.image else "",
        )
        for g in item.gallery_images.all()
    ]
    return PocItemSchema(
        id=item.id,
        title=item.title,
        navbar_name=item.navbar_name,
        description=item.description,
        main_image_url=request.build_absolute_uri(item.main_image.url) if item.main_image else "",
        gallery_images=gallery,
    )

