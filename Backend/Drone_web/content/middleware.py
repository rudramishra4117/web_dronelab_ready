from datetime import date

from django.utils.deprecation import MiddlewareMixin

from .models import DailyActiveUser


class DailyUserTrackingMiddleware(MiddlewareMixin):
    """
    Records one DailyActiveUser row per authenticated user per day.
    Uses get_or_create so duplicate requests on the same day are ignored.
    Only runs on non-admin, non-static, non-media paths.
    """

    EXCLUDED_PREFIXES = ("/admin/", "/static/", "/media/")

    def process_request(self, request):
        # Skip unauthenticated users and excluded paths
        if not request.user or not request.user.is_authenticated:
            return
        if any(request.path.startswith(prefix) for prefix in self.EXCLUDED_PREFIXES):
            return

        today = date.today()
        try:
            DailyActiveUser.objects.get_or_create(user=request.user, date=today)
        except Exception:
            # Never let tracking errors break the request
            pass
