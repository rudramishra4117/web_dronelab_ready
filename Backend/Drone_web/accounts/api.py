from django.contrib.auth.models import User
from django.http import HttpRequest
from ninja import Router

from .auth_backend import (
    JWTAuth,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from .models import UserProfile
from .schemas import (
    ErrorSchema,
    LoginSchema,
    RefreshTokenSchema,
    RegisterSchema,
    SocialAuthSchema,
    TokenResponseSchema,
    UserSchema,
)
from .social import exchange_github_code, exchange_google_code

router = Router(tags=["auth"])


def _build_user_schema(user: User) -> UserSchema:
    """Helper to build a UserSchema from a User model instance."""
    profile = getattr(user, "profile", None)
    return UserSchema(
        id=user.id,
        username=user.username,
        email=user.email,
        avatar_url=profile.avatar_url if profile else None,
        provider=profile.provider if profile else "local",
    )


def _build_token_response(user: User) -> dict:
    """Helper to build a full token response dict."""
    return {
        "access_token": create_access_token(user),
        "refresh_token": create_refresh_token(user),
        "user": _build_user_schema(user),
    }


# ─── Standard Registration ──────────────────────────────────────────────────────


@router.post("/register", response={201: TokenResponseSchema, 400: ErrorSchema})
def register(request: HttpRequest, payload: RegisterSchema):
    """Register a new user with username, email, and password."""
    if User.objects.filter(username=payload.username).exists():
        return 400, {"detail": "Username already taken"}

    if User.objects.filter(email=payload.email).exists():
        return 400, {"detail": "Email already registered"}

    user = User.objects.create_user(
        username=payload.username,
        email=payload.email,
        password=payload.password,
    )
    UserProfile.objects.create(user=user, provider="local")

    return 201, _build_token_response(user)


# ─── Standard Login ─────────────────────────────────────────────────────────────


@router.post("/login", response={200: TokenResponseSchema, 401: ErrorSchema})
def login(request: HttpRequest, payload: LoginSchema):
    """Login with email and password."""
    try:
        user = User.objects.get(email=payload.email)
    except User.DoesNotExist:
        return 401, {"detail": "Invalid email or password"}

    if not user.check_password(payload.password):
        return 401, {"detail": "Invalid email or password"}

    return 200, _build_token_response(user)


# ─── Google OAuth ────────────────────────────────────────────────────────────────


@router.post("/google", response={200: TokenResponseSchema, 400: ErrorSchema})
def google_auth(request: HttpRequest, payload: SocialAuthSchema):
    """Exchange a Google authorization code for JWT tokens."""
    user_info = exchange_google_code(payload.code)
    if not user_info:
        return 400, {"detail": "Failed to authenticate with Google"}

    return 200, _get_or_create_social_user(user_info, "google")


# ─── GitHub OAuth ────────────────────────────────────────────────────────────────


@router.post("/github", response={200: TokenResponseSchema, 400: ErrorSchema})
def github_auth(request: HttpRequest, payload: SocialAuthSchema):
    """Exchange a GitHub authorization code for JWT tokens."""
    user_info = exchange_github_code(payload.code)
    if not user_info:
        return 400, {"detail": "Failed to authenticate with GitHub"}

    return 200, _get_or_create_social_user(user_info, "github")


def _get_or_create_social_user(user_info: dict, provider: str) -> dict:
    """
    Find an existing user by provider + provider_id, or by email.
    If no user exists, create one. Returns a token response dict.
    """
    email = user_info["email"]
    provider_id = user_info["provider_id"]
    name = user_info.get("name", "")
    avatar_url = user_info.get("avatar_url")

    # Try to find by provider + provider_id first
    try:
        profile = UserProfile.objects.get(provider=provider, provider_id=provider_id)
        # Update avatar if changed
        if avatar_url and profile.avatar_url != avatar_url:
            profile.avatar_url = avatar_url
            profile.save(update_fields=["avatar_url"])
        return _build_token_response(profile.user)
    except UserProfile.DoesNotExist:
        pass

    # Try to find by email (user might have registered locally first)
    try:
        user = User.objects.get(email=email)
        # Link social provider to existing user
        profile, created = UserProfile.objects.get_or_create(
            user=user,
            defaults={
                "provider": provider,
                "provider_id": provider_id,
                "avatar_url": avatar_url,
            },
        )
        if not created:
            profile.provider = provider
            profile.provider_id = provider_id
            profile.avatar_url = avatar_url
            profile.save()
        return _build_token_response(user)
    except User.DoesNotExist:
        pass

    # Create a new user
    # Generate a unique username from the name or email
    base_username = name.replace(" ", "").lower() if name else email.split("@")[0]
    username = base_username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1

    user = User.objects.create_user(
        username=username,
        email=email,
        password=None,  # Social users don't have a password
    )
    if name:
        parts = name.split(" ", 1)
        user.first_name = parts[0]
        if len(parts) > 1:
            user.last_name = parts[1]
        user.save(update_fields=["first_name", "last_name"])

    UserProfile.objects.create(
        user=user,
        provider=provider,
        provider_id=provider_id,
        avatar_url=avatar_url,
    )

    return _build_token_response(user)


# ─── Token Refresh ───────────────────────────────────────────────────────────────


@router.post("/refresh", response={200: TokenResponseSchema, 401: ErrorSchema})
def refresh_token(request: HttpRequest, payload: RefreshTokenSchema):
    """Get a new access token using a valid refresh token."""
    token_payload = decode_token(payload.refresh_token)
    if token_payload is None:
        return 401, {"detail": "Invalid or expired refresh token"}

    if token_payload.get("type") != "refresh":
        return 401, {"detail": "Invalid token type"}

    try:
        user = User.objects.get(id=token_payload["user_id"])
    except User.DoesNotExist:
        return 401, {"detail": "User not found"}

    return 200, _build_token_response(user)


# ─── Current User ────────────────────────────────────────────────────────────────


@router.get("/me", response=UserSchema, auth=JWTAuth())
def get_current_user(request: HttpRequest):
    """Get the currently authenticated user's information."""
    return _build_user_schema(request.auth)
