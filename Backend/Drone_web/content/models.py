from datetime import date

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Sum
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


class SiteStatistics(models.Model):
    """
    Singleton model — only one row should ever exist.
    Holds global site-wide stats editable by the admin.
    """

    students_trained = models.PositiveIntegerField(
        default=0,
        verbose_name="Total Students Trained",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "site_statistics"
        verbose_name = "Site Statistics"
        verbose_name_plural = "Site Statistics"

    def __str__(self):
        return f"Site Statistics (Students Trained: {self.students_trained})"

    @classmethod
    def get_instance(cls):
        """Return the singleton instance, creating it if necessary."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Bootcamp(models.Model):
    """Represents a bootcamp event organized by DroneLab."""

    title = models.CharField(max_length=200, verbose_name="Bootcamp Title")
    image = models.ImageField(
        upload_to="bootcamp_images/",
        verbose_name="Bootcamp Image",
    )
    location = models.CharField(max_length=200, blank=True, verbose_name="Location")
    participants = models.PositiveIntegerField(
        default=0, verbose_name="Number of Participants"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bootcamps"
        ordering = ["-created_at"]
        verbose_name = "Bootcamp"
        verbose_name_plural = "Bootcamps"

    def __str__(self):
        return f"{self.title} — {self.location}"


# ─── Signals: Auto-update SiteStatistics.students_trained ───────────────────────

def _sync_students_trained():
    """Recalculate and save the total students trained from all bootcamps."""
    total = Bootcamp.objects.aggregate(total=Sum("participants"))["total"] or 0
    stats = SiteStatistics.get_instance()
    stats.students_trained = total
    stats.save()


@receiver(post_save, sender=Bootcamp)
def bootcamp_saved(sender, instance, **kwargs):
    _sync_students_trained()


# ─── Proxy Models for Admin Navigation ──────────────────────────────────────────


class Analytics(SiteStatistics):
    """Proxy model just to create a 'Dashboard & Analytics' menu item in the admin."""
    class Meta:
        proxy = True
        verbose_name = "Dashboard & Analytics"
        verbose_name_plural = "Dashboard & Analytics"



@receiver(post_delete, sender=Bootcamp)
def bootcamp_deleted(sender, instance, **kwargs):
    _sync_students_trained()


class DailyActiveUser(models.Model):
    """
    Tracks unique authenticated user visits per day.
    One row per (user, date) — enforced by unique_together.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="daily_visits")
    date = models.DateField(default=date.today, verbose_name="Date")

    class Meta:
        db_table = "daily_active_users"
        unique_together = ("user", "date")
        ordering = ["-date"]
        verbose_name = "Daily Active User"
        verbose_name_plural = "Daily Active Users"

    def __str__(self):
        return f"{self.user.username} — {self.date}"


class GalleryImage(models.Model):
    """A single photo in the Bootcamp Gallery section."""

    image = models.ImageField(
        upload_to="gallery/",
        verbose_name="Image",
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "gallery_images"
        ordering = ["-uploaded_at"]
        verbose_name = "Gallery Image"
        verbose_name_plural = "Gallery Images"

    def __str__(self):
        return f"Gallery Image ({self.uploaded_at.date()})"


class CadModel(models.Model):
    """Stores 3D CAD models and their metadata."""

    name = models.CharField(max_length=200, verbose_name="Model Name")
    category = models.CharField(
        max_length=100, 
        help_text="e.g., templates, propellers, frames, motors",
        verbose_name="Category"
    )
    file = models.FileField(
        upload_to="cad_models/files/",
        verbose_name="3D Model File (.step, .stl, etc.)"
    )
    image = models.ImageField(
        upload_to="cad_models/images/",
        null=True, 
        blank=True,
        verbose_name="Thumbnail Image"
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cad_models"
        ordering = ["-uploaded_at"]
        verbose_name = "CAD Model"
        verbose_name_plural = "CAD Models"

    def __str__(self):
        return f"{self.name} ({self.category})"


class HeroImage(models.Model):
    """Images for the landing page hero carousel."""

    title = models.CharField(max_length=100, blank=True, verbose_name="Image Title")
    image = models.ImageField(upload_to="hero_images/", verbose_name="Hero Image")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")

    class Meta:
        db_table = "hero_images"
        ordering = ["order", "id"]
        verbose_name = "Hero Image"
        verbose_name_plural = "Hero Images"

    def __str__(self):
        return self.title or f"Hero Image {self.id}"


class WhatWeDoItem(models.Model):
    """Items for the 'What We Do' section on the landing page."""

    title = models.CharField(max_length=200, verbose_name="Title")
    description = models.TextField(verbose_name="Description")
    image = models.ImageField(upload_to="what_we_do/", verbose_name="Image")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")




class PocItem(models.Model):
    """Proof of Concept items."""

    title = models.CharField(max_length=200, verbose_name="Title")
    navbar_name = models.CharField(max_length=50, blank=True, verbose_name="Navbar Name", help_text="e.g. 'PoC 1' (will fallback to auto-generated if left blank)")
    description = models.TextField(verbose_name="Description")
    main_image = models.ImageField(upload_to="pocs/", verbose_name="Main Image", help_text="This image is required and will be the first image in the carousel.")
    is_active = models.BooleanField(default=True, verbose_name="Active")
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")

    class Meta:
        db_table = "poc_items"
        ordering = ["order", "id"]
        verbose_name = "PoC Item"
        verbose_name_plural = "PoC Items"

    def __str__(self):
        return self.title


class PocGalleryImage(models.Model):
    """Additional images for a PoC Item carousel."""
    poc_item = models.ForeignKey(PocItem, on_delete=models.CASCADE, related_name="gallery_images")
    image = models.ImageField(upload_to="pocs/gallery/", verbose_name="Image")
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")

    class Meta:
        db_table = "poc_gallery_images"
        ordering = ["order", "id"]
        verbose_name = "PoC Gallery Image"
        verbose_name_plural = "PoC Gallery Images"

    def __str__(self):
        return f"Gallery Image for {self.poc_item.title}"
