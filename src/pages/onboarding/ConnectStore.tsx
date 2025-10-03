import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "@/lib/api/client";
import { Toast, ToastType } from "@/components/Toast";

const ConnectStore = () => {
  const navigate = useNavigate();
  const [shopDomain, setShopDomain] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleConnectShop = async () => {
    if (!shopDomain.trim()) {
      setToast({ message: "Please enter your Shopify store domain", type: "error" });
      return;
    }

    // Normalize shop domain
    let shop = shopDomain.trim().toLowerCase();

    // Remove protocol if present
    shop = shop.replace(/^https?:\/\//, '');

    // Add .myshopify.com if not present
    if (!shop.includes('.myshopify.com')) {
      shop = `${shop}.myshopify.com`;
    }

    setIsLoading(true);

    try {
      const { authUrl } = await APIClient.initiateShopifyOAuth(shop);

      // Store shop domain in sessionStorage for callback
      sessionStorage.setItem('shopify_shop', shop);

      // Redirect to Shopify OAuth
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('OAuth init failed:', error);
      setToast({
        message: error.message || "Failed to initiate Shopify connection",
        type: "error"
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-frost rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-2xl w-full p-12 md:p-16 text-center"
      >
        {/* Logo Combination */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
            <Zap className="w-8 h-8 text-accent" />
          </div>
          <span className="text-2xl text-muted-foreground">+</span>
          <div className="w-16 h-16 rounded-full bg-[#96BF48]/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#96BF48]">S</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Connect Your Shopify Store
        </h1>

        {/* Subheading */}
        <p className="text-lg text-muted-foreground mb-8 font-light max-w-xl mx-auto">
          By connecting your Shopify store, you unlock ACP feed generation, product optimization, and real-time sync with ChatGPT Shopping.
        </p>

        {/* Trust Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            {/* Avatar Circles */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/80 to-cyan-400/80 border-2 border-white"></div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 fill-yellow-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>

            {/* Text */}
            <span className="text-sm font-medium text-foreground">
              4.8 · Helping Shopify merchants get discovered
            </span>
          </div>
        </div>

        {/* Shop Domain Input */}
        <div className="space-y-4 max-w-md mx-auto mb-8">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Store className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={shopDomain}
              onChange={(e) => setShopDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConnectShop()}
              placeholder="your-store-name"
              className="w-full pl-12 pr-4 py-4 glass-panel rounded-full text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent text-center font-medium"
              disabled={isLoading}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/70 text-sm">
              .myshopify.com
            </div>
          </div>

          <button
            onClick={handleConnectShop}
            disabled={isLoading || !shopDomain.trim()}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 disabled:cursor-not-allowed text-accent-foreground font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-accent/30 transition-all inline-flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Connect Shopify
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
        </div>
      </motion.div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ConnectStore;
