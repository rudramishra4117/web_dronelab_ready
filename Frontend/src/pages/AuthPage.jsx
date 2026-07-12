import { useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { LoginForm } from "../components/login-form";
import { SignupForm } from "../components/signup-form";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "signup" ? false : true;
  const [showLogin, setShowLogin] = useState(initialTab);
  const { isAuthenticated, isLoading } = useAuth();

  // Prevent flicker while checking auth state
  if (isLoading) {
    return null;
  }

  // Redirect if already logged in
  if (isAuthenticated) {
    const nextUrl = searchParams.get("next");
    if (nextUrl && nextUrl.startsWith("/cad/")) {
      window.location.href = nextUrl;
      return null;
    }
    return <Navigate to={nextUrl || "/dashboard"} replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="bg-muted p-1 rounded-lg inline-flex">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showLogin
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!showLogin
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                }`}
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </button>
          </div>
        </div>

        {showLogin ? (
          <LoginForm onToggle={() => setShowLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}
