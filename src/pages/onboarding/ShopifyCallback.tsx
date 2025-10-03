import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { APIClient } from "@/lib/api/client";

const ShopifyCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connecting to your Shopify store...");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const shop = searchParams.get("shop");
      const state = searchParams.get("state");
      const error = searchParams.get("error");

      // Check for OAuth errors
      if (error) {
        setStatus("error");
        setMessage(`OAuth failed: ${error}`);
        setTimeout(() => navigate("/onboarding/connect"), 3000);
        return;
      }

      // Validate required parameters
      if (!code || !shop) {
        setStatus("error");
        setMessage("Missing OAuth parameters. Please try again.");
        setTimeout(() => navigate("/onboarding/connect"), 3000);
        return;
      }

      try {
        // Call the OAuth callback Edge Function
        const result = await APIClient.handleShopifyCallback(code, shop, state || "");

        if (result.success) {
          setStatus("success");
          setMessage("Store connected successfully! Importing products...");

          // Wait a moment then navigate to setup
          setTimeout(() => {
            navigate("/onboarding/setup");
          }, 2000);
        } else {
          throw new Error(result.error || "Failed to connect store");
        }
      } catch (error: any) {
        console.error("OAuth callback failed:", error);
        setStatus("error");
        setMessage(error.message || "Failed to connect store. Please try again.");
        setTimeout(() => navigate("/onboarding/connect"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-frost rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-md w-full p-12 text-center"
      >
        {/* Status Icon */}
        <div className="mb-6 flex justify-center">
          {status === "loading" && (
            <Loader2 className="w-16 h-16 text-accent animate-spin" />
          )}
          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <XCircle className="w-16 h-16 text-red-500" />
            </motion.div>
          )}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold mb-3 text-foreground">
          {status === "loading" && "Connecting..."}
          {status === "success" && "Success!"}
          {status === "error" && "Connection Failed"}
        </h2>

        <p className="text-muted-foreground font-light">{message}</p>

        {/* Loading Dots */}
        {status === "loading" && (
          <div className="flex justify-center gap-1 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-accent"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ShopifyCallback;
