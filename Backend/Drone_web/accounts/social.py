import requests
from django.conf import settings


def exchange_google_code(code: str) -> dict | None:
    """
    Exchange a Google authorization code for user info.
    Returns a dict with: email, name, provider_id, avatar_url
    or None if the exchange fails.
    """
    # Step 1: Exchange authorization code for access token
    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": f"{settings.FRONTEND_URL}/auth/callback/google",
        "grant_type": "authorization_code",
    }

    try:
        token_response = requests.post(token_url, data=token_data, timeout=10)
        if token_response.status_code != 200:
            print(f"Google Token Error: {token_response.status_code} - {token_response.text}", flush=True)
            return None

        token_json = token_response.json()
        access_token = token_json.get("access_token")
        if not access_token:
            return None

        # Step 2: Fetch user info using the access token
        userinfo_url = "https://www.googleapis.com/oauth2/v2/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        userinfo_response = requests.get(userinfo_url, headers=headers, timeout=10)

        if userinfo_response.status_code != 200:
            return None

        userinfo = userinfo_response.json()

        return {
            "email": userinfo.get("email"),
            "name": userinfo.get("name", ""),
            "provider_id": str(userinfo.get("id")),
            "avatar_url": userinfo.get("picture"),
        }
    except requests.RequestException:
        return None


def exchange_github_code(code: str) -> dict | None:
    """
    Exchange a GitHub authorization code for user info.
    Returns a dict with: email, name, provider_id, avatar_url
    or None if the exchange fails.
    """
    # Step 1: Exchange authorization code for access token
    token_url = "https://github.com/login/oauth/access_token"
    token_data = {
        "code": code,
        "client_id": settings.GITHUB_CLIENT_ID,
        "client_secret": settings.GITHUB_CLIENT_SECRET,
        "redirect_uri": f"{settings.FRONTEND_URL}/auth/callback/github",
    }
    headers = {"Accept": "application/json"}

    try:
        token_response = requests.post(
            token_url, data=token_data, headers=headers, timeout=10
        )
        if token_response.status_code != 200:
            return None

        token_json = token_response.json()
        access_token = token_json.get("access_token")
        if not access_token:
            return None

        # Step 2: Fetch user info
        user_headers = {
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        user_response = requests.get(
            "https://api.github.com/user", headers=user_headers, timeout=10
        )
        if user_response.status_code != 200:
            return None

        user_data = user_response.json()

        # Step 3: Fetch primary email (GitHub may not expose email in user profile)
        email = user_data.get("email")
        if not email:
            emails_response = requests.get(
                "https://api.github.com/user/emails",
                headers=user_headers,
                timeout=10,
            )
            if emails_response.status_code == 200:
                emails = emails_response.json()
                primary_email = next(
                    (e for e in emails if e.get("primary") and e.get("verified")),
                    None,
                )
                if primary_email:
                    email = primary_email["email"]

        if not email:
            return None

        return {
            "email": email,
            "name": user_data.get("name") or user_data.get("login", ""),
            "provider_id": str(user_data.get("id")),
            "avatar_url": user_data.get("avatar_url"),
        }
    except requests.RequestException:
        return None
