from django.contrib import admin
from django.template.response import TemplateResponse
from django.utils.html import format_html
from unfold.admin import ModelAdmin

from .models import (
    Analytics,
    Bootcamp,
    CadModel,
    DailyActiveUser,
    GalleryImage,
    HeroImage,
    WhatWeDoItem,
    PocItem,
    PocGalleryImage,
    SiteStatistics,
)


# ─── Site Statistics (Singleton) ────────────────────────────────────────────────


@admin.register(SiteStatistics)
class SiteStatisticsAdmin(ModelAdmin):
    """
    Singleton admin — prevents adding new rows.
    Always redirects to the single existing record.
    Note: students_trained is auto-calculated from bootcamp participants.
    """

    list_display = ("students_trained", "updated_at")
    readonly_fields = ("students_trained", "updated_at")

    def has_add_permission(self, request):
        # Only allow adding if there is no record yet
        return not SiteStatistics.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False  # Never allow deleting the singleton

    def changelist_view(self, request, extra_context=None):
        """Redirect directly to the single instance edit page."""
        from django.http import HttpResponseRedirect
        from django.urls import reverse

        instance = SiteStatistics.get_instance()
        url = reverse(
            "admin:content_sitestatistics_change", args=[instance.pk]
        )
        return HttpResponseRedirect(url)


# ─── Bootcamp ────────────────────────────────────────────────────────────────────


@admin.register(Bootcamp)
class BootcampAdmin(ModelAdmin):
    list_display = ("title", "location", "participants", "image_preview", "created_at")
    search_fields = ("title", "location")
    ordering = ("-created_at",)

    fields = ("title", "image", "location", "participants")

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px; object-fit:cover;" />',
                obj.image.url,
            )
        return "—"

    image_preview.short_description = "Preview"


# ─── Daily Active Users (Read-only) ──────────────────────────────────────────────


@admin.register(DailyActiveUser)
class DailyActiveUserAdmin(ModelAdmin):
    list_display = ("user", "date")
    list_filter = ("date",)
    search_fields = ("user__username", "user__email")
    date_hierarchy = "date"
    ordering = ("-date",)
    readonly_fields = ("user", "date")

    def has_add_permission(self, request):
        return False  # Tracked automatically by middleware

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


# ─── Bootcamp Gallery Images ──────────────────────────────────────────────────────


@admin.register(GalleryImage)
class GalleryImageAdmin(ModelAdmin):
    list_display = ("image_preview", "uploaded_at")
    readonly_fields = ("image_preview", "uploaded_at")
    ordering = ("-uploaded_at",)

    fields = ("image", "image_preview", "uploaded_at")

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:100px; border-radius:8px; object-fit:cover;" />',
                obj.image.url,
            )
        return "—"

    image_preview.short_description = "Preview"


# ─── Dashboard & Analytics (Custom View) ─────────────────────────────────────────


@admin.register(Analytics)
class AnalyticsAdmin(ModelAdmin):
    """Overrides the list view to render our custom dashboard template."""
    
    def has_add_permission(self, request):
        return False
        
    def has_delete_permission(self, request, obj=None):
        return False
        
    def has_change_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        from .admin_views import dashboard_callback
        
        # Build base context required by Unfold templates
        context = {
            **self.admin_site.each_context(request),
            "title": "Dashboard & Analytics",
            "opts": self.model._meta,
            "has_add_permission": self.has_add_permission(request),
        }
        
        # Inject chart data
        context = dashboard_callback(request, context)
        
        return TemplateResponse(
            request,
            "admin/dashboard.html",
            context,
        )


# --- CAD Models -----------------------------------------------------------------

@admin.register(CadModel)
class CadModelAdmin(ModelAdmin):
    list_display = ("name", "category", "image_preview", "uploaded_at")
    list_filter = ("category",)
    search_fields = ("name", "category")
    ordering = ("-uploaded_at",)

    fields = ("name", "category", "file", "image", "image_preview", "uploaded_at")
    readonly_fields = ("image_preview", "uploaded_at")

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px; object-fit:cover;" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Preview"

# --- Hero Images ----------------------------------------------------------------

@admin.register(HeroImage)
class HeroImageAdmin(ModelAdmin):
    list_display = ("title", "order", "is_active", "image_preview")
    list_filter = ("is_active",)
    list_editable = ("order", "is_active")
    ordering = ("order",)

    fields = ("title", "image", "image_preview", "order", "is_active")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px; object-fit:cover;" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Preview"

# --- What We Do Items -----------------------------------------------------------

@admin.register(WhatWeDoItem)
class WhatWeDoItemAdmin(ModelAdmin):
    list_display = ("title", "order", "is_active", "image_preview")
    list_filter = ("is_active",)
    list_editable = ("order", "is_active")
    ordering = ("order",)

    fields = ("title", "description", "image", "image_preview", "order", "is_active")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px; object-fit:cover;" />',
                obj.image.url,
            )
        return "-"

    image_preview.short_description = "Preview"


# --- Proof of Concept (PoC) Items -----------------------------------------------

class PocGalleryImageInline(admin.TabularInline):
    model = PocGalleryImage
    extra = 1

@admin.register(PocItem)
class PocItemAdmin(ModelAdmin):
    list_display = ("title", "order", "is_active", "image_preview")
    list_filter = ("is_active",)
    list_editable = ("order", "is_active")
    ordering = ("order",)
    inlines = [PocGalleryImageInline]

    fields = ("title", "navbar_name", "description", "main_image", "image_preview", "order", "is_active")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.main_image:
            return format_html(
                '<img src="{}" style="height:60px; border-radius:6px; object-fit:cover;" />',
                obj.main_image.url,
            )
        return "-"

    image_preview.short_description = "Preview"

