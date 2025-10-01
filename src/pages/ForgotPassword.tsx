import { Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/InputField";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Reset your password</h1>
            <p className="text-muted-foreground font-light">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form className="space-y-6">
            <InputField
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
            />

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
