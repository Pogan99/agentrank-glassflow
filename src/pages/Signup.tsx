import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingButton } from "@/components/LoadingButton";
import { OAuthButton } from "@/components/OAuthButton";
import { Toast, ToastType } from "@/components/Toast";

const Signup = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [emailSent, setEmailSent] = useState(false);

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

    try {
      // Send magic link
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          type: "signup",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Something went wrong");
      }

      setIsLoading(false);
      setEmailSent(true);
      setToast({
        message: `Check your email! We sent a magic link to ${formData.email}. Link expires in 15 minutes.`,
        type: "success",
      });
    } catch (error: any) {
      setIsLoading(false);
      setToast({
        message: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  const handleExpandForm = () => {
    setIsExpanded(true);
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
      heroTitle="Turn your Shopify store into an AI-ready commerce engine"
      heroSubtitle="Get discovered in ChatGPT Shopping with AgentRanked's automated ACP optimization."
    >
      <div className="space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent to-cyan-300 bg-clip-text text-transparent">
              AgentRank
            </h1>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
          <p className="text-muted-foreground">Sign up for a free AgentRanked account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google OAuth */}
          <OAuthButton provider="google" text="Sign up with Google" />

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background/80 backdrop-blur-sm text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Progressive Disclosure */}
          {!isExpanded ? (
            <LoadingButton type="button" onClick={handleExpandForm} disabled={emailSent}>
              Sign up with email
            </LoadingButton>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4 overflow-hidden"
              >
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onFocus={() => errors.name && setErrors({ ...errors, name: "" })}
                    disabled={emailSent}
                    className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.name
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/20 focus:ring-accent focus:border-accent"
                    }`}
                    placeholder="Enter your name"
                    maxLength={100}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1.5">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={handleEmailBlur}
                    onFocus={() => errors.email && setErrors({ ...errors, email: "" })}
                    disabled={emailSent}
                    className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 transition-all text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "border-white/20 focus:ring-accent focus:border-accent"
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-1.5">{errors.email}</p>}
                </div>

                {/* Submit Button */}
                <LoadingButton type="submit" isLoading={isLoading} disabled={emailSent}>
                  Sign up
                </LoadingButton>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Terms Text (only shown when not expanded) */}
          {!isExpanded && (
            <p className="text-xs text-center text-muted-foreground">
              By signing up you agree to our{" "}
              <a href="#" className="text-accent hover:text-accent/80 underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-accent hover:text-accent/80 underline">
                Terms of Service
              </a>
            </p>
          )}
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already signed up?{" "}
          <Link to="/login" className="text-accent hover:text-accent/80 font-semibold underline">
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
