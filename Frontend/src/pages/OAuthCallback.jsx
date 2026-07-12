import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function OAuthCallback() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socialLogin } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`OAuth error: ${errorParam}`);
        setTimeout(() => navigate("/auth"), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code received.");
        setTimeout(() => navigate("/auth"), 3000);
        return;
      }

      const result = await socialLogin(provider, code);
      if (result.success) {
        const state = searchParams.get("state");
        if (state && state.startsWith("/cad/")) {
          window.location.href = state;
        } else {
          navigate(state || "/dashboard", { replace: true });
        }
      } else {
        setError(result.error || "Social login failed.");
        setTimeout(() => navigate("/auth"), 3000);
      }
    };

    handleCallback();
  }, [provider, searchParams, navigate, socialLogin]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {error ? (
          <>
            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(var(--destructive))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <p className="text-sm text-destructive text-center max-w-xs">
              {error}
            </p>
            <p className="text-xs text-muted-foreground">
              Redirecting to login...
            </p>
          </>
        ) : (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">
              Completing {provider} sign-in...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
