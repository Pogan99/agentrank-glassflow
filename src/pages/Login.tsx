import { useState, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingButton } from "@/components/LoadingButton";
import { OAuthButton } from "@/components/OAuthButton";
import { Toast, ToastType } from "@/components/Toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });
  }, [navigate]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailBlur = () => {
    if (email && !validateEmail(email)) {
      setError("Please enter a valid email");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setToast({
        message: error.message || "Failed to sign in with Google",
        type: "error",
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || "Invalid email or password");
      setToast({
        message: error.message || "Failed to sign in. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <AuthLayout
      heroTitle="Welcome back! Optimize your Shopify catalog for ChatGPT Shopping."
      heroSubtitle="Sign in to continue optimizing your products for AI discovery."
    >
      <div className="space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              AgentRanked
            </h1>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Sign in to AgentRanked</h2>
          <p className="text-muted-foreground">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google OAuth */}
          <OAuthButton provider="google" text="Continue with Google" onClick={handleGoogleLogin} />

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background/80 backdrop-blur-sm text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              onBlur={handleEmailBlur}
              onFocus={() => setError("")}
              className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-white/20 focus:ring-accent focus:border-accent"
              }`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {error && <p className="text-sm text-red-500 mt-1.5">{error}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => setError("")}
              className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-foreground placeholder:text-muted-foreground ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-white/20 focus:ring-accent focus:border-accent"
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <LoadingButton type="submit" isLoading={isLoading}>
            Sign in
          </LoadingButton>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent hover:text-accent/80 font-semibold underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </AuthLayout>
  );
};

export default Login;
