from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from unfold.admin import ModelAdmin
from .models import UserProfile


admin.site.unregister(User)
admin.site.unregister(Group)


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    pass


@admin.register(Group)
class GroupAdmin(BaseGroupAdmin, ModelAdmin):
    pass


from django.utils.html import format_html

@admin.register(UserProfile)
class UserProfileAdmin(ModelAdmin):
    list_display = ("user", "provider", "provider_id", "avatar_preview")
    list_filter = ("provider",)
    search_fields = ("user__username", "user__email")

    @admin.display(description="Avatar")
    def avatar_preview(self, obj):
        if obj.avatar_url:
            return format_html(
                '<img src="{}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />',
                obj.avatar_url
            )
        return "-"
