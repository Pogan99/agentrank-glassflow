import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";

interface SetupStep {
  id: number;
  label: string;
  status: "pending" | "loading" | "completed";
}

const Setup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [setupComplete, setSetupComplete] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [storeConnected, setStoreConnected] = useState(false);

  const [steps, setSteps] = useState<SetupStep[]>([
    { id: 1, label: "Connecting to Etsy", status: "pending" },
    { id: 2, label: "Importing products", status: "pending" },
    { id: 3, label: "Generating ACP feed", status: "pending" },
    { id: 4, label: "Analyzing optimization opportunities", status: "pending" },
  ]);

  useEffect(() => {
    // Check if coming from OAuth callback
    const connected = searchParams.get("connected") === "true";
    setStoreConnected(connected);

    // Load from localStorage
    const savedStoreStatus = localStorage.getItem("storeConnected");
    if (savedStoreStatus === "true" || connected) {
      setStoreConnected(true);
      localStorage.setItem("storeConnected", "true");
    }

    // Start setup sequence
    startSetupSequence(connected || savedStoreStatus === "true");
  }, [searchParams]);

  const startSetupSequence = async (connected: boolean) => {
    if (!connected) {
      // Skip to complete if no store connected
      setTimeout(() => {
        setSetupComplete(true);
        triggerConfetti();
      }, 1000);
      return;
    }

    // Step 1: Connect to Etsy (instant)
    setSteps((prev) => prev.map((s) => (s.id === 1 ? { ...s, status: "loading" } : s)));
    await delay(500);
    setSteps((prev) => prev.map((s) => (s.id === 1 ? { ...s, status: "completed" } : s)));

    // Step 2: Import products (2-5s with count animation)
    setSteps((prev) => prev.map((s) => (s.id === 2 ? { ...s, status: "loading" } : s)));

    // Animate product count from 0 to random number (50-200)
    const targetCount = Math.floor(Math.random() * 150) + 50;
    for (let i = 0; i <= targetCount; i += 5) {
      setProductCount(Math.min(i, targetCount));
      await delay(50);
    }
    setProductCount(targetCount);

    await delay(1000);
    setSteps((prev) => prev.map((s) => (s.id === 2 ? { ...s, status: "completed" } : s)));

    // Step 3: Generate ACP feed
    setSteps((prev) => prev.map((s) => (s.id === 3 ? { ...s, status: "loading" } : s)));
    await delay(2000);
    setSteps((prev) => prev.map((s) => (s.id === 3 ? { ...s, status: "completed" } : s)));

    // Step 4: Analyze opportunities
    setSteps((prev) => prev.map((s) => (s.id === 4 ? { ...s, status: "loading" } : s)));
    await delay(2000);
    setSteps((prev) => prev.map((s) => (s.id === 4 ? { ...s, status: "completed" } : s)));

    // Complete setup
    await delay(500);
    setSetupComplete(true);
    triggerConfetti();

    // Save completion to localStorage
    localStorage.setItem("onboardingComplete", "true");
    localStorage.setItem("productCount", targetCount.toString());
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#66E3FF", "#FFFFFF", "#5AC8E8"],
    });
  };

  const getStepIcon = (step: SetupStep) => {
    if (step.status === "completed") {
      return <Check className="w-5 h-5 text-accent" />;
    }
    if (step.status === "loading") {
      return <Loader2 className="w-5 h-5 text-accent animate-spin" />;
    }
    return <div className="w-5 h-5 rounded-full border-2 border-white/20"></div>;
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-frost rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-2xl w-full p-12 md:p-16 text-center bg-gradient-to-br from-accent/10 to-transparent"
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="w-10 h-10 text-accent" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            You're all set!
          </h1>

          {/* Dynamic Message */}
          <p className="text-lg text-muted-foreground mb-8 font-light max-w-xl mx-auto">
            {storeConnected
              ? `Your Etsy shop is connected and we've found ${productCount} products ready to optimize for ChatGPT Shopping.`
              : "You're ready to explore AgentRanked. Connect your Etsy shop anytime from the dashboard to start optimizing."}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-4 rounded-full shadow-lg shadow-accent/30 transition-all inline-flex items-center gap-2 mb-8"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-accent"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-frost rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl max-w-2xl w-full p-12 md:p-16 text-center"
      >
        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-accent animate-spin"></div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
          Setting up your workspace...
        </h1>

        {/* Progress Checklist */}
        <div className="space-y-4 text-left max-w-md mx-auto mb-12">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              {getStepIcon(step)}
              <span
                className={`text-sm ${
                  step.status === "completed"
                    ? "text-foreground"
                    : step.status === "loading"
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.label}
                {step.id === 2 && step.status === "loading" && productCount > 0
                  ? ` (${productCount} found)`
                  : ""}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Setup;
