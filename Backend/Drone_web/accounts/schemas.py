from ninja import Schema
from pydantic import EmailStr, field_validator


class RegisterSchema(Schema):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def username_min_length(cls, v: str) -> str:
        if len(v.strip()) < 3:
            raise ValueError("Username must be at least 3 characters")
        return v.strip()

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginSchema(Schema):
    email: str
    password: str


class SocialAuthSchema(Schema):
    code: str


class RefreshTokenSchema(Schema):
    refresh_token: str


class UserSchema(Schema):
    id: int
    username: str
    email: str
    avatar_url: str | None = None
    provider: str = "local"


class TokenResponseSchema(Schema):
    access_token: str
    refresh_token: str
    user: UserSchema


class ErrorSchema(Schema):
    detail: str


class MessageSchema(Schema):
    message: str
