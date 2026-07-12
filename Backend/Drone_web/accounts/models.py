from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Extends Django's built-in User model with social auth provider information.
    """

    PROVIDER_CHOICES = [
        ("local", "Local"),
        ("google", "Google"),
        ("github", "GitHub"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    provider = models.CharField(
        max_length=20, choices=PROVIDER_CHOICES, default="local"
    )
    provider_id = models.CharField(max_length=255, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = "user_profiles"

    def __str__(self):
        return f"{self.user.username} ({self.provider})"
