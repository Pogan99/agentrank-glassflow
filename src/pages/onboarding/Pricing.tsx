import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";

type BillingCycle = "monthly" | "yearly";
type Plan = "free" | "starter" | "pro";

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const handleSelectPlan = (plan: Plan) => {
    // Save selected plan to localStorage
    localStorage.setItem("selectedPlan", plan);
    localStorage.setItem("billingCycle", billingCycle);
    navigate("/onboarding/setup");
  };

  const plans = {
    free: {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      subtitle: "Get started",
      features: [
        "1 ACP optimization/day",
        "Weekly sync",
        "Basic validation",
        "ACP Readiness Score",
      ],
    },
    starter: {
      name: "Starter",
      monthlyPrice: 9.99,
      yearlyPrice: 9.16,
      yearlyTotal: 109.99,
      subtitle: "Most popular",
      popular: true,
      features: [
        "20 optimizations/day",
        "Daily sync",
        "Advanced validation",
        "Trend & keyword alerts",
        "Category rank snapshot",
      ],
    },
    pro: {
      name: "Pro",
      monthlyPrice: 49.99,
      yearlyPrice: 41.66,
      yearlyTotal: 499.99,
      subtitle: "For power sellers",
      features: [
        "Unlimited optimizations",
        "Hourly sync",
        "10 blog posts/month",
        "Priority backlinks",
        "Priority support",
        "99.9% SLA",
      ],
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Choose your plan
          </h1>
          <p className="text-lg text-muted-foreground font-light mb-8">
            Find the perfect plan to get your Etsy shop discovered in ChatGPT Shopping.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className={`text-sm ${billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 transition-colors"
            >
              <motion.div
                className="absolute top-1 w-5 h-5 rounded-full bg-accent"
                animate={{ left: billingCycle === "monthly" ? 4 : 28 }}
                transition={{ duration: 0.3 }}
              />
            </button>
            <span className={`text-sm ${billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
          </div>

          {billingCycle === "yearly" && (
            <p className="text-accent text-sm">Save up to 58% with yearly billing</p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Free Card */}
          <GlassCard className="backdrop-blur-lg border border-white/10 shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-2 text-foreground">{plans.free.name}</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-foreground">${plans.free.monthlyPrice}</span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            <p className="text-muted-foreground text-sm mb-6">{plans.free.subtitle}</p>

            <div className="space-y-3 mb-8">
              {plans.free.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan("free")}
              className="w-full text-foreground hover:text-accent font-medium py-3 rounded-full transition-all"
            >
              Continue
            </button>
          </GlassCard>

          {/* Starter Card */}
          <GlassCard className="backdrop-blur-lg border border-white/10 shadow-xl p-8 ring-2 ring-accent bg-gradient-to-br from-accent/5 to-transparent">
            <p className="text-accent text-sm font-semibold mb-2">MOST POPULAR</p>
            <h3 className="text-2xl font-bold mb-2 text-foreground">{plans.starter.name}</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-foreground">
                ${billingCycle === "monthly" ? plans.starter.monthlyPrice : plans.starter.yearlyPrice}
              </span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-muted-foreground text-sm mb-2">
                ${plans.starter.yearlyTotal} billed yearly
              </p>
            )}
            <p className="text-muted-foreground text-sm mb-6">{plans.starter.subtitle}</p>

            <div className="space-y-3 mb-8">
              {plans.starter.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan("starter")}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-full transition-all"
            >
              Get Started
            </button>
          </GlassCard>

          {/* Pro Card */}
          <GlassCard className="backdrop-blur-lg border border-white/10 shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-2 text-foreground">{plans.pro.name}</h3>
            <div className="mb-2">
              <span className="text-4xl font-bold text-foreground">
                ${billingCycle === "monthly" ? plans.pro.monthlyPrice : plans.pro.yearlyPrice}
              </span>
              <span className="text-muted-foreground">/mo</span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-muted-foreground text-sm mb-2">
                ${plans.pro.yearlyTotal} billed yearly
              </p>
            )}
            <p className="text-muted-foreground text-sm mb-6">{plans.pro.subtitle}</p>

            <div className="space-y-3 mb-8">
              {plans.pro.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleSelectPlan("pro")}
              className="w-full text-foreground hover:text-accent font-medium py-3 rounded-full transition-all"
            >
              Get Started
            </button>
          </GlassCard>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
          <div className="w-2 h-2 rounded-full bg-accent"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default Pricing;
