import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingButton } from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import { OAuthButton } from "@/components/OAuthButton";
import { Toast, ToastType } from "@/components/Toast";

const Signup = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name must be 100 characters or less";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.agreeToTerms) {
      setToast({ message: "Please agree to Terms of Service", type: "error" });
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      setToast({ message: "Account created! Redirecting to dashboard...", type: "success" });
      // In real app: navigate to dashboard
    }, 2000);
  };

  const handleExpandForm = () => {
    setIsExpanded(true);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Clear error on change
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  return (
    <AuthLayout
      heroTitle="Turn your passion into a business."
      heroSubtitle="Sign up to AgentRank and unlock the tools you need to start, run, and grow your Etsy shop."
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create an account</h2>
          <p className="text-gray-600">Sign up for a free AgentRank account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google OAuth */}
          <OAuthButton provider="google" text="Sign up with Google" />

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Progressive Disclosure */}
          {!isExpanded ? (
            <LoadingButton type="button" onClick={handleExpandForm}>
              Sign up with email
            </LoadingButton>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={() => errors.name && setErrors({ ...errors, name: "" })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-[#2D5BFF] focus:border-[#2D5BFF]"
                    }`}
                    placeholder="Jane Doe"
                    maxLength={100}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1.5">{errors.name}</p>}
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
                  showStrength
                />

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                    className="mt-1 rounded border-gray-300 text-[#2D5BFF] focus:ring-[#2D5BFF]"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-[#2D5BFF] hover:underline">
                      Terms of Service
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <LoadingButton type="submit" isLoading={isLoading}>
                  Sign up
                </LoadingButton>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Terms Text (only shown when not expanded) */}
          {!isExpanded && (
            <p className="text-xs text-center text-gray-600">
              By signing up you agree to our{" "}
              <a href="#" className="text-[#2D5BFF] hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#2D5BFF] hover:underline">
                Terms of Service
              </a>
            </p>
          )}
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-600">
          Already signed up?{" "}
          <Link to="/login" className="text-[#2D5BFF] font-semibold hover:underline">
            Sign in
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

export default Signup;
