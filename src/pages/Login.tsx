import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingButton } from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { OAuthButton } from "@/components/OAuthButton";
import { Toast, ToastType } from "@/components/Toast";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setToast({ message: "Please fill in all required fields.", type: "error" });
      return false;
    }

    return true;
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setErrors({ ...errors, email: "Please enter a valid email" });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Simulate success
      setToast({ message: "Welcome back! Redirecting...", type: "success" });
      // In real app: navigate to dashboard
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error on change
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <AuthLayout
      heroTitle=""
      heroSubtitle=""
    >
      <div className="space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2D5BFF] to-cyan-500 bg-clip-text text-transparent">
              AgentRank
            </h1>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in to AgentRank</h2>
          <p className="text-gray-600">Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google OAuth */}
          <OAuthButton provider="google" text="Continue with Google" />

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={handleEmailBlur}
              onFocus={() => errors.email && setErrors({ ...errors, email: "" })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#2D5BFF] focus:border-[#2D5BFF]"
              }`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1.5">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            onFocus={() => errors.password && setErrors({ ...errors, password: "" })}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#2D5BFF] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <LoadingButton type="submit" isLoading={isLoading}>
            Sign in with email
          </LoadingButton>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#2D5BFF] font-semibold hover:underline">
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
