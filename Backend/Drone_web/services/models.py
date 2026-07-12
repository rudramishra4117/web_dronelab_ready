from django.db import models

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to="services/", blank=True, null=True)
    url = models.CharField(max_length=255, help_text="Can be an internal route (e.g., /services/simulation) or an external URL")
    is_external = models.BooleanField(default=False)
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title
