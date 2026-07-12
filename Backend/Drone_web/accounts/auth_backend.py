import jwt
import datetime
from django.conf import settings
from ninja.security import HttpBearer
from django.contrib.auth.models import User


def create_access_token(user: User) -> str:
    """Create a short-lived access token (15 minutes)."""
    payload = {
        "user_id": user.id,
        "username": user.username,
        "email": user.email,
        "type": "access",
        "exp": datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(minutes=15),
        "iat": datetime.datetime.now(datetime.timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")


def create_refresh_token(user: User) -> str:
    """Create a long-lived refresh token (7 days)."""
    payload = {
        "user_id": user.id,
        "type": "refresh",
        "exp": datetime.datetime.now(datetime.timezone.utc)
        + datetime.timedelta(days=7),
        "iat": datetime.datetime.now(datetime.timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")


def decode_token(token: str) -> dict | None:
    """Decode and validate a JWT token. Returns payload or None if invalid."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


class JWTAuth(HttpBearer):
    """
    Django Ninja HttpBearer authenticator.
    Validates the JWT access token and attaches the user to the request.
    """

    def authenticate(self, request, token: str):
        payload = decode_token(token)
        if payload is None:
            return None
        if payload.get("type") != "access":
            return None

        try:
            user = User.objects.get(id=payload["user_id"])
            return user
        except User.DoesNotExist:
            return None
