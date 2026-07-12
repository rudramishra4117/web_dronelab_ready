from datetime import date, timedelta

from django.db.models import Count
from django.db.models.functions import TruncDate


def dashboard_callback(request, context):
    """
    Unfold admin dashboard callback.
    Injects the last 30 days of daily active user counts as chart data.
    """
    # Lazy import to avoid circular at module load time
    from .models import DailyActiveUser, SiteStatistics, Bootcamp

    today = date.today()
    thirty_days_ago = today - timedelta(days=29)

    # Build a date → count lookup from the DB
    qs = (
        DailyActiveUser.objects
        .filter(date__gte=thirty_days_ago)
        .annotate(day=TruncDate("date"))
        .values("day")
        .annotate(count=Count("id"))
        .order_by("day")
    )
    count_map = {row["day"]: row["count"] for row in qs}

    # Fill every day in the range (even days with 0 visits)
    labels = []
    data = []
    for i in range(30):
        d = thirty_days_ago + timedelta(days=i)
        labels.append(d.strftime("%b %d"))
        data.append(count_map.get(d, 0))

    # Summary cards
    try:
        stats = SiteStatistics.get_instance()
        students_trained = stats.students_trained
    except Exception:
        students_trained = 0

    total_bootcamps = Bootcamp.objects.count()
    today_users = count_map.get(today, 0)
    total_tracked = DailyActiveUser.objects.count()

    context.update(
        {
            "chart_labels": labels,
            "chart_data": data,
            "students_trained": students_trained,
            "total_bootcamps": total_bootcamps,
            "today_active_users": today_users,
            "total_tracked_visits": total_tracked,
        }
    )
    return context
